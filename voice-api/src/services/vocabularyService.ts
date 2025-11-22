import { prisma } from '../lib/db';
import { z } from 'zod';

export const createVocabularySchema = z.object({
  name: z.string().min(1).max(100).regex(/^[a-z0-9_-]+$/i),
  description: z.string().max(500).optional(),
  words: z.array(z.string().min(1).max(100)).min(1).max(500),
  boost: z.number().min(0).max(10).default(1.0),
  category: z.string().max(50).optional(),
});

export const updateVocabularySchema = createVocabularySchema.partial();

export type CreateVocabularyInput = z.infer<typeof createVocabularySchema>;
export type UpdateVocabularyInput = z.infer<typeof updateVocabularySchema>;

export async function createVocabulary(projectId: string, input: CreateVocabularyInput) {
  return prisma.vocabulary.create({
    data: {
      projectId,
      name: input.name,
      description: input.description,
      words: JSON.stringify(input.words),
      boost: input.boost,
      category: input.category,
    },
  });
}

export async function updateVocabulary(
  projectId: string,
  vocabularyId: string,
  input: UpdateVocabularyInput
) {
  const vocab = await prisma.vocabulary.findFirst({
    where: { id: vocabularyId, projectId },
  });

  if (!vocab) return null;

  return prisma.vocabulary.update({
    where: { id: vocabularyId },
    data: {
      name: input.name,
      description: input.description,
      words: input.words ? JSON.stringify(input.words) : undefined,
      boost: input.boost,
      category: input.category,
    },
  });
}

export async function getVocabulary(projectId: string, vocabularyId: string) {
  const vocab = await prisma.vocabulary.findFirst({
    where: { id: vocabularyId, projectId },
  });

  if (!vocab) return null;

  return {
    ...vocab,
    words: JSON.parse(vocab.words),
  };
}

export async function listVocabularies(projectId: string, category?: string) {
  const where: any = { projectId, isActive: true };
  if (category) where.category = category;

  const vocabs = await prisma.vocabulary.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  return vocabs.map(v => ({
    ...v,
    words: JSON.parse(v.words),
  }));
}

export async function deleteVocabulary(projectId: string, vocabularyId: string) {
  const vocab = await prisma.vocabulary.findFirst({
    where: { id: vocabularyId, projectId },
  });

  if (!vocab) return false;

  await prisma.vocabulary.delete({ where: { id: vocabularyId } });
  return true;
}

// Merge vocabularies for transcription
export async function getMergedVocabulary(projectId: string, vocabularyIds?: string[]): Promise<string[]> {
  let where: any = { projectId, isActive: true };

  if (vocabularyIds && vocabularyIds.length > 0) {
    where.id = { in: vocabularyIds };
  }

  const vocabs = await prisma.vocabulary.findMany({ where });

  const allWords = new Set<string>();
  for (const vocab of vocabs) {
    const words = JSON.parse(vocab.words) as string[];
    words.forEach(w => allWords.add(w));
  }

  return Array.from(allWords);
}
