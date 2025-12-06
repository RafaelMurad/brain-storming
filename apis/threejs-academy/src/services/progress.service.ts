import { prisma } from '../lib/database';
import { logger } from '../config/logger';

export interface ProgressUpdate {
  lessonId: string;
  moduleId: string;
  status?: 'not-started' | 'in-progress' | 'completed';
  timeSpentSecs?: number;
  attempts?: number;
  bestScore?: number;
}

export interface UserProgress {
  lessonId: string;
  moduleId: string;
  status: string;
  attempts: number;
  timeSpentSecs: number;
  bestScore: number | null;
  startedAt: Date | null;
  completedAt: Date | null;
}

// Get all progress for a user
export const getUserProgress = async (userId: string): Promise<UserProgress[]> => {
  const progress = await prisma.progress.findMany({
    where: { userId },
    orderBy: { lessonId: 'asc' },
  });
  
  return progress.map(p => ({
    lessonId: p.lessonId,
    moduleId: p.moduleId,
    status: p.status,
    attempts: p.attempts,
    timeSpentSecs: p.timeSpentSecs,
    bestScore: p.bestScore,
    startedAt: p.startedAt,
    completedAt: p.completedAt,
  }));
};

// Get progress for a specific lesson
export const getLessonProgress = async (userId: string, lessonId: string): Promise<UserProgress | null> => {
  const progress = await prisma.progress.findUnique({
    where: { userId_lessonId: { userId, lessonId } },
  });
  
  if (!progress) return null;
  
  return {
    lessonId: progress.lessonId,
    moduleId: progress.moduleId,
    status: progress.status,
    attempts: progress.attempts,
    timeSpentSecs: progress.timeSpentSecs,
    bestScore: progress.bestScore,
    startedAt: progress.startedAt,
    completedAt: progress.completedAt,
  };
};

// Update or create progress
export const updateProgress = async (userId: string, update: ProgressUpdate): Promise<UserProgress> => {
  const existing = await prisma.progress.findUnique({
    where: { userId_lessonId: { userId, lessonId: update.lessonId } },
  });
  
  const now = new Date();
  
  const data: any = {
    moduleId: update.moduleId,
  };
  
  if (update.status) {
    data.status = update.status;
    if (update.status === 'in-progress' && !existing?.startedAt) {
      data.startedAt = now;
    }
    if (update.status === 'completed' && !existing?.completedAt) {
      data.completedAt = now;
    }
  }
  
  if (update.timeSpentSecs !== undefined) {
    data.timeSpentSecs = (existing?.timeSpentSecs || 0) + update.timeSpentSecs;
  }
  
  if (update.attempts !== undefined) {
    data.attempts = (existing?.attempts || 0) + update.attempts;
  }
  
  if (update.bestScore !== undefined) {
    if (!existing?.bestScore || update.bestScore > existing.bestScore) {
      data.bestScore = update.bestScore;
    }
  }
  
  const progress = await prisma.progress.upsert({
    where: { userId_lessonId: { userId, lessonId: update.lessonId } },
    create: {
      userId,
      lessonId: update.lessonId,
      ...data,
    },
    update: data,
  });
  
  logger.debug('Progress updated', { userId, lessonId: update.lessonId, status: progress.status });
  
  return {
    lessonId: progress.lessonId,
    moduleId: progress.moduleId,
    status: progress.status,
    attempts: progress.attempts,
    timeSpentSecs: progress.timeSpentSecs,
    bestScore: progress.bestScore,
    startedAt: progress.startedAt,
    completedAt: progress.completedAt,
  };
};

// Get module completion stats
export const getModuleStats = async (userId: string): Promise<Record<string, { total: number; completed: number; percentage: number }>> => {
  const progress = await prisma.progress.findMany({
    where: { userId },
  });
  
  const stats: Record<string, { total: number; completed: number }> = {};
  
  for (const p of progress) {
    if (!stats[p.moduleId]) {
      stats[p.moduleId] = { total: 0, completed: 0 };
    }
    stats[p.moduleId].total++;
    if (p.status === 'completed') {
      stats[p.moduleId].completed++;
    }
  }
  
  const result: Record<string, { total: number; completed: number; percentage: number }> = {};
  for (const [moduleId, s] of Object.entries(stats)) {
    result[moduleId] = {
      ...s,
      percentage: s.total > 0 ? Math.round((s.completed / s.total) * 100) : 0,
    };
  }
  
  return result;
};

// Get overall stats
export const getOverallStats = async (userId: string): Promise<{
  totalLessons: number;
  completedLessons: number;
  totalTimeSpent: number;
  averageScore: number;
}> => {
  const progress = await prisma.progress.findMany({
    where: { userId },
  });
  
  const totalLessons = progress.length;
  const completedLessons = progress.filter(p => p.status === 'completed').length;
  const totalTimeSpent = progress.reduce((sum, p) => sum + p.timeSpentSecs, 0);
  const scores = progress.filter(p => p.bestScore !== null).map(p => p.bestScore!);
  const averageScore = scores.length > 0
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0;
  
  return {
    totalLessons,
    completedLessons,
    totalTimeSpent,
    averageScore,
  };
};
