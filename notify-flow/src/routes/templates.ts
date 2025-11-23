import { Router } from 'express';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import * as templateService from '../services/templateService';

const router = Router();

// Create template
router.post('/', authenticate('write'), async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const input = templateService.createTemplateSchema.parse(req.body);

    const template = await templateService.createTemplate(
      authReq.apiKey!.projectId,
      input
    );

    res.status(201).json({
      success: true,
      data: template,
    });
  } catch (error) {
    next(error);
  }
});

// List templates
router.get('/', authenticate('read'), async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const templates = await templateService.listTemplates(authReq.apiKey!.projectId);

    res.json({
      success: true,
      data: templates,
    });
  } catch (error) {
    next(error);
  }
});

// Get template by ID
router.get('/:id', authenticate('read'), async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const template = await templateService.getTemplate(
      authReq.apiKey!.projectId,
      req.params.id
    );

    if (!template) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Template not found' },
      });
    }

    res.json({
      success: true,
      data: template,
    });
  } catch (error) {
    next(error);
  }
});

// Update template
router.patch('/:id', authenticate('write'), async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const input = templateService.updateTemplateSchema.parse(req.body);

    const template = await templateService.updateTemplate(
      authReq.apiKey!.projectId,
      req.params.id,
      input
    );

    if (!template) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Template not found' },
      });
    }

    res.json({
      success: true,
      data: template,
    });
  } catch (error) {
    next(error);
  }
});

// Delete template
router.delete('/:id', authenticate('write'), async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const deleted = await templateService.deleteTemplate(
      authReq.apiKey!.projectId,
      req.params.id
    );

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Template not found' },
      });
    }

    res.json({
      success: true,
      message: 'Template deleted',
    });
  } catch (error) {
    next(error);
  }
});

// Preview template
router.post('/:name/preview', authenticate('read'), async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = req.body.data || {};

    const preview = await templateService.previewTemplate(
      authReq.apiKey!.projectId,
      req.params.name,
      data
    );

    if (!preview) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Template not found' },
      });
    }

    res.json({
      success: true,
      data: preview,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
