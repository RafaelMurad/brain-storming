import { prisma } from '../lib/database';

export interface NoteData {
  lessonId: string;
  content: string;
  updatedAt: Date;
}

// Get note for a lesson
export const getNote = async (userId: string, lessonId: string): Promise<NoteData | null> => {
  const note = await prisma.lessonNote.findUnique({
    where: { userId_lessonId: { userId, lessonId } },
  });
  
  if (!note) return null;
  
  return {
    lessonId: note.lessonId,
    content: note.content,
    updatedAt: note.updatedAt,
  };
};

// Get all notes for a user
export const getAllNotes = async (userId: string): Promise<NoteData[]> => {
  const notes = await prisma.lessonNote.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
  });
  
  return notes.map(n => ({
    lessonId: n.lessonId,
    content: n.content,
    updatedAt: n.updatedAt,
  }));
};

// Save or update note
export const saveNote = async (userId: string, lessonId: string, content: string): Promise<NoteData> => {
  const note = await prisma.lessonNote.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    create: {
      userId,
      lessonId,
      content,
    },
    update: {
      content,
    },
  });
  
  return {
    lessonId: note.lessonId,
    content: note.content,
    updatedAt: note.updatedAt,
  };
};

// Delete note
export const deleteNote = async (userId: string, lessonId: string): Promise<void> => {
  await prisma.lessonNote.delete({
    where: { userId_lessonId: { userId, lessonId } },
  }).catch(() => {}); // Ignore if not found
};
