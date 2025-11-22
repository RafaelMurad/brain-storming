import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../lib/database';
import { logger } from '../config/logger';

async function seed() {
  logger.info('Starting database seed...');

  try {
    const apiKey = `zt_${uuidv4().replace(/-/g, '')}`;

    // Create workspace
    const workspace = await prisma.workspace.create({
      data: {
        name: 'Demo Company',
        apiKey,
        plan: 'pro',
        timezone: 'America/New_York',
      },
    });

    logger.info(`Created workspace: ${workspace.name}`);

    // Create team members
    const members = await Promise.all([
      prisma.member.create({
        data: {
          workspaceId: workspace.id,
          name: 'Alice Johnson',
          email: 'alice@demo.com',
          role: 'manager',
          department: 'Engineering',
          wellnessScore: 78,
        },
      }),
      prisma.member.create({
        data: {
          workspaceId: workspace.id,
          name: 'Bob Smith',
          email: 'bob@demo.com',
          role: 'member',
          department: 'Engineering',
          wellnessScore: 65,
        },
      }),
      prisma.member.create({
        data: {
          workspaceId: workspace.id,
          name: 'Carol Williams',
          email: 'carol@demo.com',
          role: 'member',
          department: 'Design',
          wellnessScore: 82,
        },
      }),
      prisma.member.create({
        data: {
          workspaceId: workspace.id,
          name: 'David Brown',
          email: 'david@demo.com',
          role: 'member',
          department: 'Engineering',
          wellnessScore: 35, // At risk
        },
      }),
    ]);

    logger.info(`Created ${members.length} team members`);

    // Create some check-ins
    const now = new Date();
    for (const member of members) {
      for (let i = 0; i < 5; i++) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const isAtRisk = member.wellnessScore < 50;

        await prisma.checkin.create({
          data: {
            workspaceId: workspace.id,
            memberId: member.id,
            mood: isAtRisk ? Math.floor(Math.random() * 2) + 1 : Math.floor(Math.random() * 2) + 3,
            energy: isAtRisk
              ? Math.floor(Math.random() * 2) + 1
              : Math.floor(Math.random() * 2) + 3,
            workload: isAtRisk
              ? Math.floor(Math.random() * 2) + 4
              : Math.floor(Math.random() * 2) + 2,
            stress: isAtRisk ? Math.floor(Math.random() * 2) + 4 : Math.floor(Math.random() * 2) + 1,
            wellnessScore: member.wellnessScore + Math.floor(Math.random() * 10) - 5,
            createdAt: date,
          },
        });
      }

      await prisma.member.update({
        where: { id: member.id },
        data: { lastCheckinAt: now },
      });
    }

    logger.info('Created check-in history');

    // Create burnout alert for at-risk member
    const atRiskMember = members.find(m => m.wellnessScore < 50);
    if (atRiskMember) {
      await prisma.burnoutAlert.create({
        data: {
          workspaceId: workspace.id,
          memberId: atRiskMember.id,
          severity: 'warning',
          reason: 'Wellness score has been below 40 for the past week',
          wellnessScore: atRiskMember.wellnessScore,
        },
      });

      logger.info('Created burnout alert');
    }

    // Create suggested activity
    await prisma.activity.create({
      data: {
        workspaceId: workspace.id,
        type: 'wellness_break',
        title: 'Guided Team Meditation',
        description: 'A 10-minute guided meditation session to help the team destress.',
        status: 'suggested',
        suggestedDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      },
    });

    logger.info('Created suggested activity');

    // Feature flags
    const flags = [
      { name: 'dailyCheckins', enabled: true },
      { name: 'sentimentAnalysis', enabled: true },
      { name: 'burnoutPrediction', enabled: true },
      { name: 'teamActivities', enabled: true },
      { name: 'anonymousFeedback', enabled: true },
      { name: 'managerAlerts', enabled: false },
    ];

    for (const flag of flags) {
      await prisma.featureFlag.create({ data: flag });
    }

    logger.info('');
    logger.info('='.repeat(60));
    logger.info('SAVE THIS INFORMATION:');
    logger.info('='.repeat(60));
    logger.info(`Workspace ID: ${workspace.id}`);
    logger.info(`API Key: ${apiKey}`);
    logger.info('='.repeat(60));
    logger.info('');
    logger.info('Team Members:');
    members.forEach(m => {
      logger.info(`  - ${m.name} (${m.id}) - Wellness: ${m.wellnessScore}`);
    });
    logger.info('');
    logger.info('Seed completed successfully!');
  } catch (error) {
    logger.error('Seed failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed().catch(error => {
  console.error('Seed error:', error);
  process.exit(1);
});
