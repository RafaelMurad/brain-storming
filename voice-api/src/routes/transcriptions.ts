import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import * as transcriptionService from '../services/transcriptionService';
import { config, SUPPORTED_LANGUAGES } from '../config';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const router = Router();

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = config.uploadDir;
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: config.maxFileSizeMb * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = config.allowedAudioTypes.split(',').map(t => t.trim());
    if (allowedTypes.includes(file.mimetype) || file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new AppError(400, 'INVALID_FILE_TYPE', `File type ${file.mimetype} not allowed`) as any);
    }
  },
});

// Transcribe audio file
router.post('/transcribe', authenticate('write'), upload.single('file'), async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;

    if (!req.file) {
      throw new AppError(400, 'NO_FILE', 'Audio file is required');
    }

    // Parse options from body
    const options = transcriptionService.transcribeOptionsSchema.parse({
      language: req.body.language || config.defaultLanguage,
      provider: req.body.provider || config.defaultProvider,
      model: req.body.model || config.defaultModel,
      temperature: req.body.temperature ? parseFloat(req.body.temperature) : undefined,
      prompt: req.body.prompt,
      timestamps: req.body.timestamps,
      diarization: req.body.diarization === 'true',
      punctuation: req.body.punctuation !== 'false',
      profanityFilter: req.body.profanityFilter === 'true',
      responseFormat: req.body.responseFormat,
      vocabulary: req.body.vocabulary ? JSON.parse(req.body.vocabulary) : undefined,
      webhookUrl: req.body.webhookUrl,
      metadata: req.body.metadata ? JSON.parse(req.body.metadata) : {},
      configName: req.body.configName,
    });

    const result = await transcriptionService.createTranscription(
      authReq.apiKey!.projectId,
      authReq.apiKey!.id,
      req.file.path,
      req.file.originalname,
      req.file.size,
      req.file.mimetype,
      options,
      authReq.project?.openaiKey
    );

    res.status(202).json({
      success: true,
      data: result,
      message: 'Transcription job created. Poll the status endpoint or wait for webhook.',
    });
  } catch (error) {
    // Cleanup file on error
    if (req.file?.path) {
      fs.unlink(req.file.path, () => {});
    }
    next(error);
  }
});

// Get transcription by ID
router.get('/:id', authenticate('read'), async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;

    const transcription = await transcriptionService.getTranscription(
      req.params.id,
      authReq.apiKey!.projectId
    );

    if (!transcription) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Transcription not found' },
      });
    }

    res.json({
      success: true,
      data: transcription,
    });
  } catch (error) {
    next(error);
  }
});

// List transcriptions
router.get('/', authenticate('read'), async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;

    const result = await transcriptionService.listTranscriptions(
      authReq.apiKey!.projectId,
      {
        status: req.query.status as string,
        language: req.query.language as string,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 50,
        offset: req.query.offset ? parseInt(req.query.offset as string, 10) : 0,
      }
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// Get supported languages
router.get('/meta/languages', async (req, res) => {
  res.json({
    success: true,
    data: Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => ({ code, name })),
  });
});

export default router;
