import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { z } from 'zod';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3014;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const generateKey = () => `ff_${crypto.randomBytes(32).toString('hex')}`;

async function auth(req: any, res: any, next: any) {
  const key = req.headers['x-api-key'];
  if (!key) return res.status(401).json({ success: false, error: 'API key required' });
  const apiKey = await prisma.apiKey.findUnique({ where: { key } });
  if (!apiKey?.isActive) return res.status(401).json({ success: false, error: 'Invalid' });
  req.projectId = apiKey.projectId;
  next();
}

// Field type validators
const fieldValidators: Record<string, (value: any, field: any) => boolean> = {
  text: (v, f) => typeof v === 'string' && (!f.minLength || v.length >= f.minLength) && (!f.maxLength || v.length <= f.maxLength),
  email: (v) => typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  number: (v, f) => typeof v === 'number' && (!f.min || v >= f.min) && (!f.max || v <= f.max),
  url: (v) => { try { new URL(v); return true; } catch { return false; } },
  phone: (v) => typeof v === 'string' && /^[\d\s\-+()]+$/.test(v),
  textarea: (v, f) => typeof v === 'string' && (!f.maxLength || v.length <= f.maxLength),
  select: (v, f) => f.options?.includes(v),
  checkbox: (v) => typeof v === 'boolean',
  radio: (v, f) => f.options?.includes(v),
  date: (v) => !isNaN(Date.parse(v)),
  file: () => true, // File validation handled separately
};

function validateSubmission(fields: any[], data: Record<string, any>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const field of fields) {
    const value = data[field.name];

    // Check required
    if (field.required && (value === undefined || value === null || value === '')) {
      errors.push(`${field.label || field.name} is required`);
      continue;
    }

    // Skip validation if not required and empty
    if (!field.required && (value === undefined || value === null || value === '')) continue;

    // Type validation
    const validator = fieldValidators[field.type];
    if (validator && !validator(value, field)) {
      errors.push(`${field.label || field.name} is invalid`);
    }

    // Custom regex validation
    if (field.pattern && typeof value === 'string' && !new RegExp(field.pattern).test(value)) {
      errors.push(`${field.label || field.name} format is invalid`);
    }
  }

  return { valid: errors.length === 0, errors };
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

// Create form
app.post('/api/v1/forms', auth, async (req: any, res) => {
  try {
    const { slug, name, description, fields, settings, webhookUrl, emailNotify, successMessage, redirectUrl } = req.body;

    const form = await prisma.form.create({
      data: {
        projectId: req.projectId,
        slug,
        name,
        description,
        fields: JSON.stringify(fields || []),
        settings: JSON.stringify(settings || {}),
        webhookUrl,
        emailNotify,
        successMessage,
        redirectUrl
      }
    });

    res.status(201).json({
      success: true,
      data: { ...form, fields: JSON.parse(form.fields), submitUrl: `/api/v1/submit/${form.slug}` }
    });
  } catch (e: any) {
    if (e.code === 'P2002') return res.status(409).json({ success: false, error: 'Slug already exists' });
    res.status(500).json({ success: false, error: 'Failed' });
  }
});

// List forms
app.get('/api/v1/forms', auth, async (req: any, res) => {
  try {
    const forms = await prisma.form.findMany({
      where: { projectId: req.projectId },
      orderBy: { createdAt: 'desc' }
    });
    res.json({
      success: true,
      data: forms.map(f => ({ ...f, fields: JSON.parse(f.fields) }))
    });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed' });
  }
});

// Get form
app.get('/api/v1/forms/:slug', auth, async (req: any, res) => {
  try {
    const form = await prisma.form.findUnique({
      where: { projectId_slug: { projectId: req.projectId, slug: req.params.slug } }
    });
    if (!form) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: { ...form, fields: JSON.parse(form.fields) } });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed' });
  }
});

// Update form
app.patch('/api/v1/forms/:slug', auth, async (req: any, res) => {
  try {
    const form = await prisma.form.update({
      where: { projectId_slug: { projectId: req.projectId, slug: req.params.slug } },
      data: {
        ...req.body,
        fields: req.body.fields ? JSON.stringify(req.body.fields) : undefined,
        settings: req.body.settings ? JSON.stringify(req.body.settings) : undefined
      }
    });
    res.json({ success: true, data: { ...form, fields: JSON.parse(form.fields) } });
  } catch (e) {
    res.status(404).json({ success: false, error: 'Not found' });
  }
});

// Delete form
app.delete('/api/v1/forms/:slug', auth, async (req: any, res) => {
  try {
    await prisma.form.delete({
      where: { projectId_slug: { projectId: req.projectId, slug: req.params.slug } }
    });
    res.json({ success: true, message: 'Deleted' });
  } catch (e) {
    res.status(404).json({ success: false, error: 'Not found' });
  }
});

// Submit form (PUBLIC endpoint)
app.post('/api/v1/submit/:slug', async (req, res) => {
  try {
    const form = await prisma.form.findFirst({ where: { slug: req.params.slug, isActive: true } });
    if (!form) return res.status(404).json({ success: false, error: 'Form not found' });

    const fields = JSON.parse(form.fields);
    const data = req.body;

    // Validate
    const validation = validateSubmission(fields, data);
    if (!validation.valid) {
      return res.status(400).json({ success: false, error: 'Validation failed', errors: validation.errors });
    }

    // Save submission
    const submission = await prisma.submission.create({
      data: {
        formId: form.id,
        data: JSON.stringify(data),
        metadata: JSON.stringify({
          ip: req.ip,
          userAgent: req.headers['user-agent'],
          referer: req.headers.referer,
          submittedAt: new Date().toISOString()
        })
      }
    });

    // Update submission count
    await prisma.form.update({
      where: { id: form.id },
      data: { submissionCount: { increment: 1 } }
    });

    // Send webhook if configured
    if (form.webhookUrl) {
      fetch(form.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'submission', formSlug: form.slug, data, submissionId: submission.id })
      }).catch(() => {});
    }

    // Return response
    if (form.redirectUrl) {
      return res.redirect(form.redirectUrl);
    }

    res.status(201).json({
      success: true,
      message: form.successMessage || 'Form submitted successfully',
      submissionId: submission.id
    });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Submission failed' });
  }
});

// Get submissions
app.get('/api/v1/forms/:slug/submissions', auth, async (req: any, res) => {
  try {
    const form = await prisma.form.findUnique({
      where: { projectId_slug: { projectId: req.projectId, slug: req.params.slug } }
    });
    if (!form) return res.status(404).json({ success: false, error: 'Not found' });

    const { status, limit = 50, offset = 0 } = req.query;
    const where: any = { formId: form.id };
    if (status) where.status = status;

    const [submissions, total] = await Promise.all([
      prisma.submission.findMany({
        where, take: Number(limit), skip: Number(offset),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.submission.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        submissions: submissions.map(s => ({
          ...s, data: JSON.parse(s.data), metadata: JSON.parse(s.metadata)
        })),
        total
      }
    });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed' });
  }
});

// Update submission status
app.patch('/api/v1/submissions/:id', auth, async (req: any, res) => {
  try {
    const { status } = req.body;
    const submission = await prisma.submission.update({
      where: { id: req.params.id },
      data: { status }
    });
    res.json({ success: true, data: submission });
  } catch (e) {
    res.status(404).json({ success: false, error: 'Not found' });
  }
});

// Export submissions as CSV
app.get('/api/v1/forms/:slug/export', auth, async (req: any, res) => {
  try {
    const form = await prisma.form.findUnique({
      where: { projectId_slug: { projectId: req.projectId, slug: req.params.slug } }
    });
    if (!form) return res.status(404).json({ success: false, error: 'Not found' });

    const submissions = await prisma.submission.findMany({
      where: { formId: form.id },
      orderBy: { createdAt: 'desc' }
    });

    const fields = JSON.parse(form.fields);
    const headers = ['id', 'createdAt', 'status', ...fields.map((f: any) => f.name)];

    const rows = submissions.map(s => {
      const data = JSON.parse(s.data);
      return [s.id, s.createdAt.toISOString(), s.status, ...fields.map((f: any) => data[f.name] || '')];
    });

    const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${form.slug}-submissions.csv"`);
    res.send(csv);
  } catch (e) {
    res.status(500).json({ success: false, error: 'Export failed' });
  }
});

app.get('/api/v1', (req, res) => res.json({
  service: 'FormForge', version: '1.0.0',
  description: 'Dynamic Form Builder & Submissions API',
  endpoints: {
    forms: ['POST /forms', 'GET /forms', 'GET /forms/:slug', 'PATCH /forms/:slug', 'DELETE /forms/:slug'],
    submissions: ['POST /submit/:slug (public)', 'GET /forms/:slug/submissions', 'PATCH /submissions/:id', 'GET /forms/:slug/export']
  },
  fieldTypes: ['text', 'email', 'number', 'url', 'phone', 'textarea', 'select', 'checkbox', 'radio', 'date']
}));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => console.log(`FormForge running on port ${PORT}`));
