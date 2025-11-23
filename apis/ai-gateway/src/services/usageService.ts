import { prisma } from '../lib/db';
import { logger } from '../lib/logger';

export async function getUsageStats(projectId: string, days: number = 30) {
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const requests = await prisma.request.findMany({
    where: {
      projectId,
      createdAt: { gte: startDate },
    },
    select: {
      provider: true,
      model: true,
      promptTokens: true,
      completionTokens: true,
      totalTokens: true,
      cost: true,
      cacheHit: true,
      latencyMs: true,
      status: true,
      createdAt: true,
    },
  });

  // Aggregate stats
  const totalRequests = requests.length;
  const totalTokens = requests.reduce((sum, r) => sum + r.totalTokens, 0);
  const totalCost = requests.reduce((sum, r) => sum + r.cost, 0);
  const cacheHits = requests.filter(r => r.cacheHit).length;
  const avgLatency = requests.length > 0
    ? Math.round(requests.reduce((sum, r) => sum + r.latencyMs, 0) / requests.length)
    : 0;

  // By model
  const byModel = requests.reduce((acc, r) => {
    if (!acc[r.model]) {
      acc[r.model] = { requests: 0, tokens: 0, cost: 0 };
    }
    acc[r.model].requests++;
    acc[r.model].tokens += r.totalTokens;
    acc[r.model].cost += r.cost;
    return acc;
  }, {} as Record<string, { requests: number; tokens: number; cost: number }>);

  // By day
  const byDay = requests.reduce((acc, r) => {
    const day = r.createdAt.toISOString().split('T')[0];
    if (!acc[day]) {
      acc[day] = { requests: 0, tokens: 0, cost: 0 };
    }
    acc[day].requests++;
    acc[day].tokens += r.totalTokens;
    acc[day].cost += r.cost;
    return acc;
  }, {} as Record<string, { requests: number; tokens: number; cost: number }>);

  // Status breakdown
  const byStatus = requests.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const costSaved = requests
    .filter(r => r.cacheHit)
    .reduce((sum, r) => {
      // Estimate cost saved (based on original token counts in cache)
      return sum + r.cost;
    }, 0);

  return {
    summary: {
      totalRequests,
      totalTokens,
      totalCost: Math.round(totalCost * 1000000) / 1000000,
      cacheHitRate: totalRequests > 0 ? Math.round((cacheHits / totalRequests) * 10000) / 100 : 0,
      costSaved: Math.round(costSaved * 1000000) / 1000000,
      avgLatencyMs: avgLatency,
    },
    byModel: Object.entries(byModel).map(([model, stats]) => ({
      model,
      ...stats,
      cost: Math.round(stats.cost * 1000000) / 1000000,
    })),
    byDay: Object.entries(byDay)
      .map(([date, stats]) => ({
        date,
        ...stats,
        cost: Math.round(stats.cost * 1000000) / 1000000,
      }))
      .sort((a, b) => a.date.localeCompare(b.date)),
    byStatus,
    period: { days, start: startDate.toISOString(), end: new Date().toISOString() },
  };
}

export async function checkBudget(
  apiKeyId: string,
  dailyBudget: number | null,
  monthlyBudget: number | null
): Promise<{ allowed: boolean; reason?: string; currentSpend?: number; limit?: number }> {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Check daily budget
  if (dailyBudget !== null) {
    const dailySpend = await prisma.request.aggregate({
      where: {
        apiKeyId,
        createdAt: { gte: startOfDay },
        status: 'success',
      },
      _sum: { cost: true },
    });

    const currentDaily = dailySpend._sum.cost || 0;
    if (currentDaily >= dailyBudget) {
      return {
        allowed: false,
        reason: 'Daily budget exceeded',
        currentSpend: currentDaily,
        limit: dailyBudget,
      };
    }
  }

  // Check monthly budget
  if (monthlyBudget !== null) {
    const monthlySpend = await prisma.request.aggregate({
      where: {
        apiKeyId,
        createdAt: { gte: startOfMonth },
        status: 'success',
      },
      _sum: { cost: true },
    });

    const currentMonthly = monthlySpend._sum.cost || 0;
    if (currentMonthly >= monthlyBudget) {
      return {
        allowed: false,
        reason: 'Monthly budget exceeded',
        currentSpend: currentMonthly,
        limit: monthlyBudget,
      };
    }
  }

  return { allowed: true };
}

export async function getCostBreakdown(projectId: string, startDate: Date, endDate: Date) {
  const requests = await prisma.request.findMany({
    where: {
      projectId,
      createdAt: { gte: startDate, lte: endDate },
      status: 'success',
    },
    select: {
      model: true,
      promptTokens: true,
      completionTokens: true,
      cost: true,
      createdAt: true,
    },
  });

  const breakdown = requests.reduce((acc, r) => {
    if (!acc[r.model]) {
      acc[r.model] = {
        requests: 0,
        promptTokens: 0,
        completionTokens: 0,
        cost: 0,
      };
    }
    acc[r.model].requests++;
    acc[r.model].promptTokens += r.promptTokens;
    acc[r.model].completionTokens += r.completionTokens;
    acc[r.model].cost += r.cost;
    return acc;
  }, {} as Record<string, any>);

  return Object.entries(breakdown).map(([model, stats]) => ({
    model,
    ...stats,
    cost: Math.round(stats.cost * 1000000) / 1000000,
  }));
}
