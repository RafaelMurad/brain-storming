import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3010;

app.use(helmet());
app.use(cors());
app.use(express.json());

const generateKey = () => `ff_${crypto.randomBytes(32).toString('hex')}`;

// Hash function for consistent bucketing
function hashUserId(userId: string, seed: string): number {
  const hash = crypto.createHash('md5').update(`${userId}:${seed}`).digest();
  return (hash.readUInt32BE(0) % 100) + 1; // 1-100
}

// Evaluate targeting rules
function evaluateRules(rules: any[], context: any): boolean {
  if (!rules.length) return true;
  return rules.every(rule => {
    const value = context[rule.attribute];
    switch (rule.operator) {
      case 'equals': return value === rule.value;
      case 'not_equals': return value !== rule.value;
      case 'contains': return String(value).includes(rule.value);
      case 'in': return rule.value.includes(value);
      case 'gt': return Number(value) > Number(rule.value);
      case 'lt': return Number(value) < Number(rule.value);
      default: return true;
    }
  });
}

// Auth middleware
async function auth(req: any, res: any, next: any) {
  const key = req.headers['x-api-key'] as string;
  if (!key) return res.status(401).json({ success: false, error: 'API key required' });
  const apiKey = await prisma.apiKey.findUnique({ where: { key } });
  if (!apiKey?.isActive) return res.status(401).json({ success: false, error: 'Invalid API key' });
  req.projectId = apiKey.projectId;
  next();
}

// Create project
app.post('/api/v1/projects', async (req, res) => {
  try {
    const project = await prisma.project.create({ data: { name: req.body.name } });
    const apiKey = await prisma.apiKey.create({
      data: { projectId: project.id, name: 'Default', key: generateKey() }
    });
    res.status(201).json({ success: true, data: { project, apiKey: { key: apiKey.key } } });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed to create project' });
  }
});

// Feature Flags CRUD
app.post('/api/v1/flags', auth, async (req: any, res) => {
  try {
    const { key, name, description, type, defaultValue, environments, tags } = req.body;
    const flag = await prisma.featureFlag.create({
      data: {
        projectId: req.projectId, key, name, description,
        type: type || 'boolean',
        defaultValue: String(defaultValue ?? 'false'),
        environments: JSON.stringify(environments || []),
        tags: JSON.stringify(tags || [])
      }
    });
    res.status(201).json({ success: true, data: flag });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed to create flag' });
  }
});

app.get('/api/v1/flags', auth, async (req: any, res) => {
  const flags = await prisma.featureFlag.findMany({ where: { projectId: req.projectId } });
  res.json({ success: true, data: flags.map(f => ({ ...f, tags: JSON.parse(f.tags) })) });
});

app.patch('/api/v1/flags/:key', auth, async (req: any, res) => {
  try {
    const flag = await prisma.featureFlag.update({
      where: { projectId_key: { projectId: req.projectId, key: req.params.key } },
      data: {
        ...req.body,
        targetingRules: req.body.targetingRules ? JSON.stringify(req.body.targetingRules) : undefined,
        tags: req.body.tags ? JSON.stringify(req.body.tags) : undefined
      }
    });
    res.json({ success: true, data: flag });
  } catch (e) {
    res.status(404).json({ success: false, error: 'Flag not found' });
  }
});

app.delete('/api/v1/flags/:key', auth, async (req: any, res) => {
  try {
    await prisma.featureFlag.delete({
      where: { projectId_key: { projectId: req.projectId, key: req.params.key } }
    });
    res.json({ success: true, message: 'Flag deleted' });
  } catch (e) {
    res.status(404).json({ success: false, error: 'Flag not found' });
  }
});

// Evaluate flag for user
app.post('/api/v1/evaluate', auth, async (req: any, res) => {
  try {
    const { flagKey, userId, context = {} } = req.body;
    const flag = await prisma.featureFlag.findUnique({
      where: { projectId_key: { projectId: req.projectId, key: flagKey } }
    });

    if (!flag) return res.status(404).json({ success: false, error: 'Flag not found' });

    let value = flag.defaultValue;
    let reason = 'default';

    if (!flag.enabled) {
      reason = 'disabled';
    } else {
      const rules = JSON.parse(flag.targetingRules);
      if (evaluateRules(rules, { ...context, userId })) {
        const bucket = hashUserId(userId, flag.key);
        if (bucket <= flag.rolloutPercentage) {
          value = flag.type === 'boolean' ? 'true' : flag.defaultValue;
          reason = flag.rolloutPercentage < 100 ? 'percentage' : 'matched';
        } else {
          reason = 'percentage_excluded';
        }
      } else {
        reason = 'rule_not_matched';
      }
    }

    // Log evaluation
    await prisma.flagEvaluation.create({
      data: { flagId: flag.id, userId, value, reason }
    });

    const typedValue = flag.type === 'boolean' ? value === 'true' :
                       flag.type === 'number' ? Number(value) :
                       flag.type === 'json' ? JSON.parse(value) : value;

    res.json({ success: true, data: { key: flagKey, value: typedValue, reason } });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Evaluation failed' });
  }
});

// Bulk evaluate all flags
app.post('/api/v1/evaluate/all', auth, async (req: any, res) => {
  try {
    const { userId, context = {} } = req.body;
    const flags = await prisma.featureFlag.findMany({ where: { projectId: req.projectId } });

    const results: Record<string, any> = {};
    for (const flag of flags) {
      let value = flag.defaultValue;
      if (flag.enabled) {
        const rules = JSON.parse(flag.targetingRules);
        if (evaluateRules(rules, { ...context, userId })) {
          const bucket = hashUserId(userId, flag.key);
          if (bucket <= flag.rolloutPercentage) {
            value = flag.type === 'boolean' ? 'true' : flag.defaultValue;
          }
        }
      }
      results[flag.key] = flag.type === 'boolean' ? value === 'true' :
                          flag.type === 'number' ? Number(value) : value;
    }

    res.json({ success: true, data: results });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Evaluation failed' });
  }
});

// Experiments
app.post('/api/v1/experiments', auth, async (req: any, res) => {
  try {
    const { key, name, description, variants, trafficAllocation } = req.body;
    const experiment = await prisma.experiment.create({
      data: {
        projectId: req.projectId, key, name, description,
        variants: JSON.stringify(variants || [{ key: 'control', weight: 50 }, { key: 'treatment', weight: 50 }]),
        trafficAllocation: trafficAllocation || 100
      }
    });
    res.status(201).json({ success: true, data: experiment });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed to create experiment' });
  }
});

app.patch('/api/v1/experiments/:key/start', auth, async (req: any, res) => {
  try {
    const experiment = await prisma.experiment.update({
      where: { projectId_key: { projectId: req.projectId, key: req.params.key } },
      data: { status: 'running', startedAt: new Date() }
    });
    res.json({ success: true, data: experiment });
  } catch (e) {
    res.status(404).json({ success: false, error: 'Experiment not found' });
  }
});

// Get experiment variant for user
app.post('/api/v1/experiments/:key/assign', auth, async (req: any, res) => {
  try {
    const { userId } = req.body;
    const experiment = await prisma.experiment.findUnique({
      where: { projectId_key: { projectId: req.projectId, key: req.params.key } }
    });

    if (!experiment || experiment.status !== 'running') {
      return res.json({ success: true, data: { variant: null, inExperiment: false } });
    }

    // Check existing assignment
    let assignment = await prisma.experimentAssignment.findUnique({
      where: { experimentId_userId: { experimentId: experiment.id, oderId: userId } }
    });

    if (!assignment) {
      const bucket = hashUserId(userId, experiment.key);
      if (bucket > experiment.trafficAllocation) {
        return res.json({ success: true, data: { variant: null, inExperiment: false } });
      }

      const variants = JSON.parse(experiment.variants);
      let cumulative = 0;
      let selectedVariant = variants[0].key;
      for (const v of variants) {
        cumulative += v.weight;
        if (bucket <= cumulative) {
          selectedVariant = v.key;
          break;
        }
      }

      assignment = await prisma.experimentAssignment.create({
        data: { experimentId: experiment.id, userId, variant: selectedVariant }
      });
    }

    res.json({ success: true, data: { variant: assignment.variant, inExperiment: true } });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Assignment failed' });
  }
});

// Track conversion
app.post('/api/v1/experiments/:key/convert', auth, async (req: any, res) => {
  try {
    const { userId, metric, value = 1 } = req.body;
    const experiment = await prisma.experiment.findUnique({
      where: { projectId_key: { projectId: req.projectId, key: req.params.key } }
    });
    if (!experiment) return res.status(404).json({ success: false, error: 'Not found' });

    const assignment = await prisma.experimentAssignment.findUnique({
      where: { experimentId_userId: { experimentId: experiment.id, oderId: userId } }
    });
    if (!assignment) return res.json({ success: true, data: { tracked: false } });

    await prisma.experimentConversion.create({
      data: { experimentId: experiment.id, userId, variant: assignment.variant, metric, value }
    });

    res.json({ success: true, data: { tracked: true } });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Tracking failed' });
  }
});

// Get experiment results
app.get('/api/v1/experiments/:key/results', auth, async (req: any, res) => {
  try {
    const experiment = await prisma.experiment.findUnique({
      where: { projectId_key: { projectId: req.projectId, key: req.params.key } }
    });
    if (!experiment) return res.status(404).json({ success: false, error: 'Not found' });

    const assignments = await prisma.experimentAssignment.groupBy({
      by: ['variant'], where: { experimentId: experiment.id }, _count: { id: true }
    });

    const conversions = await prisma.experimentConversion.groupBy({
      by: ['variant', 'metric'], where: { experimentId: experiment.id },
      _count: { id: true }, _sum: { value: true }
    });

    res.json({
      success: true,
      data: {
        experiment,
        assignments: assignments.map(a => ({ variant: a.variant, count: a._count.id })),
        conversions: conversions.map(c => ({
          variant: c.variant, metric: c.metric, count: c._count.id, total: c._sum.value
        }))
      }
    });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed to get results' });
  }
});

app.get('/api/v1', (req, res) => res.json({
  service: 'FeatureFlow', version: '1.0.0',
  description: 'Feature Flags & A/B Testing API',
  endpoints: {
    flags: ['POST /flags', 'GET /flags', 'PATCH /flags/:key', 'DELETE /flags/:key'],
    evaluate: ['POST /evaluate', 'POST /evaluate/all'],
    experiments: ['POST /experiments', 'PATCH /experiments/:key/start', 'POST /experiments/:key/assign', 'POST /experiments/:key/convert', 'GET /experiments/:key/results']
  }
}));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => console.log(`FeatureFlow running on port ${PORT}`));
