import { prisma } from '../lib/database';
import { logger } from '../config/logger';
import { config, featureFlags } from '../config';
import { analyzeSentiment } from './sentiment.service';

// Check-in data interface
export interface CheckinData {
  mood: number; // 1-5
  energy: number; // 1-5
  workload: number; // 1-5 (1=light, 5=overwhelmed)
  stress: number; // 1-5
  note?: string;
  isAnonymous?: boolean;
}

// Calculate wellness score from check-in data
const calculateWellnessScore = (data: CheckinData): number => {
  // Weights for each factor (total = 1.0)
  const weights = {
    mood: 0.3,
    energy: 0.25,
    workload: 0.25, // Inverted - high workload = bad
    stress: 0.2, // Inverted - high stress = bad
  };

  // Normalize to 0-100 scale
  const moodScore = ((data.mood - 1) / 4) * 100;
  const energyScore = ((data.energy - 1) / 4) * 100;
  const workloadScore = ((5 - data.workload) / 4) * 100; // Inverted
  const stressScore = ((5 - data.stress) / 4) * 100; // Inverted

  const score =
    moodScore * weights.mood +
    energyScore * weights.energy +
    workloadScore * weights.workload +
    stressScore * weights.stress;

  return Math.round(Math.max(0, Math.min(100, score)));
};

// Create a check-in
export const createCheckin = async (
  workspaceId: string,
  memberId: string,
  data: CheckinData
): Promise<{
  checkin: any;
  wellnessScore: number;
  alert?: { severity: string; reason: string };
}> => {
  // Calculate wellness score
  const wellnessScore = calculateWellnessScore(data);

  // Analyze sentiment if note provided
  let sentiment = null;
  let sentimentScore = null;

  if (data.note && featureFlags.sentimentAnalysis) {
    const analysis = await analyzeSentiment(data.note);
    sentiment = analysis.sentiment;
    sentimentScore = analysis.score;
  }

  // Create check-in record
  const checkin = await prisma.checkin.create({
    data: {
      workspaceId,
      memberId,
      mood: data.mood,
      energy: data.energy,
      workload: data.workload,
      stress: data.stress,
      note: data.note,
      sentiment,
      sentimentScore,
      wellnessScore,
      isAnonymous: data.isAnonymous || false,
    },
  });

  // Update member's rolling wellness score
  const recentCheckins = await prisma.checkin.findMany({
    where: { memberId },
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: { wellnessScore: true },
  });

  const avgWellness =
    recentCheckins.reduce((sum, c) => sum + c.wellnessScore, 0) / recentCheckins.length;

  await prisma.member.update({
    where: { id: memberId },
    data: {
      wellnessScore: Math.round(avgWellness),
      lastCheckinAt: new Date(),
    },
  });

  // Check for burnout risk
  let alert = undefined;

  if (featureFlags.burnoutPrediction) {
    if (avgWellness <= config.burnoutCriticalThreshold) {
      alert = {
        severity: 'critical',
        reason: `Wellness score critically low at ${Math.round(avgWellness)}. Immediate attention needed.`,
      };

      await prisma.burnoutAlert.create({
        data: {
          workspaceId,
          memberId,
          severity: 'critical',
          reason: alert.reason,
          wellnessScore: Math.round(avgWellness),
        },
      });

      logger.warn(`Critical burnout alert for member ${memberId}`);
    } else if (avgWellness <= config.burnoutWarningThreshold) {
      alert = {
        severity: 'warning',
        reason: `Wellness score low at ${Math.round(avgWellness)}. Consider checking in with this team member.`,
      };

      await prisma.burnoutAlert.create({
        data: {
          workspaceId,
          memberId,
          severity: 'warning',
          reason: alert.reason,
          wellnessScore: Math.round(avgWellness),
        },
      });

      logger.info(`Burnout warning for member ${memberId}`);
    }
  }

  logger.debug(`Check-in created: ${checkin.id}, wellness: ${wellnessScore}`);

  return { checkin, wellnessScore, alert };
};

// Get check-in history for a member
export const getMemberCheckins = async (
  memberId: string,
  options: { limit?: number; days?: number } = {}
) => {
  const { limit = 30, days } = options;

  const where: any = { memberId };

  if (days) {
    where.createdAt = {
      gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
    };
  }

  return prisma.checkin.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
};

// Get workspace check-in stats
export const getWorkspaceCheckinStats = async (workspaceId: string, days = 30) => {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const checkins = await prisma.checkin.findMany({
    where: {
      workspaceId,
      createdAt: { gte: since },
    },
    select: {
      mood: true,
      energy: true,
      workload: true,
      stress: true,
      wellnessScore: true,
      createdAt: true,
    },
  });

  if (checkins.length === 0) {
    return {
      totalCheckins: 0,
      averages: { mood: 0, energy: 0, workload: 0, stress: 0, wellness: 0 },
      trend: 'stable',
      period: `${days} days`,
    };
  }

  const averages = {
    mood: checkins.reduce((sum, c) => sum + c.mood, 0) / checkins.length,
    energy: checkins.reduce((sum, c) => sum + c.energy, 0) / checkins.length,
    workload: checkins.reduce((sum, c) => sum + c.workload, 0) / checkins.length,
    stress: checkins.reduce((sum, c) => sum + c.stress, 0) / checkins.length,
    wellness: checkins.reduce((sum, c) => sum + c.wellnessScore, 0) / checkins.length,
  };

  // Calculate trend (compare last week to previous week)
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentCheckins = checkins.filter(c => c.createdAt >= oneWeekAgo);
  const olderCheckins = checkins.filter(c => c.createdAt < oneWeekAgo);

  let trend = 'stable';
  if (recentCheckins.length > 0 && olderCheckins.length > 0) {
    const recentAvg =
      recentCheckins.reduce((sum, c) => sum + c.wellnessScore, 0) / recentCheckins.length;
    const olderAvg =
      olderCheckins.reduce((sum, c) => sum + c.wellnessScore, 0) / olderCheckins.length;

    if (recentAvg > olderAvg + 5) trend = 'improving';
    else if (recentAvg < olderAvg - 5) trend = 'declining';
  }

  return {
    totalCheckins: checkins.length,
    averages: {
      mood: Math.round(averages.mood * 10) / 10,
      energy: Math.round(averages.energy * 10) / 10,
      workload: Math.round(averages.workload * 10) / 10,
      stress: Math.round(averages.stress * 10) / 10,
      wellness: Math.round(averages.wellness),
    },
    trend,
    period: `${days} days`,
  };
};

// Get members who haven't checked in recently
export const getMissingCheckins = async (workspaceId: string, hours = 24) => {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);

  const members = await prisma.member.findMany({
    where: {
      workspaceId,
      isActive: true,
      OR: [{ lastCheckinAt: null }, { lastCheckinAt: { lt: since } }],
    },
    select: {
      id: true,
      name: true,
      email: true,
      lastCheckinAt: true,
    },
  });

  return members;
};
