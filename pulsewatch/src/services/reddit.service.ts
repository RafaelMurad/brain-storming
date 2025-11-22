import axios from 'axios';
import { config } from '../config';
import { logger } from '../config/logger';

// Reddit post interface
export interface RedditPost {
  id: string;
  title: string;
  selftext: string;
  author: string;
  subreddit: string;
  url: string;
  permalink: string;
  score: number;
  numComments: number;
  createdUtc: number;
}

// Token management
let accessToken: string | null = null;
let tokenExpiry: Date | null = null;

// Get Reddit access token
const getAccessToken = async (): Promise<string> => {
  // Return cached token if valid
  if (accessToken && tokenExpiry && new Date() < tokenExpiry) {
    return accessToken;
  }

  if (!config.redditClientId || !config.redditClientSecret) {
    throw new Error('Reddit API credentials not configured');
  }

  try {
    const auth = Buffer.from(`${config.redditClientId}:${config.redditClientSecret}`).toString(
      'base64'
    );

    const response = await axios.post(
      'https://www.reddit.com/api/v1/access_token',
      new URLSearchParams({
        grant_type: 'password',
        username: config.redditUsername || '',
        password: config.redditPassword || '',
      }),
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': config.redditUserAgent,
        },
      }
    );

    accessToken = response.data.access_token;
    // Token expires in 1 hour, refresh 5 minutes early
    tokenExpiry = new Date(Date.now() + (response.data.expires_in - 300) * 1000);

    logger.info('Reddit access token obtained');
    return accessToken;
  } catch (error) {
    logger.error('Failed to get Reddit access token:', error);
    throw new Error('Reddit authentication failed');
  }
};

// Search Reddit for keywords
export const searchReddit = async (
  query: string,
  options: {
    subreddit?: string;
    sort?: 'relevance' | 'hot' | 'top' | 'new';
    time?: 'hour' | 'day' | 'week' | 'month' | 'year' | 'all';
    limit?: number;
  } = {}
): Promise<RedditPost[]> => {
  const token = await getAccessToken();

  const { subreddit, sort = 'new', time = 'day', limit = 25 } = options;

  const baseUrl = subreddit
    ? `https://oauth.reddit.com/r/${subreddit}/search`
    : 'https://oauth.reddit.com/search';

  try {
    const response = await axios.get(baseUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        'User-Agent': config.redditUserAgent,
      },
      params: {
        q: query,
        sort,
        t: time,
        limit,
        restrict_sr: subreddit ? 'true' : 'false',
        type: 'link',
      },
    });

    const posts: RedditPost[] = response.data.data.children.map((child: any) => ({
      id: child.data.id,
      title: child.data.title,
      selftext: child.data.selftext || '',
      author: child.data.author,
      subreddit: child.data.subreddit,
      url: child.data.url,
      permalink: `https://reddit.com${child.data.permalink}`,
      score: child.data.score,
      numComments: child.data.num_comments,
      createdUtc: child.data.created_utc,
    }));

    logger.debug(`Found ${posts.length} posts for query: ${query}`);
    return posts;
  } catch (error) {
    logger.error('Reddit search failed:', error);
    throw error;
  }
};

// Get posts from a subreddit
export const getSubredditPosts = async (
  subreddit: string,
  options: {
    sort?: 'hot' | 'new' | 'top' | 'rising';
    time?: 'hour' | 'day' | 'week' | 'month' | 'year' | 'all';
    limit?: number;
  } = {}
): Promise<RedditPost[]> => {
  const token = await getAccessToken();

  const { sort = 'new', time = 'day', limit = 25 } = options;

  try {
    const response = await axios.get(`https://oauth.reddit.com/r/${subreddit}/${sort}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'User-Agent': config.redditUserAgent,
      },
      params: {
        t: time,
        limit,
      },
    });

    const posts: RedditPost[] = response.data.data.children.map((child: any) => ({
      id: child.data.id,
      title: child.data.title,
      selftext: child.data.selftext || '',
      author: child.data.author,
      subreddit: child.data.subreddit,
      url: child.data.url,
      permalink: `https://reddit.com${child.data.permalink}`,
      score: child.data.score,
      numComments: child.data.num_comments,
      createdUtc: child.data.created_utc,
    }));

    return posts;
  } catch (error) {
    logger.error(`Failed to get posts from r/${subreddit}:`, error);
    throw error;
  }
};

// Check if post matches keywords
export const matchesKeywords = (
  post: RedditPost,
  keywords: string[]
): { matches: boolean; matchedKeywords: string[] } => {
  const content = `${post.title} ${post.selftext}`.toLowerCase();
  const matchedKeywords: string[] = [];

  for (const keyword of keywords) {
    const normalizedKeyword = keyword.toLowerCase().trim();

    // Support phrase matching with quotes
    if (normalizedKeyword.startsWith('"') && normalizedKeyword.endsWith('"')) {
      const phrase = normalizedKeyword.slice(1, -1);
      if (content.includes(phrase)) {
        matchedKeywords.push(keyword);
      }
    } else {
      // Word boundary matching
      const regex = new RegExp(`\\b${normalizedKeyword}\\b`, 'i');
      if (regex.test(content)) {
        matchedKeywords.push(keyword);
      }
    }
  }

  return {
    matches: matchedKeywords.length > 0,
    matchedKeywords,
  };
};

// Simulate Reddit API for demo mode (when no credentials)
export const getDemoPosts = (): RedditPost[] => {
  return [
    {
      id: 'demo1',
      title: 'Looking for a screenshot API for my SaaS',
      selftext:
        "I'm building a link preview feature and need a reliable screenshot API. Any recommendations?",
      author: 'demo_user1',
      subreddit: 'webdev',
      url: 'https://reddit.com/r/webdev/demo1',
      permalink: 'https://reddit.com/r/webdev/demo1',
      score: 45,
      numComments: 23,
      createdUtc: Date.now() / 1000 - 3600,
    },
    {
      id: 'demo2',
      title: 'Need help with automated PDF generation',
      selftext:
        'My team needs to generate PDF reports from our dashboard. What tools do you recommend?',
      author: 'demo_user2',
      subreddit: 'programming',
      url: 'https://reddit.com/r/programming/demo2',
      permalink: 'https://reddit.com/r/programming/demo2',
      score: 78,
      numComments: 56,
      createdUtc: Date.now() / 1000 - 7200,
    },
    {
      id: 'demo3',
      title: 'Best practices for website monitoring?',
      selftext:
        "We're setting up monitoring for our e-commerce site. Looking for screenshot comparison tools.",
      author: 'demo_user3',
      subreddit: 'devops',
      url: 'https://reddit.com/r/devops/demo3',
      permalink: 'https://reddit.com/r/devops/demo3',
      score: 34,
      numComments: 18,
      createdUtc: Date.now() / 1000 - 14400,
    },
  ];
};

// Check if Reddit API is configured
export const isRedditConfigured = (): boolean => {
  return !!(
    config.redditClientId &&
    config.redditClientSecret &&
    config.redditUsername &&
    config.redditPassword
  );
};
