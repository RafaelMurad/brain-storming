import { Router } from 'express';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import * as vocabularyService from '../services/vocabularyService';

const router = Router();

// Create vocabulary
router.post('/', authenticate('write'), async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const input = vocabularyService.createVocabularySchema.parse(req.body);

    const vocabulary = await vocabularyService.createVocabulary(authReq.apiKey!.projectId, input);

    res.status(201).json({
      success: true,
      data: vocabulary,
    });
  } catch (error) {
    next(error);
  }
});

// List vocabularies
router.get('/', authenticate('read'), async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const category = req.query.category as string | undefined;

    const vocabularies = await vocabularyService.listVocabularies(authReq.apiKey!.projectId, category);

    res.json({
      success: true,
      data: vocabularies,
    });
  } catch (error) {
    next(error);
  }
});

// Get vocabulary by ID
router.get('/:id', authenticate('read'), async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const vocabulary = await vocabularyService.getVocabulary(authReq.apiKey!.projectId, req.params.id);

    if (!vocabulary) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Vocabulary not found' },
      });
    }

    res.json({
      success: true,
      data: vocabulary,
    });
  } catch (error) {
    next(error);
  }
});

// Update vocabulary
router.patch('/:id', authenticate('write'), async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const input = vocabularyService.updateVocabularySchema.parse(req.body);

    const vocabulary = await vocabularyService.updateVocabulary(
      authReq.apiKey!.projectId,
      req.params.id,
      input
    );

    if (!vocabulary) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Vocabulary not found' },
      });
    }

    res.json({
      success: true,
      data: vocabulary,
    });
  } catch (error) {
    next(error);
  }
});

// Delete vocabulary
router.delete('/:id', authenticate('write'), async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const deleted = await vocabularyService.deleteVocabulary(authReq.apiKey!.projectId, req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Vocabulary not found' },
      });
    }

    res.json({
      success: true,
      message: 'Vocabulary deleted',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
