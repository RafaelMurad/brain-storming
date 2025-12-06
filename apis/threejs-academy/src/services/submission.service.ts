import { prisma } from '../lib/database';

export interface SubmissionInput {
  lessonId: string;
  code: string;
  passed: boolean;
  score: number;
  feedback?: string;
  executionTime?: number;
}

export interface SubmissionData {
  id: string;
  lessonId: string;
  code: string;
  passed: boolean;
  score: number;
  feedback: string | null;
  executionTime: number | null;
  createdAt: Date;
}

// Save exercise submission
export const saveSubmission = async (userId: string, input: SubmissionInput): Promise<SubmissionData> => {
  const submission = await prisma.exerciseSubmission.create({
    data: {
      userId,
      lessonId: input.lessonId,
      code: input.code,
      passed: input.passed,
      score: input.score,
      feedback: input.feedback,
      executionTime: input.executionTime,
    },
  });
  
  return {
    id: submission.id,
    lessonId: submission.lessonId,
    code: submission.code,
    passed: submission.passed,
    score: submission.score,
    feedback: submission.feedback,
    executionTime: submission.executionTime,
    createdAt: submission.createdAt,
  };
};

// Get user's submissions for a lesson
export const getLessonSubmissions = async (userId: string, lessonId: string): Promise<SubmissionData[]> => {
  const submissions = await prisma.exerciseSubmission.findMany({
    where: { userId, lessonId },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });
  
  return submissions.map(s => ({
    id: s.id,
    lessonId: s.lessonId,
    code: s.code,
    passed: s.passed,
    score: s.score,
    feedback: s.feedback,
    executionTime: s.executionTime,
    createdAt: s.createdAt,
  }));
};

// Get best submission for a lesson
export const getBestSubmission = async (userId: string, lessonId: string): Promise<SubmissionData | null> => {
  const submission = await prisma.exerciseSubmission.findFirst({
    where: { userId, lessonId },
    orderBy: { score: 'desc' },
  });
  
  if (!submission) return null;
  
  return {
    id: submission.id,
    lessonId: submission.lessonId,
    code: submission.code,
    passed: submission.passed,
    score: submission.score,
    feedback: submission.feedback,
    executionTime: submission.executionTime,
    createdAt: submission.createdAt,
  };
};
