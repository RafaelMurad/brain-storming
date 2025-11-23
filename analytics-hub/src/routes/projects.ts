import { Router } from 'express';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import * as projectService from '../services/projectService';

const router = Router();

// Create project (admin only - typically done via setup)
router.post('/', async (req, res, next) => {
  try {
    const data = projectService.createProjectSchema.parse(req.body);
    const result = await projectService.createProject(data);

    res.status(201).json({
      success: true,
      data: result,
      message: 'Project created. Save your API key - it will only be shown once!',
    });
  } catch (error) {
    next(error);
  }
});

// Get current project
router.get('/current', authenticate('read'), async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const project = await projectService.getProject(authReq.apiKey!.projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Project not found' },
      });
    }

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
});

// Create API key for current project
router.post('/api-keys', authenticate('admin'), async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = projectService.createApiKeySchema.parse(req.body);

    const apiKey = await projectService.createApiKey(authReq.apiKey!.projectId, data);

    res.status(201).json({
      success: true,
      data: apiKey,
      message: 'API key created. Save this key - it will only be shown once!',
    });
  } catch (error) {
    next(error);
  }
});

// List API keys for current project
router.get('/api-keys', authenticate('admin'), async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const apiKeys = await projectService.listApiKeys(authReq.apiKey!.projectId);

    // Mask keys for security
    const masked = apiKeys.map(k => ({
      ...k,
      key: k.key.substring(0, 8) + '...' + k.key.substring(k.key.length - 4),
    }));

    res.json({
      success: true,
      data: masked,
    });
  } catch (error) {
    next(error);
  }
});

// Revoke API key
router.delete('/api-keys/:keyId', authenticate('admin'), async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    await projectService.revokeApiKey(req.params.keyId, authReq.apiKey!.projectId);

    res.json({
      success: true,
      message: 'API key revoked',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
