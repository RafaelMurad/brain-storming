import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';
import * as cheerio from 'cheerio';
import crypto from 'crypto';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3011;
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

app.use(helmet());
app.use(cors());
app.use(express.json());

const generateKey = () => `lp_${crypto.randomBytes(32).toString('hex')}`;

async function auth(req: any, res: any, next: any) {
  const key = req.headers['x-api-key'] || req.query.apiKey;
  if (!key) return res.status(401).json({ success: false, error: 'API key required' });
  const apiKey = await prisma.apiKey.findUnique({ where: { key } });
  if (!apiKey?.isActive) return res.status(401).json({ success: false, error: 'Invalid API key' });
  req.projectId = apiKey.projectId;
  next();
}

async function fetchMetadata(url: string): Promise<any> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LinkPreviewBot/1.0)',
        'Accept': 'text/html,application/xhtml+xml'
      },
      signal: controller.signal,
      redirect: 'follow'
    });
    clearTimeout(timeout);

    const html = await response.text();
    const $ = cheerio.load(html);

    const getMeta = (name: string) =>
      $(`meta[property="${name}"]`).attr('content') ||
      $(`meta[name="${name}"]`).attr('content') || '';

    const domain = new URL(url).hostname.replace('www.', '');

    return {
      url,
      title: getMeta('og:title') || $('title').text().trim() || null,
      description: getMeta('og:description') || getMeta('description') || null,
      image: getMeta('og:image') || getMeta('twitter:image') || null,
      favicon: $('link[rel="icon"]').attr('href') || $('link[rel="shortcut icon"]').attr('href') || `https://${domain}/favicon.ico`,
      siteName: getMeta('og:site_name') || domain,
      type: getMeta('og:type') || 'website',
      author: getMeta('author') || getMeta('article:author') || null,
      publishedAt: getMeta('article:published_time') || null,
      domain,
      statusCode: response.status,
      metadata: JSON.stringify({
        ogTitle: getMeta('og:title'),
        ogDescription: getMeta('og:description'),
        ogImage: getMeta('og:image'),
        ogType: getMeta('og:type'),
        ogUrl: getMeta('og:url'),
        twitterCard: getMeta('twitter:card'),
        twitterTitle: getMeta('twitter:title'),
        twitterDescription: getMeta('twitter:description'),
        twitterImage: getMeta('twitter:image'),
        themeColor: getMeta('theme-color'),
        canonical: $('link[rel="canonical"]').attr('href')
      })
    };
  } catch (error) {
    clearTimeout(timeout);
    throw error;
  }
}

app.post('/api/v1/projects', async (req, res) => {
  try {
    const project = await prisma.project.create({ data: { name: req.body.name } });
    const apiKey = await prisma.apiKey.create({
      data: { projectId: project.id, name: 'Default', key: generateKey() }
    });
    res.status(201).json({ success: true, data: { project, apiKey: { key: apiKey.key } } });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed' });
  }
});

// Get link preview
app.get('/api/v1/preview', auth, async (req: any, res) => {
  try {
    const { url, refresh } = req.query;
    if (!url) return res.status(400).json({ success: false, error: 'URL required' });

    // Validate URL
    try { new URL(url); } catch { return res.status(400).json({ success: false, error: 'Invalid URL' }); }

    // Check cache
    if (!refresh) {
      const cached = await prisma.preview.findFirst({
        where: { projectId: req.projectId, url, expiresAt: { gt: new Date() } }
      });
      if (cached) {
        return res.json({
          success: true,
          data: { ...cached, metadata: JSON.parse(cached.metadata), cached: true }
        });
      }
    }

    // Fetch fresh
    const metadata = await fetchMetadata(url);
    const preview = await prisma.preview.upsert({
      where: { id: 'temp' }, // Will create new
      create: {
        projectId: req.projectId,
        ...metadata,
        expiresAt: new Date(Date.now() + CACHE_TTL)
      },
      update: {}
    });

    // Actually create since upsert won't work well here
    const newPreview = await prisma.preview.create({
      data: {
        projectId: req.projectId,
        ...metadata,
        expiresAt: new Date(Date.now() + CACHE_TTL)
      }
    });

    res.json({
      success: true,
      data: { ...newPreview, metadata: JSON.parse(newPreview.metadata), cached: false }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch preview' });
  }
});

// Batch preview
app.post('/api/v1/preview/batch', auth, async (req: any, res) => {
  try {
    const { urls } = req.body;
    if (!urls?.length) return res.status(400).json({ success: false, error: 'URLs required' });

    const results = await Promise.allSettled(
      urls.slice(0, 10).map(async (url: string) => {
        try {
          const cached = await prisma.preview.findFirst({
            where: { projectId: req.projectId, url, expiresAt: { gt: new Date() } }
          });
          if (cached) return { ...cached, metadata: JSON.parse(cached.metadata), cached: true };

          const metadata = await fetchMetadata(url);
          const preview = await prisma.preview.create({
            data: { projectId: req.projectId, ...metadata, expiresAt: new Date(Date.now() + CACHE_TTL) }
          });
          return { ...preview, metadata: JSON.parse(preview.metadata), cached: false };
        } catch {
          return { url, error: 'Failed to fetch' };
        }
      })
    );

    res.json({
      success: true,
      data: results.map(r => r.status === 'fulfilled' ? r.value : { error: 'Failed' })
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Batch failed' });
  }
});

app.get('/api/v1', (req, res) => res.json({
  service: 'LinkPreview',
  version: '1.0.0',
  description: 'URL Metadata Extraction API',
  endpoints: {
    'GET /api/v1/preview?url=': 'Get link preview',
    'POST /api/v1/preview/batch': 'Batch preview multiple URLs'
  }
}));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => console.log(`LinkPreview running on port ${PORT}`));
