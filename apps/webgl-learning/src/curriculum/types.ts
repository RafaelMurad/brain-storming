/**
 * Three.js Academy - Curriculum Types
 * Defines the structure for modules, lessons, and exercises
 */

export interface LessonMeta {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string[];
  objectives: string[];
  tags: string[];
}

export interface LessonTheory {
  markdown: string;
  concepts: string[];
  references: {
    title: string;
    url: string;
  }[];
}

export interface LessonExercise {
  id: string;
  title: string;
  description: string;
  starterCode: string;
  solutionCode: string;
  hints: string[];
  validation: {
    type: 'visual' | 'code' | 'console';
    expected?: string;
    checks?: string[];
  };
}

export interface Lesson {
  meta: LessonMeta;
  theory: LessonTheory;
  exercises: LessonExercise[];
}

export interface Module {
  id: string;
  number: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  lessons: Lesson[];
}

export interface Curriculum {
  version: string;
  lastUpdated: string;
  modules: Module[];
}

// Progress tracking
export interface LessonProgress {
  lessonId: string;
  status: 'not-started' | 'in-progress' | 'completed';
  currentExercise: number;
  exercisesCompleted: number[];
  timeSpent: number;
  lastAccessedAt?: Date;
  completedAt?: Date;
}

export interface ModuleProgress {
  moduleId: string;
  lessonsCompleted: number;
  totalLessons: number;
  percentComplete: number;
}
