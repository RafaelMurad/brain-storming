import OpenAI from 'openai';
import { config, featureFlags } from '../config';
import { logger } from '../config/logger';

// Initialize OpenAI client
const openai = config.openaiApiKey ? new OpenAI({ apiKey: config.openaiApiKey }) : null;

// Sentiment analysis result
export interface SentimentResult {
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number; // -1 to 1
  confidence: number; // 0 to 1
}

// Lead scoring result
export interface LeadScoreResult {
  score: number; // 0 to 100
  reason: string;
  intent: 'buying' | 'researching' | 'complaining' | 'discussing' | 'other';
  urgency: 'high' | 'medium' | 'low';
}

// Analyze sentiment of text
export const analyzeSentiment = async (text: string): Promise<SentimentResult> => {
  if (!openai || !featureFlags.aiScoring) {
    // Fallback to simple keyword-based sentiment
    return simpleSentimentAnalysis(text);
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a sentiment analysis expert. Analyze the sentiment of the given text and respond with JSON only:
{
  "sentiment": "positive" | "negative" | "neutral",
  "score": number between -1 and 1,
  "confidence": number between 0 and 1
}`,
        },
        {
          role: 'user',
          content: text.substring(0, 1000), // Limit text length
        },
      ],
      temperature: 0.1,
      max_tokens: 100,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const result = JSON.parse(content);
    return {
      sentiment: result.sentiment,
      score: Math.max(-1, Math.min(1, result.score)),
      confidence: Math.max(0, Math.min(1, result.confidence)),
    };
  } catch (error) {
    logger.warn('AI sentiment analysis failed, using fallback:', error);
    return simpleSentimentAnalysis(text);
  }
};

// Score a lead based on content
export const scoreLeads = async (
  title: string,
  content: string,
  context: {
    subreddit?: string;
    score?: number;
    numComments?: number;
  }
): Promise<LeadScoreResult> => {
  if (!openai || !featureFlags.aiScoring) {
    return simpleLeadScoring(title, content, context);
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a lead scoring expert for a B2B SaaS company. Analyze the post to determine if this person could be a potential customer. Consider:
- Are they actively looking for a solution?
- Do they have budget authority signals?
- Is there urgency in their request?
- Is this a quality lead worth pursuing?

Respond with JSON only:
{
  "score": number 0-100 (higher = better lead),
  "reason": "brief explanation",
  "intent": "buying" | "researching" | "complaining" | "discussing" | "other",
  "urgency": "high" | "medium" | "low"
}`,
        },
        {
          role: 'user',
          content: `Title: ${title}\n\nContent: ${content.substring(0, 1500)}\n\nSubreddit: ${context.subreddit || 'unknown'}\nUpvotes: ${context.score || 0}\nComments: ${context.numComments || 0}`,
        },
      ],
      temperature: 0.2,
      max_tokens: 200,
    });

    const responseContent = response.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('No response from OpenAI');
    }

    const result = JSON.parse(responseContent);
    return {
      score: Math.max(0, Math.min(100, result.score)),
      reason: result.reason,
      intent: result.intent,
      urgency: result.urgency,
    };
  } catch (error) {
    logger.warn('AI lead scoring failed, using fallback:', error);
    return simpleLeadScoring(title, content, context);
  }
};

// Simple keyword-based sentiment analysis fallback
const simpleSentimentAnalysis = (text: string): SentimentResult => {
  const lowerText = text.toLowerCase();

  const positiveWords = [
    'great',
    'awesome',
    'love',
    'excellent',
    'amazing',
    'perfect',
    'best',
    'recommend',
    'helpful',
    'thanks',
  ];
  const negativeWords = [
    'bad',
    'terrible',
    'hate',
    'worst',
    'awful',
    'disappointed',
    'frustrating',
    'broken',
    'useless',
    'waste',
  ];

  let positiveCount = 0;
  let negativeCount = 0;

  positiveWords.forEach(word => {
    if (lowerText.includes(word)) positiveCount++;
  });

  negativeWords.forEach(word => {
    if (lowerText.includes(word)) negativeCount++;
  });

  const total = positiveCount + negativeCount;
  if (total === 0) {
    return { sentiment: 'neutral', score: 0, confidence: 0.5 };
  }

  const score = (positiveCount - negativeCount) / Math.max(total, 1);
  const sentiment = score > 0.2 ? 'positive' : score < -0.2 ? 'negative' : 'neutral';

  return {
    sentiment,
    score: Math.max(-1, Math.min(1, score)),
    confidence: Math.min(0.8, total * 0.1),
  };
};

// Simple rule-based lead scoring fallback
const simpleLeadScoring = (
  title: string,
  content: string,
  context: { subreddit?: string; score?: number; numComments?: number }
): LeadScoreResult => {
  const text = `${title} ${content}`.toLowerCase();
  let score = 30; // Base score
  let reason = 'General discussion';
  let intent: LeadScoreResult['intent'] = 'discussing';
  let urgency: LeadScoreResult['urgency'] = 'low';

  // Buying signals
  const buyingKeywords = [
    'looking for',
    'need',
    'want to buy',
    'recommend',
    'suggestion',
    'what should i use',
    'best tool',
    'alternative to',
    'pricing',
    'cost',
    'budget',
  ];

  const urgentKeywords = ['asap', 'urgent', 'immediately', 'deadline', 'quickly', 'fast', 'now'];

  const complainingKeywords = [
    'sucks',
    'terrible',
    'worst',
    'hate',
    'frustrated',
    'disappointed',
    'broken',
  ];

  // Check for buying intent
  const hasBuyingIntent = buyingKeywords.some(kw => text.includes(kw));
  if (hasBuyingIntent) {
    score += 30;
    intent = 'researching';
    reason = 'Actively looking for a solution';
  }

  // Check for urgency
  const hasUrgency = urgentKeywords.some(kw => text.includes(kw));
  if (hasUrgency) {
    score += 20;
    urgency = 'high';
    reason += '. High urgency indicated';
  }

  // Check for complaining (competitor opportunity)
  const isComplaining = complainingKeywords.some(kw => text.includes(kw));
  if (isComplaining) {
    score += 15;
    intent = 'complaining';
    reason = 'Frustrated with current solution - potential switch';
  }

  // Engagement bonus
  if (context.score && context.score > 50) {
    score += 10;
  }
  if (context.numComments && context.numComments > 20) {
    score += 5;
  }

  // Relevant subreddit bonus
  const relevantSubreddits = ['webdev', 'programming', 'saas', 'startups', 'entrepreneur'];
  if (context.subreddit && relevantSubreddits.includes(context.subreddit.toLowerCase())) {
    score += 10;
  }

  return {
    score: Math.min(100, score),
    reason,
    intent,
    urgency,
  };
};

// Check if AI is configured
export const isAIConfigured = (): boolean => {
  return !!config.openaiApiKey;
};
