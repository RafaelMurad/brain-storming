import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { createMember, getMembers, getMember, updateMember, getMembersAtRisk, getWellnessLeaderboard } from '../services/member.service';
import { logger } from '../config/logger';

const router = Router();

const createMemberSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().optional(),
  slackUserId: z.string().optional(),
  role: z.enum(['member', 'manager', 'admin']).optional(),
  department: z.string().max(100).optional(),
});

// POST /api/v1/members - Create member
router.post('/', async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.body;
    if (!workspaceId) {
      res.status(400).json({
        success: false,
        error: { code: 'MISSING_WORKSPACE', message: 'workspaceId required' },
      });
      return;
    }

    const validated = createMemberSchema.parse(req.body);
    const member = await createMember(workspaceId, validated);

    res.status(201).json({
      success: true,
      data: member,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', details: error.errors },
      });
      return;
    }
    logger.error('Create member error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to create member' },
    });
  }
});

// GET /api/v1/members/:workspaceId - List members
router.get('/:workspaceId', async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.params;
    const members = await getMembers(workspaceId);

    res.json({
      success: true,
      data: { members },
    });
  } catch (error) {
    logger.error('List members error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to list members' },
    });
  }
});

// GET /api/v1/members/:workspaceId/at-risk - Get at-risk members
router.get('/:workspaceId/at-risk', async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.params;
    const threshold = parseInt(req.query.threshold as string) || 40;

    const members = await getMembersAtRisk(workspaceId, threshold);

    res.json({
      success: true,
      data: { members },
    });
  } catch (error) {
    logger.error('Get at-risk members error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get at-risk members' },
    });
  }
});

// GET /api/v1/members/:workspaceId/wellness - Get wellness distribution
router.get('/:workspaceId/wellness', async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.params;
    const leaderboard = await getWellnessLeaderboard(workspaceId);

    res.json({
      success: true,
      data: leaderboard,
    });
  } catch (error) {
    logger.error('Get wellness error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get wellness data' },
    });
  }
});

// GET /api/v1/members/:workspaceId/:memberId - Get single member
router.get('/:workspaceId/:memberId', async (req: Request, res: Response) => {
  try {
    const { workspaceId, memberId } = req.params;
    const member = await getMember(memberId, workspaceId);

    res.json({
      success: true,
      data: member,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Member not found') {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Member not found' },
      });
      return;
    }
    logger.error('Get member error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get member' },
    });
  }
});

export default router;
