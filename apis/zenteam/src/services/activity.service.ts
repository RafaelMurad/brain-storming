import { prisma } from '../lib/database';
import { logger } from '../config/logger';

// Activity types
export type ActivityType = 'icebreaker' | 'team_lunch' | 'wellness_break' | 'celebration' | 'kudos';

// Activity suggestions database
const activityTemplates: Record<
  ActivityType,
  Array<{ title: string; description: string; duration: string }>
> = {
  icebreaker: [
    {
      title: 'Two Truths and a Lie',
      description:
        'Each team member shares two true facts and one lie about themselves. Others guess the lie.',
      duration: '15 min',
    },
    {
      title: 'Virtual Coffee Roulette',
      description:
        'Randomly pair team members for a 15-minute casual video chat to get to know each other.',
      duration: '15 min',
    },
    {
      title: "Show Your Workspace",
      description:
        'Team members give a quick tour of their home office or favorite work spot.',
      duration: '10 min',
    },
    {
      title: 'Desert Island Picks',
      description:
        "Share what 3 items you'd bring to a desert island and why.",
      duration: '10 min',
    },
  ],
  team_lunch: [
    {
      title: 'Virtual Lunch & Learn',
      description:
        'Order food delivery for the team and have someone present on an interesting topic.',
      duration: '45 min',
    },
    {
      title: 'Cultural Food Share',
      description:
        'Team members share a dish from their culture and talk about its significance.',
      duration: '30 min',
    },
  ],
  wellness_break: [
    {
      title: 'Guided Meditation',
      description:
        'A 5-minute group meditation session to reset and refocus.',
      duration: '10 min',
    },
    {
      title: 'Stretch Break',
      description:
        'Quick desk stretches led by a team member or following a video guide.',
      duration: '10 min',
    },
    {
      title: 'Walk & Talk',
      description:
        'Audio-only meeting while everyone takes a walk outside.',
      duration: '20 min',
    },
    {
      title: 'No Meeting Morning',
      description:
        'Block off a morning with no meetings for deep focus work.',
      duration: '4 hours',
    },
  ],
  celebration: [
    {
      title: 'Win of the Week',
      description:
        'Each team member shares their biggest accomplishment from the past week.',
      duration: '15 min',
    },
    {
      title: 'Virtual High-Fives',
      description:
        'Quick round of recognizing team members who helped you this week.',
      duration: '10 min',
    },
    {
      title: 'Milestone Celebration',
      description:
        'Celebrate project completions, work anniversaries, or personal achievements.',
      duration: '20 min',
    },
  ],
  kudos: [
    {
      title: 'Kudos Wall',
      description:
        'Create a shared space where team members can post appreciation for each other.',
      duration: '5 min',
    },
    {
      title: 'Thank You Thursday',
      description:
        'Weekly tradition of publicly thanking a colleague who made your week better.',
      duration: '10 min',
    },
  ],
};

// Get activity suggestions based on team wellness
export const getSuggestedActivities = async (
  workspaceId: string,
  options: {
    count?: number;
    type?: ActivityType;
    wellness?: {
      avgMood: number;
      avgEnergy: number;
      avgStress: number;
    };
  } = {}
): Promise<any[]> => {
  const { count = 3, type, wellness } = options;

  // Determine what type of activities to suggest based on wellness metrics
  let suggestedTypes: ActivityType[] = [];

  if (type) {
    suggestedTypes = [type];
  } else if (wellness) {
    // Low mood → celebrations and kudos
    if (wellness.avgMood < 3) {
      suggestedTypes.push('celebration', 'kudos');
    }

    // Low energy → wellness breaks
    if (wellness.avgEnergy < 3) {
      suggestedTypes.push('wellness_break');
    }

    // High stress → wellness and social
    if (wellness.avgStress > 3.5) {
      suggestedTypes.push('wellness_break', 'icebreaker');
    }

    // If nothing specific, suggest variety
    if (suggestedTypes.length === 0) {
      suggestedTypes = ['icebreaker', 'team_lunch', 'celebration'];
    }
  } else {
    suggestedTypes = Object.keys(activityTemplates) as ActivityType[];
  }

  // Get random activities from suggested types
  const suggestions: any[] = [];
  const usedTitles = new Set<string>();

  while (suggestions.length < count && suggestedTypes.length > 0) {
    const actType = suggestedTypes[Math.floor(Math.random() * suggestedTypes.length)];
    const templates = activityTemplates[actType];
    const template = templates[Math.floor(Math.random() * templates.length)];

    if (!usedTitles.has(template.title)) {
      usedTitles.add(template.title);
      suggestions.push({
        type: actType,
        ...template,
        suggestedDate: getNextSuggestedDate(),
      });
    }
  }

  return suggestions;
};

// Create an activity
export const createActivity = async (
  workspaceId: string,
  data: {
    type: ActivityType;
    title: string;
    description: string;
    suggestedDate?: Date;
  }
) => {
  const activity = await prisma.activity.create({
    data: {
      workspaceId,
      type: data.type,
      title: data.title,
      description: data.description,
      suggestedDate: data.suggestedDate,
    },
  });

  logger.info(`Activity created: ${activity.id}`);
  return activity;
};

// Get activities for workspace
export const getActivities = async (
  workspaceId: string,
  options: { status?: string; limit?: number } = {}
) => {
  const { status, limit = 20 } = options;

  return prisma.activity.findMany({
    where: {
      workspaceId,
      ...(status && { status }),
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
};

// Update activity status
export const updateActivityStatus = async (
  id: string,
  workspaceId: string,
  status: 'scheduled' | 'completed' | 'cancelled'
) => {
  return prisma.activity.updateMany({
    where: { id, workspaceId },
    data: { status },
  });
};

// Helper to get a suggested date (next weekday)
const getNextSuggestedDate = (): Date => {
  const date = new Date();
  date.setDate(date.getDate() + Math.floor(Math.random() * 5) + 1);

  // Skip weekends
  while (date.getDay() === 0 || date.getDay() === 6) {
    date.setDate(date.getDate() + 1);
  }

  date.setHours(14, 0, 0, 0); // 2 PM
  return date;
};
