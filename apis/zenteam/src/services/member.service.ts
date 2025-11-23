import { prisma } from '../lib/database';
import { logger } from '../config/logger';

// Create a member
export const createMember = async (
  workspaceId: string,
  data: {
    name: string;
    email?: string;
    slackUserId?: string;
    role?: string;
    department?: string;
  }
) => {
  const member = await prisma.member.create({
    data: {
      workspaceId,
      name: data.name,
      email: data.email,
      slackUserId: data.slackUserId,
      role: data.role || 'member',
      department: data.department,
    },
  });

  logger.info(`Member created: ${member.id}`);
  return member;
};

// Get members for a workspace
export const getMembers = async (
  workspaceId: string,
  options: {
    isActive?: boolean;
    role?: string;
    sortBy?: 'name' | 'wellnessScore' | 'lastCheckinAt';
    sortOrder?: 'asc' | 'desc';
  } = {}
) => {
  const { isActive = true, role, sortBy = 'name', sortOrder = 'asc' } = options;

  return prisma.member.findMany({
    where: {
      workspaceId,
      isActive,
      ...(role && { role }),
    },
    orderBy: { [sortBy]: sortOrder },
  });
};

// Get a single member
export const getMember = async (id: string, workspaceId: string) => {
  const member = await prisma.member.findFirst({
    where: { id, workspaceId },
  });

  if (!member) {
    throw new Error('Member not found');
  }

  return member;
};

// Update a member
export const updateMember = async (
  id: string,
  workspaceId: string,
  data: {
    name?: string;
    email?: string;
    role?: string;
    department?: string;
    isActive?: boolean;
  }
) => {
  const result = await prisma.member.updateMany({
    where: { id, workspaceId },
    data,
  });

  if (result.count === 0) {
    throw new Error('Member not found');
  }

  return getMember(id, workspaceId);
};

// Get members at risk of burnout
export const getMembersAtRisk = async (
  workspaceId: string,
  threshold = 40
): Promise<any[]> => {
  const members = await prisma.member.findMany({
    where: {
      workspaceId,
      isActive: true,
      wellnessScore: { lte: threshold },
    },
    orderBy: { wellnessScore: 'asc' },
    include: {
      checkins: {
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          mood: true,
          energy: true,
          workload: true,
          stress: true,
          wellnessScore: true,
          createdAt: true,
        },
      },
    },
  });

  return members.map(m => ({
    id: m.id,
    name: m.name,
    department: m.department,
    wellnessScore: m.wellnessScore,
    lastCheckinAt: m.lastCheckinAt,
    recentTrend: calculateTrend(m.checkins),
    risk: m.wellnessScore <= 25 ? 'critical' : 'warning',
  }));
};

// Get team wellness leaderboard (anonymized)
export const getWellnessLeaderboard = async (workspaceId: string) => {
  const members = await prisma.member.findMany({
    where: { workspaceId, isActive: true },
    select: { wellnessScore: true },
    orderBy: { wellnessScore: 'desc' },
  });

  // Return distribution, not individual scores
  const distribution = {
    excellent: members.filter(m => m.wellnessScore >= 80).length,
    good: members.filter(m => m.wellnessScore >= 60 && m.wellnessScore < 80).length,
    moderate: members.filter(m => m.wellnessScore >= 40 && m.wellnessScore < 60).length,
    needsAttention: members.filter(m => m.wellnessScore < 40).length,
  };

  const avgScore =
    members.length > 0 ? members.reduce((sum, m) => sum + m.wellnessScore, 0) / members.length : 0;

  return {
    totalMembers: members.length,
    averageWellness: Math.round(avgScore),
    distribution,
  };
};

// Helper to calculate trend from recent check-ins
const calculateTrend = (
  checkins: Array<{ wellnessScore: number }>
): 'improving' | 'stable' | 'declining' => {
  if (checkins.length < 2) return 'stable';

  const recent = checkins.slice(0, 2).reduce((sum, c) => sum + c.wellnessScore, 0) / 2;
  const older = checkins.slice(2).reduce((sum, c) => sum + c.wellnessScore, 0) / (checkins.length - 2);

  if (recent > older + 5) return 'improving';
  if (recent < older - 5) return 'declining';
  return 'stable';
};
