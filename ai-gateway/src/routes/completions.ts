import { Router } from 'express';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import * as aiService from '../services/aiService';
import * as usageService from '../services/usageService';

const router = Router();

// Chat completion
router.post('/chat', authenticate('write'), async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;

    // Check budget
    const budgetCheck = await usageService.checkBudget(
      authReq.apiKey!.id,
      authReq.apiKey!.dailyBudget,
      authReq.apiKey!.monthlyBudget
    );

    if (!budgetCheck.allowed) {
      throw new AppError(429, 'BUDGET_EXCEEDED', budgetCheck.reason || 'Budget exceeded');
    }

    const input = aiService.chatCompletionSchema.parse(req.body);

    const result = await aiService.chatCompletion(
      authReq.apiKey!.projectId,
      authReq.apiKey!.id,
      authReq.project?.openaiKey,
      input
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// Create embedding
router.post('/embeddings', authenticate('write'), async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;

    // Check budget
    const budgetCheck = await usageService.checkBudget(
      authReq.apiKey!.id,
      authReq.apiKey!.dailyBudget,
      authReq.apiKey!.monthlyBudget
    );

    if (!budgetCheck.allowed) {
      throw new AppError(429, 'BUDGET_EXCEEDED', budgetCheck.reason || 'Budget exceeded');
    }

    const input = aiService.embeddingSchema.parse(req.body);

    const result = await aiService.createEmbedding(
      authReq.apiKey!.projectId,
      authReq.apiKey!.id,
      authReq.project?.openaiKey,
      input
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// List available models
router.get('/models', authenticate('read'), async (req, res, next) => {
  try {
    const { MODEL_PRICING } = await import('../config');

    const models = Object.entries(MODEL_PRICING).map(([model, pricing]) => ({
      model,
      provider: model.startsWith('gpt') ? 'openai' : 'anthropic',
      inputPricePer1k: pricing.input,
      outputPricePer1k: pricing.output,
      contextWindow: pricing.contextWindow,
    }));

    res.json({
      success: true,
      data: models,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
