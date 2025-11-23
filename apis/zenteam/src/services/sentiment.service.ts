import OpenAI from 'openai';
import { config, featureFlags } from '../config';
import { logger } from '../config/logger';

const openai = config.openaiApiKey ? new OpenAI({ apiKey: config.openaiApiKey }) : null;

export interface SentimentResult {
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  confidence: number;
}

// Analyze sentiment of text
export const analyzeSentiment = async (text: string): Promise<SentimentResult> => {
  if (!openai || !featureFlags.sentimentAnalysis) {
    return simpleSentiment(text);
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Analyze the emotional sentiment of this workplace check-in message. Consider stress, burnout, and wellbeing indicators. Respond with JSON only:
{
  "sentiment": "positive" | "negative" | "neutral",
  "score": number between -1 and 1,
  "confidence": number between 0 and 1
}`,
        },
        { role: 'user', content: text.substring(0, 500) },
      ],
      temperature: 0.1,
      max_tokens: 100,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('No response');

    return JSON.parse(content);
  } catch (error) {
    logger.warn('AI sentiment failed, using fallback:', error);
    return simpleSentiment(text);
  }
};

// Simple keyword-based sentiment
const simpleSentiment = (text: string): SentimentResult => {
  const lower = text.toLowerCase();

  const positive = [
    'great',
    'good',
    'happy',
    'excited',
    'productive',
    'motivated',
    'energized',
    'love',
    'awesome',
  ];
  const negative = [
    'tired',
    'stressed',
    'overwhelmed',
    'exhausted',
    'frustrated',
    'burned',
    'anxious',
    'worried',
    'struggling',
  ];

  let posCount = 0,
    negCount = 0;

  positive.forEach(w => {
    if (lower.includes(w)) posCount++;
  });
  negative.forEach(w => {
    if (lower.includes(w)) negCount++;
  });

  const total = posCount + negCount;
  if (total === 0) return { sentiment: 'neutral', score: 0, confidence: 0.5 };

  const score = (posCount - negCount) / total;
  return {
    sentiment: score > 0.2 ? 'positive' : score < -0.2 ? 'negative' : 'neutral',
    score,
    confidence: Math.min(0.8, total * 0.15),
  };
};

// Generate wellness insights
export const generateInsights = async (
  stats: {
    avgMood: number;
    avgEnergy: number;
    avgWorkload: number;
    avgStress: number;
    trend: string;
  },
  memberCount: number
): Promise<string[]> => {
  const insights: string[] = [];

  // Energy insights
  if (stats.avgEnergy < 2.5) {
    insights.push(
      'Team energy is low. Consider scheduling more breaks or a team wellness activity.'
    );
  } else if (stats.avgEnergy > 4) {
    insights.push('Team energy is high! Great time for challenging projects.');
  }

  // Workload insights
  if (stats.avgWorkload > 4) {
    insights.push(
      'Workload is very high across the team. Review priorities and consider redistributing tasks.'
    );
  } else if (stats.avgWorkload > 3.5) {
    insights.push('Workload is elevated. Monitor closely to prevent burnout.');
  }

  // Stress insights
  if (stats.avgStress > 3.5) {
    insights.push('Stress levels are elevated. Consider team-building activities or 1:1 check-ins.');
  }

  // Trend insights
  if (stats.trend === 'declining') {
    insights.push('Team wellness is declining. Take proactive steps to address concerns.');
  } else if (stats.trend === 'improving') {
    insights.push('Team wellness is improving! Keep up the positive momentum.');
  }

  // Mood insights
  if (stats.avgMood < 3) {
    insights.push('Team morale needs attention. Consider recognition or celebration opportunities.');
  }

  if (insights.length === 0) {
    insights.push('Team metrics are healthy. Continue current practices.');
  }

  return insights;
};
