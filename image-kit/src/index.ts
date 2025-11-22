import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import multer from 'multer';
import sharp from 'sharp';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3013;
const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(UPLOAD_DIR));

const generateKey = () => `ik_${crypto.randomBytes(32).toString('hex')}`;

async function auth(req: any, res: any, next: any) {
  const key = req.headers['x-api-key'] || req.query.apiKey;
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

// Upload image
app.post('/api/v1/upload', auth, upload.single('image'), async (req: any, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'No image provided' });

    const id = uuidv4();
    const ext = path.extname(req.file.originalname) || '.jpg';
    const fileName = `${id}${ext}`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    // Get image metadata
    const metadata = await sharp(req.file.buffer).metadata();

    // Save original
    await sharp(req.file.buffer).toFile(filePath);

    const image = await prisma.image.create({
      data: {
        projectId: req.projectId,
        fileName,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        width: metadata.width,
        height: metadata.height,
        path: filePath,
        publicUrl: `${BASE_URL}/uploads/${fileName}`,
        metadata: JSON.stringify({ format: metadata.format, space: metadata.space })
      }
    });

    res.status(201).json({
      success: true,
      data: {
        id: image.id,
        url: image.publicUrl,
        width: image.width,
        height: image.height,
        size: image.size
      }
    });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Upload failed' });
  }
});

// Transform image on-the-fly
app.get('/api/v1/transform/:imageId', auth, async (req: any, res) => {
  try {
    const image = await prisma.image.findFirst({
      where: { projectId: req.projectId, id: req.params.imageId }
    });
    if (!image) return res.status(404).json({ success: false, error: 'Not found' });

    const { w, h, fit, format, quality, blur, grayscale, rotate, flip, flop, watermark } = req.query;

    let transformer = sharp(image.path);

    // Resize
    if (w || h) {
      transformer = transformer.resize({
        width: w ? Number(w) : undefined,
        height: h ? Number(h) : undefined,
        fit: (fit as any) || 'cover',
        withoutEnlargement: true
      });
    }

    // Rotate
    if (rotate) transformer = transformer.rotate(Number(rotate));

    // Flip/Flop
    if (flip === 'true') transformer = transformer.flip();
    if (flop === 'true') transformer = transformer.flop();

    // Effects
    if (blur) transformer = transformer.blur(Number(blur));
    if (grayscale === 'true') transformer = transformer.grayscale();

    // Format and quality
    const outputFormat = format || 'jpeg';
    const outputQuality = quality ? Number(quality) : 80;

    switch (outputFormat) {
      case 'png':
        transformer = transformer.png({ quality: outputQuality });
        res.type('image/png');
        break;
      case 'webp':
        transformer = transformer.webp({ quality: outputQuality });
        res.type('image/webp');
        break;
      case 'avif':
        transformer = transformer.avif({ quality: outputQuality });
        res.type('image/avif');
        break;
      default:
        transformer = transformer.jpeg({ quality: outputQuality });
        res.type('image/jpeg');
    }

    const buffer = await transformer.toBuffer();
    res.send(buffer);
  } catch (e) {
    res.status(500).json({ success: false, error: 'Transform failed' });
  }
});

// Quick transform endpoint (public URL pattern)
app.get('/img/:transforms/:imageId', async (req, res) => {
  try {
    const image = await prisma.image.findUnique({ where: { id: req.params.imageId } });
    if (!image) return res.status(404).send('Not found');

    // Parse transforms: w_200,h_200,f_webp,q_80
    const transforms: any = {};
    req.params.transforms.split(',').forEach(t => {
      const [key, value] = t.split('_');
      transforms[key] = value;
    });

    let transformer = sharp(image.path);

    if (transforms.w || transforms.h) {
      transformer = transformer.resize({
        width: transforms.w ? Number(transforms.w) : undefined,
        height: transforms.h ? Number(transforms.h) : undefined,
        fit: transforms.fit || 'cover'
      });
    }

    if (transforms.blur) transformer = transformer.blur(Number(transforms.blur));
    if (transforms.gray) transformer = transformer.grayscale();

    const format = transforms.f || 'jpeg';
    const quality = transforms.q ? Number(transforms.q) : 80;

    switch (format) {
      case 'png': transformer = transformer.png(); res.type('image/png'); break;
      case 'webp': transformer = transformer.webp({ quality }); res.type('image/webp'); break;
      default: transformer = transformer.jpeg({ quality }); res.type('image/jpeg');
    }

    res.send(await transformer.toBuffer());
  } catch (e) {
    res.status(500).send('Error');
  }
});

// List images
app.get('/api/v1/images', auth, async (req: any, res) => {
  try {
    const images = await prisma.image.findMany({
      where: { projectId: req.projectId },
      orderBy: { createdAt: 'desc' },
      take: Number(req.query.limit) || 50
    });
    res.json({ success: true, data: images });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed' });
  }
});

// Delete image
app.delete('/api/v1/images/:id', auth, async (req: any, res) => {
  try {
    const image = await prisma.image.findFirst({
      where: { projectId: req.projectId, id: req.params.id }
    });
    if (!image) return res.status(404).json({ success: false, error: 'Not found' });

    fs.unlinkSync(image.path);
    await prisma.image.delete({ where: { id: image.id } });
    res.json({ success: true, message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed' });
  }
});

// Create preset
app.post('/api/v1/presets', auth, async (req: any, res) => {
  try {
    const { name, description, transforms } = req.body;
    const preset = await prisma.preset.create({
      data: { projectId: req.projectId, name, description, transforms: JSON.stringify(transforms) }
    });
    res.status(201).json({ success: true, data: preset });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed' });
  }
});

app.get('/api/v1', (req, res) => res.json({
  service: 'ImageKit', version: '1.0.0',
  description: 'Image Processing & Optimization API',
  endpoints: {
    'POST /api/v1/upload': 'Upload image',
    'GET /api/v1/transform/:id': 'Transform image with query params',
    'GET /img/:transforms/:id': 'Public transform URL (w_200,h_200,f_webp)',
    'GET /api/v1/images': 'List images',
    'DELETE /api/v1/images/:id': 'Delete image'
  },
  transforms: ['w (width)', 'h (height)', 'fit', 'format', 'quality', 'blur', 'grayscale', 'rotate', 'flip', 'flop']
}));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => console.log(`ImageKit running on port ${PORT}`));
