/**
 * Three.js Academy - Complete Curriculum
 */

import type { Curriculum, Module, Lesson } from './types';
import {
  fundamentalsModule,
  geometriesMaterialsModule,
  texturesLightingModule,
  camerasControlsModule,
  animationPhysicsModule,
  shadersPostProcessingModule
} from './modules';

// Assemble the full curriculum
export const curriculum: Curriculum = {
  version: '1.0.0',
  lastUpdated: new Date().toISOString().split('T')[0],
  modules: [
    fundamentalsModule,
    geometriesMaterialsModule,
    texturesLightingModule,
    camerasControlsModule,
    animationPhysicsModule,
    shadersPostProcessingModule
  ]
};

/**
 * Get a module by ID
 */
export function getModule(moduleId: string): Module | undefined {
  return curriculum.modules.find(m => m.id === moduleId);
}

/**
 * Get a lesson by ID (searches all modules)
 */
export function getLesson(lessonId: string): { module: Module; lesson: Lesson } | undefined {
  for (const module of curriculum.modules) {
    const lesson = module.lessons.find(l => l.meta.id === lessonId);
    if (lesson) {
      return { module, lesson };
    }
  }
  return undefined;
}

/**
 * Get all lessons across all modules
 */
export function getAllLessons(): Array<{ module: Module; lesson: Lesson }> {
  const result: Array<{ module: Module; lesson: Lesson }> = [];
  
  for (const module of curriculum.modules) {
    for (const lesson of module.lessons) {
      result.push({ module, lesson });
    }
  }
  
  return result;
}

/**
 * Get next lesson after the given lesson ID
 */
export function getNextLesson(currentLessonId: string): { module: Module; lesson: Lesson } | undefined {
  const allLessons = getAllLessons();
  const currentIndex = allLessons.findIndex(({ lesson }) => lesson.meta.id === currentLessonId);
  
  if (currentIndex >= 0 && currentIndex < allLessons.length - 1) {
    return allLessons[currentIndex + 1];
  }
  
  return undefined;
}

/**
 * Get previous lesson before the given lesson ID
 */
export function getPreviousLesson(currentLessonId: string): { module: Module; lesson: Lesson } | undefined {
  const allLessons = getAllLessons();
  const currentIndex = allLessons.findIndex(({ lesson }) => lesson.meta.id === currentLessonId);
  
  if (currentIndex > 0) {
    return allLessons[currentIndex - 1];
  }
  
  return undefined;
}

/**
 * Get curriculum statistics
 */
export function getCurriculumStats(): {
  totalModules: number;
  totalLessons: number;
  totalExercises: number;
  totalDuration: number;
  byDifficulty: { beginner: number; intermediate: number; advanced: number };
} {
  let totalLessons = 0;
  let totalExercises = 0;
  let totalDuration = 0;
  const byDifficulty = { beginner: 0, intermediate: 0, advanced: 0 };

  for (const module of curriculum.modules) {
    for (const lesson of module.lessons) {
      totalLessons++;
      totalExercises += lesson.exercises.length;
      totalDuration += lesson.meta.duration;
      byDifficulty[lesson.meta.difficulty]++;
    }
  }

  return {
    totalModules: curriculum.modules.length,
    totalLessons,
    totalExercises,
    totalDuration,
    byDifficulty
  };
}

export * from './types';
