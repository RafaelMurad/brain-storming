import { Router, Response } from 'express';
import { z } from 'zod';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';
import { getNote, getAllNotes, saveNote, deleteNote } from '../services/notes.service';

const router = Router();

// Apply auth middleware
router.use(authMiddleware);

// Note schema
const noteSchema = z.object({
  content: z.string().max(50000), // Max 50KB per note
});

// GET /api/v1/notes - Get all notes
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const notes = await getAllNotes(req.userId!);
    
    res.json({
      success: true,
      data: { notes },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to get notes' },
    });
  }
});

// GET /api/v1/notes/:lessonId - Get note for a lesson
router.get('/:lessonId', async (req: AuthRequest, res: Response) => {
  try {
    const { lessonId } = req.params;
    const note = await getNote(req.userId!, lessonId);
    
    res.json({
      success: true,
      data: { note },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to get note' },
    });
  }
});

// PUT /api/v1/notes/:lessonId - Save or update note
router.put('/:lessonId', async (req: AuthRequest, res: Response) => {
  try {
    const { lessonId } = req.params;
    const parsed = noteSchema.safeParse(req.body);
    
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: parsed.error.errors[0].message },
      });
    }
    
    const note = await saveNote(req.userId!, lessonId, parsed.data.content);
    
    res.json({
      success: true,
      data: { note },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to save note' },
    });
  }
});

// DELETE /api/v1/notes/:lessonId - Delete note
router.delete('/:lessonId', async (req: AuthRequest, res: Response) => {
  try {
    const { lessonId } = req.params;
    await deleteNote(req.userId!, lessonId);
    
    res.json({
      success: true,
      data: { message: 'Note deleted' },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to delete note' },
    });
  }
});

export default router;
