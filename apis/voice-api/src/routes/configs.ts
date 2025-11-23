import { Router } from 'express';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import * as configService from '../services/configService';

const router = Router();

// Create config
router.post('/', authenticate('write'), async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const input = configService.createConfigSchema.parse(req.body);

    const config = await configService.createConfig(authReq.apiKey!.projectId, input);

    res.status(201).json({
      success: true,
      data: config,
    });
  } catch (error) {
    next(error);
  }
});

// List configs
router.get('/', authenticate('read'), async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const configs = await configService.listConfigs(authReq.apiKey!.projectId);

    res.json({
      success: true,
      data: configs,
    });
  } catch (error) {
    next(error);
  }
});

// Get config by ID
router.get('/:id', authenticate('read'), async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const config = await configService.getConfig(authReq.apiKey!.projectId, req.params.id);

    if (!config) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Config not found' },
      });
    }

    res.json({
      success: true,
      data: config,
    });
  } catch (error) {
    next(error);
  }
});

// Update config
router.patch('/:id', authenticate('write'), async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const input = configService.updateConfigSchema.parse(req.body);

    const config = await configService.updateConfig(
      authReq.apiKey!.projectId,
      req.params.id,
      input
    );

    if (!config) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Config not found' },
      });
    }

    res.json({
      success: true,
      data: config,
    });
  } catch (error) {
    next(error);
  }
});

// Delete config
router.delete('/:id', authenticate('write'), async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const deleted = await configService.deleteConfig(authReq.apiKey!.projectId, req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Config not found' },
      });
    }

    res.json({
      success: true,
      message: 'Config deleted',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
