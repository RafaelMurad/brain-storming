import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import UAParser from 'ua-parser-js';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3012;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

app.use(helmet());
app.use(cors());
app.use(express.json());

const generateKey = () => `sl_${crypto.randomBytes(32).toString('hex')}`;
const generateShortCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < 7; i++) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
};

async function auth(req: any, res: any, next: any) {
  const key = req.headers['x-api-key'];
  if (!key) return res.status(401).json({ success: false, error: 'API key required' });
  const apiKey = await prisma.apiKey.findUnique({ where: { key } });
  if (!apiKey?.isActive) return res.status(401).json({ success: false, error: 'Invalid' });
  req.projectId = apiKey.projectId;
  next();
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

// Create short link
app.post('/api/v1/links', auth, async (req: any, res) => {
  try {
    const { url, customCode, title, tags, password, expiresAt, maxClicks } = req.body;
    if (!url) return res.status(400).json({ success: false, error: 'URL required' });

    // Validate URL
    try { new URL(url); } catch { return res.status(400).json({ success: false, error: 'Invalid URL' }); }

    const shortCode = customCode || generateShortCode();

    // Check if custom code exists
    if (customCode) {
      const existing = await prisma.link.findUnique({ where: { shortCode } });
      if (existing) return res.status(409).json({ success: false, error: 'Code already exists' });
    }

    const link = await prisma.link.create({
      data: {
        projectId: req.projectId,
        shortCode,
        originalUrl: url,
        title,
        tags: JSON.stringify(tags || []),
        password,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        maxClicks
      }
    });

    res.status(201).json({
      success: true,
      data: {
        ...link,
        shortUrl: `${BASE_URL}/${link.shortCode}`,
        tags: JSON.parse(link.tags)
      }
    });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed to create link' });
  }
});

// List links
app.get('/api/v1/links', auth, async (req: any, res) => {
  try {
    const { limit = 50, offset = 0, tag } = req.query;
    const where: any = { projectId: req.projectId };
    if (tag) where.tags = { contains: tag };

    const [links, total] = await Promise.all([
      prisma.link.findMany({
        where, take: Number(limit), skip: Number(offset),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.link.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        links: links.map(l => ({ ...l, shortUrl: `${BASE_URL}/${l.shortCode}`, tags: JSON.parse(l.tags) })),
        total, limit: Number(limit), offset: Number(offset)
      }
    });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed' });
  }
});

// Get link details
app.get('/api/v1/links/:code', auth, async (req: any, res) => {
  try {
    const link = await prisma.link.findFirst({
      where: { projectId: req.projectId, shortCode: req.params.code }
    });
    if (!link) return res.status(404).json({ success: false, error: 'Not found' });

    res.json({
      success: true,
      data: { ...link, shortUrl: `${BASE_URL}/${link.shortCode}`, tags: JSON.parse(link.tags) }
    });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed' });
  }
});

// Update link
app.patch('/api/v1/links/:code', auth, async (req: any, res) => {
  try {
    const link = await prisma.link.updateMany({
      where: { projectId: req.projectId, shortCode: req.params.code },
      data: { ...req.body, tags: req.body.tags ? JSON.stringify(req.body.tags) : undefined }
    });
    if (!link.count) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, message: 'Updated' });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed' });
  }
});

// Delete link
app.delete('/api/v1/links/:code', auth, async (req: any, res) => {
  try {
    await prisma.link.deleteMany({ where: { projectId: req.projectId, shortCode: req.params.code } });
    res.json({ success: true, message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed' });
  }
});

// Get link analytics
app.get('/api/v1/links/:code/analytics', auth, async (req: any, res) => {
  try {
    const link = await prisma.link.findFirst({
      where: { projectId: req.projectId, shortCode: req.params.code }
    });
    if (!link) return res.status(404).json({ success: false, error: 'Not found' });

    const days = Number(req.query.days) || 7;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [totalClicks, clicksByDay, byDevice, byBrowser, byCountry, recentClicks] = await Promise.all([
      prisma.click.count({ where: { linkId: link.id } }),
      prisma.click.groupBy({
        by: ['timestamp'], where: { linkId: link.id, timestamp: { gte: since } },
        _count: { id: true }
      }),
      prisma.click.groupBy({
        by: ['device'], where: { linkId: link.id, timestamp: { gte: since } },
        _count: { id: true }
      }),
      prisma.click.groupBy({
        by: ['browser'], where: { linkId: link.id, timestamp: { gte: since } },
        _count: { id: true }
      }),
      prisma.click.groupBy({
        by: ['country'], where: { linkId: link.id, timestamp: { gte: since } },
        _count: { id: true }
      }),
      prisma.click.findMany({
        where: { linkId: link.id }, take: 10, orderBy: { timestamp: 'desc' },
        select: { timestamp: true, device: true, browser: true, country: true, referer: true }
      })
    ]);

    res.json({
      success: true,
      data: {
        totalClicks,
        byDevice: byDevice.map(d => ({ device: d.device || 'unknown', clicks: d._count.id })),
        byBrowser: byBrowser.map(b => ({ browser: b.browser || 'unknown', clicks: b._count.id })),
        byCountry: byCountry.map(c => ({ country: c.country || 'unknown', clicks: c._count.id })),
        recentClicks
      }
    });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed' });
  }
});

// Redirect endpoint (public)
app.get('/:code', async (req, res) => {
  try {
    const link = await prisma.link.findUnique({ where: { shortCode: req.params.code } });

    if (!link || !link.isActive) return res.status(404).send('Link not found');
    if (link.expiresAt && new Date(link.expiresAt) < new Date()) return res.status(410).send('Link expired');
    if (link.maxClicks && link.clickCount >= link.maxClicks) return res.status(410).send('Link limit reached');

    // Parse user agent
    const ua = new UAParser(req.headers['user-agent']);
    const device = ua.getDevice().type || 'desktop';
    const browser = ua.getBrowser().name || 'unknown';
    const os = ua.getOS().name || 'unknown';

    // Record click and update count
    await Promise.all([
      prisma.click.create({
        data: {
          linkId: link.id,
          ip: req.ip,
          userAgent: req.headers['user-agent'],
          referer: req.headers.referer,
          device, browser, os
        }
      }),
      prisma.link.update({
        where: { id: link.id },
        data: { clickCount: { increment: 1 } }
      })
    ]);

    res.redirect(302, link.originalUrl);
  } catch (e) {
    res.status(500).send('Error');
  }
});

app.get('/api/v1', (req, res) => res.json({
  service: 'ShortLink', version: '1.0.0',
  description: 'URL Shortener with Analytics',
  endpoints: {
    'POST /api/v1/links': 'Create short link',
    'GET /api/v1/links': 'List links',
    'GET /api/v1/links/:code': 'Get link details',
    'GET /api/v1/links/:code/analytics': 'Get click analytics',
    'GET /:code': 'Redirect to original URL'
  }
}));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => console.log(`ShortLink running on port ${PORT}`));
