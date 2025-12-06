/**
 * Three.js Academy - Main Application Entry Point
 * Orchestrates the learning platform
 */

import { marked } from 'marked';
import { MonacoEditor } from './editor';
import { Sandbox } from './sandbox';
import { api } from './api';
import {
  curriculum,
  getModule,
  getLesson,
  getNextLesson,
  getPreviousLesson,
  getCurriculumStats,
  type Module,
  type Lesson,
  type LessonExercise
} from './curriculum';

class LearningApp {
  private editor: MonacoEditor | null = null;
  private sandbox: Sandbox | null = null;
  
  private currentModuleId: string | null = null;
  private currentLessonId: string | null = null;
  private currentExerciseIndex = 0;
  
  private completedLessons: Set<string> = new Set();
  private hintsRevealed = 0;
  
  // DOM Elements
  private elements: Record<string, HTMLElement | null> = {};

  constructor() {
    // Only initialize elements and listeners
    // Actual app initialization happens via init() method
    this.initElements();
    this.initEventListeners();
  }

  private initElements(): void {
    // Header
    this.elements.breadcrumbModule = document.getElementById('breadcrumb-module');
    this.elements.breadcrumbLesson = document.getElementById('breadcrumb-lesson');
    this.elements.resetBtn = document.getElementById('reset-btn');
    this.elements.solutionBtn = document.getElementById('solution-btn');
    this.elements.runBtn = document.getElementById('run-btn');
    this.elements.userAvatar = document.getElementById('user-avatar');

    // Sidebar
    this.elements.totalProgress = document.getElementById('total-progress');
    this.elements.completedCount = document.getElementById('completed-count');
    this.elements.totalCount = document.getElementById('total-count');
    this.elements.sidebarNav = document.getElementById('sidebar-nav');

    // Landing
    this.elements.landingView = document.getElementById('landing-view');
    this.elements.modulesGrid = document.getElementById('modules-grid');
    this.elements.statModules = document.getElementById('stat-modules');
    this.elements.statLessons = document.getElementById('stat-lessons');
    this.elements.statExercises = document.getElementById('stat-exercises');

    // Learning
    this.elements.learningView = document.getElementById('learning-view');
    this.elements.theoryContent = document.getElementById('theory-content');
    this.elements.editorContainer = document.getElementById('editor-container');
    this.elements.previewContainer = document.getElementById('preview-container');
    this.elements.previewIframe = document.getElementById('preview-iframe');
    this.elements.previewOverlay = document.getElementById('preview-overlay');

    // Exercise
    this.elements.exerciseTitle = document.getElementById('exercise-title');
    this.elements.exerciseDescription = document.getElementById('exercise-description');
    this.elements.hintBtn = document.getElementById('hint-btn');
    this.elements.hintsContainer = document.getElementById('hints-container');
    this.elements.exerciseRunBtn = document.getElementById('exercise-run-btn');

    // Navigation
    this.elements.prevLessonBtn = document.getElementById('prev-lesson-btn');
    this.elements.completeBtn = document.getElementById('complete-btn');
    this.elements.nextLessonBtn = document.getElementById('next-lesson-btn');

    // Achievement
    this.elements.achievementToast = document.getElementById('achievement-toast');
    this.elements.achievementTitle = document.getElementById('achievement-title');
    this.elements.achievementDescription = document.getElementById('achievement-description');
  }

  private initEventListeners(): void {
    // Header buttons
    this.elements.runBtn?.addEventListener('click', () => this.runCode());
    this.elements.resetBtn?.addEventListener('click', () => this.resetCode());
    this.elements.solutionBtn?.addEventListener('click', () => this.showSolution());

    // Exercise buttons
    this.elements.exerciseRunBtn?.addEventListener('click', () => this.runCode());
    this.elements.hintBtn?.addEventListener('click', () => this.toggleHints());

    // Navigation buttons
    this.elements.prevLessonBtn?.addEventListener('click', () => this.navigateToPreviousLesson());
    this.elements.nextLessonBtn?.addEventListener('click', () => this.navigateToNextLesson());
    this.elements.completeBtn?.addEventListener('click', () => this.markLessonComplete());

    // Panel tabs
    document.querySelectorAll('.panel-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const parent = target.closest('.panel-tabs');
        parent?.querySelectorAll('.panel-tab').forEach(t => t.classList.remove('active'));
        target.classList.add('active');
      });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        this.runCode();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        this.saveProgress();
      }
    });

    // Resize handle
    this.initResizeHandle();
  }

  private initResizeHandle(): void {
    const handle = document.getElementById('resize-handle');
    const theoryPanel = document.querySelector('.theory-panel') as HTMLElement;
    
    if (!handle || !theoryPanel) return;

    let isResizing = false;
    let startX = 0;
    let startWidth = 0;

    handle.addEventListener('mousedown', (e) => {
      isResizing = true;
      startX = e.clientX;
      startWidth = theoryPanel.offsetWidth;
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', (e) => {
      if (!isResizing) return;
      const diff = e.clientX - startX;
      const newWidth = Math.max(300, Math.min(startWidth + diff, window.innerWidth * 0.6));
      theoryPanel.style.flexBasis = `${newWidth}px`;
      theoryPanel.style.maxWidth = `${newWidth}px`;
    });

    document.addEventListener('mouseup', () => {
      isResizing = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    });
  }

  private async initApp(): Promise<void> {
    // Initialize API (fingerprint auth)
    try {
      const user = await api.init();
      if (user) {
        this.updateUserAvatar(user);
        await this.loadProgress();
      }
    } catch (error) {
      console.error('Failed to initialize API:', error);
    }

    // Render curriculum stats
    this.renderStats();

    // Render sidebar navigation
    this.renderSidebar();

    // Render landing page modules
    this.renderModulesGrid();

    // Check URL for lesson parameter
    const urlParams = new URLSearchParams(window.location.search);
    const lessonId = urlParams.get('lesson');
    if (lessonId) {
      this.navigateToLesson(lessonId);
    }
  }

  private updateUserAvatar(user: { githubAvatar?: string | null; githubUsername?: string | null }): void {
    if (!this.elements.userAvatar) return;

    if (user.githubAvatar) {
      this.elements.userAvatar.innerHTML = `<img src="${user.githubAvatar}" alt="" style="width: 100%; height: 100%; border-radius: 50%;">`;
    } else if (user.githubUsername) {
      this.elements.userAvatar.textContent = user.githubUsername.charAt(0).toUpperCase();
    }
  }

  private async loadProgress(): Promise<void> {
    try {
      const progress = await api.getAllProgress();
      progress.forEach(p => {
        if (p.status === 'COMPLETED') {
          this.completedLessons.add(p.lessonId);
        }
      });
      this.updateProgressUI();
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
  }

  private renderStats(): void {
    const stats = getCurriculumStats();
    
    if (this.elements.statModules) {
      this.elements.statModules.textContent = String(stats.totalModules);
    }
    if (this.elements.statLessons) {
      this.elements.statLessons.textContent = String(stats.totalLessons);
    }
    if (this.elements.statExercises) {
      this.elements.statExercises.textContent = String(stats.totalExercises);
    }
    if (this.elements.totalCount) {
      this.elements.totalCount.textContent = String(stats.totalLessons);
    }
  }

  private renderSidebar(): void {
    if (!this.elements.sidebarNav) return;

    let html = '';
    
    curriculum.modules.forEach((module, index) => {
      const completedInModule = module.lessons.filter(l => 
        this.completedLessons.has(l.meta.id)
      ).length;
      const isComplete = completedInModule === module.lessons.length;
      
      html += `
        <div class="nav-section" data-module="${module.id}">
          <div class="nav-section-header">
            <div class="nav-section-title">
              <span class="nav-section-icon">${module.icon}</span>
              <span class="nav-section-name">${module.title}</span>
            </div>
            <span class="nav-section-badge ${isComplete ? 'complete' : ''}">${completedInModule}/${module.lessons.length}</span>
          </div>
          <div class="nav-section-items">
            ${module.lessons.map(lesson => {
              const isCompleted = this.completedLessons.has(lesson.meta.id);
              return `
                <div class="nav-item ${isCompleted ? 'completed' : ''}" data-lesson="${lesson.meta.id}">
                  <span class="nav-item-status">${isCompleted ? '✓' : ''}</span>
                  <span class="nav-item-title">${lesson.meta.title}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    });

    this.elements.sidebarNav.innerHTML = html;

    // Add click handlers
    document.querySelectorAll('.nav-section-header').forEach(header => {
      header.addEventListener('click', () => {
        header.parentElement?.classList.toggle('expanded');
      });
    });

    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const lessonId = item.getAttribute('data-lesson');
        if (lessonId) {
          this.navigateToLesson(lessonId);
        }
      });
    });
  }

  private renderModulesGrid(): void {
    if (!this.elements.modulesGrid) return;

    let html = '';
    
    curriculum.modules.forEach(module => {
      const completedInModule = module.lessons.filter(l => 
        this.completedLessons.has(l.meta.id)
      ).length;
      
      html += `
        <div class="module-card" data-module="${module.id}" style="--module-color: ${module.color}">
          <div class="module-header">
            <span class="module-icon">${module.icon}</span>
            <span class="module-number">Module ${String(module.number).padStart(2, '0')}</span>
          </div>
          <h3 class="module-title">${module.title}</h3>
          <p class="module-description">${module.description}</p>
          <div class="module-footer">
            <span class="module-lessons">${module.lessons.length} lessons</span>
            ${completedInModule > 0 ? `<span class="module-progress">${completedInModule}/${module.lessons.length} complete</span>` : ''}
          </div>
        </div>
      `;
    });

    this.elements.modulesGrid.innerHTML = html;

    // Add click handlers
    document.querySelectorAll('.module-card').forEach(card => {
      card.addEventListener('click', () => {
        const moduleId = card.getAttribute('data-module');
        const module = getModule(moduleId || '');
        if (module && module.lessons.length > 0) {
          this.navigateToLesson(module.lessons[0].meta.id);
        }
      });
    });
  }

  private async navigateToLesson(lessonId: string): Promise<void> {
    const result = getLesson(lessonId);
    if (!result) {
      console.error('Lesson not found:', lessonId);
      return;
    }

    const { module, lesson } = result;
    
    this.currentModuleId = module.id;
    this.currentLessonId = lessonId;
    this.currentExerciseIndex = 0;
    this.hintsRevealed = 0;

    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set('lesson', lessonId);
    window.history.pushState({}, '', url.toString());

    // Switch to learning view
    this.elements.landingView?.classList.remove('active');
    this.elements.landingView!.style.display = 'none';
    this.elements.learningView?.classList.add('active');

    // Update breadcrumb
    if (this.elements.breadcrumbModule) {
      this.elements.breadcrumbModule.textContent = module.title;
    }
    if (this.elements.breadcrumbLesson) {
      this.elements.breadcrumbLesson.textContent = lesson.meta.title;
    }

    // Update sidebar active state
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });
    document.querySelector(`.nav-item[data-lesson="${lessonId}"]`)?.classList.add('active');

    // Expand the module section
    document.querySelector(`.nav-section[data-module="${module.id}"]`)?.classList.add('expanded');

    // Render theory content
    this.renderTheory(module, lesson);

    // Initialize editor
    await this.initEditor(lesson);

    // Render exercise panel
    if (lesson.exercises.length > 0) {
      this.renderExercise(lesson.exercises[0]);
    }

    // Update navigation buttons
    this.updateNavigationButtons();

    // Hide preview overlay
    if (this.elements.previewOverlay) {
      this.elements.previewOverlay.style.display = 'flex';
    }
  }

  private renderTheory(module: Module, lesson: Lesson): void {
    if (!this.elements.theoryContent) return;

    const theoryHtml = marked(lesson.theory.markdown);

    this.elements.theoryContent.innerHTML = `
      <div class="lesson-header">
        <div class="lesson-meta">
          <span class="lesson-meta-item">
            <span>⏱</span>
            <span>${lesson.meta.duration} min</span>
          </span>
          <span class="lesson-meta-item">
            <span>📊</span>
            <span>${lesson.meta.difficulty}</span>
          </span>
        </div>
        <h1 class="lesson-title">${lesson.meta.title}</h1>
        <p class="lesson-description">${lesson.meta.description}</p>
      </div>
      <div class="theory-markdown">${theoryHtml}</div>
      ${lesson.theory.references.length > 0 ? `
        <div class="references" style="margin-top: 32px; padding-top: 24px; border-top: 1px solid var(--border-subtle);">
          <h3 style="font-size: 0.9rem; margin-bottom: 12px;">📚 References</h3>
          <ul style="list-style: none; padding: 0;">
            ${lesson.theory.references.map(ref => `
              <li style="margin-bottom: 8px;">
                <a href="${ref.url}" target="_blank" style="color: var(--accent); text-decoration: none; font-size: 0.85rem;">
                  ${ref.title} ↗
                </a>
              </li>
            `).join('')}
          </ul>
        </div>
      ` : ''}
    `;
  }

  private async initEditor(lesson: Lesson): Promise<void> {
    // Destroy existing editor
    if (this.editor) {
      this.editor.destroy();
    }

    // Get container
    const container = this.elements.editorContainer;
    if (!container) return;

    // Create new editor with options
    this.editor = new MonacoEditor({
      container: container as HTMLElement,
      language: 'typescript',
      value: lesson.exercises.length > 0 ? lesson.exercises[0].starterCode : '',
    });
    await this.editor.init();
  }

  private renderExercise(exercise: LessonExercise): void {
    if (this.elements.exerciseTitle) {
      this.elements.exerciseTitle.textContent = exercise.title;
    }
    if (this.elements.exerciseDescription) {
      this.elements.exerciseDescription.textContent = exercise.description;
    }

    // Reset hints
    this.hintsRevealed = 0;
    if (this.elements.hintsContainer) {
      this.elements.hintsContainer.classList.remove('visible');
      this.elements.hintsContainer.innerHTML = '';
    }
  }

  private toggleHints(): void {
    const result = getLesson(this.currentLessonId || '');
    if (!result) return;

    const exercise = result.lesson.exercises[this.currentExerciseIndex];
    if (!exercise) return;

    if (this.elements.hintsContainer) {
      this.elements.hintsContainer.classList.toggle('visible');
      
      if (this.elements.hintsContainer.classList.contains('visible')) {
        // Reveal one more hint
        this.hintsRevealed = Math.min(this.hintsRevealed + 1, exercise.hints.length);
        
        this.elements.hintsContainer.innerHTML = exercise.hints
          .slice(0, this.hintsRevealed)
          .map((hint, i) => `<div class="hint-item">💡 Hint ${i + 1}: ${hint}</div>`)
          .join('');
      }
    }
  }

  private async runCode(): Promise<void> {
    const code = this.editor?.getCode() || '';
    
    // Hide overlay
    if (this.elements.previewOverlay) {
      this.elements.previewOverlay.style.display = 'none';
    }

    // Initialize sandbox if needed
    if (!this.sandbox) {
      const container = this.elements.previewContainer;
      if (container) {
        this.sandbox = new Sandbox({
          container: container as HTMLElement,
          onLog: (msg) => console.log('[Sandbox]', msg),
          onError: (err) => console.error('[Sandbox Error]', err),
        });
      }
    }

    // Execute code
    if (this.sandbox) {
      try {
        await this.sandbox.execute(code);
      } catch (error) {
        console.error('Execution error:', error);
      }
    }
  }

  private resetCode(): void {
    const result = getLesson(this.currentLessonId || '');
    if (!result) return;

    const exercise = result.lesson.exercises[this.currentExerciseIndex];
    if (exercise && this.editor) {
      this.editor.setCode(exercise.starterCode);
    }
  }

  private showSolution(): void {
    const result = getLesson(this.currentLessonId || '');
    if (!result) return;

    const exercise = result.lesson.exercises[this.currentExerciseIndex];
    if (exercise && this.editor) {
      // Show confirmation
      if (confirm('Are you sure you want to see the solution? Try the hints first!')) {
        this.editor.setCode(exercise.solutionCode);
      }
    }
  }

  private navigateToPreviousLesson(): void {
    if (!this.currentLessonId) return;
    
    const prev = getPreviousLesson(this.currentLessonId);
    if (prev) {
      this.navigateToLesson(prev.lesson.meta.id);
    }
  }

  private navigateToNextLesson(): void {
    if (!this.currentLessonId) return;
    
    const next = getNextLesson(this.currentLessonId);
    if (next) {
      this.navigateToLesson(next.lesson.meta.id);
    }
  }

  private async markLessonComplete(): Promise<void> {
    if (!this.currentLessonId) return;

    // Add to completed set
    this.completedLessons.add(this.currentLessonId);

    // Update UI
    this.updateProgressUI();
    this.renderSidebar();
    this.renderModulesGrid();

    // Save to API
    try {
      await api.completeLesson(this.currentLessonId);
      
      // Check for new achievements
      const newAchievements = await api.checkAchievements();
      if (newAchievements.length > 0) {
        this.showAchievement(newAchievements[0]);
      }
    } catch (error) {
      console.error('Failed to save progress:', error);
    }

    // Show success feedback
    const btn = this.elements.completeBtn;
    if (btn) {
      btn.textContent = '✓ Completed!';
      btn.classList.add('primary');
      setTimeout(() => {
        btn.textContent = 'Mark Complete';
        btn.classList.remove('primary');
      }, 2000);
    }
  }

  private updateProgressUI(): void {
    const stats = getCurriculumStats();
    const completed = this.completedLessons.size;
    const percentage = Math.round((completed / stats.totalLessons) * 100);

    if (this.elements.totalProgress) {
      (this.elements.totalProgress as HTMLElement).style.width = `${percentage}%`;
    }
    if (this.elements.completedCount) {
      this.elements.completedCount.textContent = String(completed);
    }
  }

  private updateNavigationButtons(): void {
    if (!this.currentLessonId) return;

    const prev = getPreviousLesson(this.currentLessonId);
    const next = getNextLesson(this.currentLessonId);

    if (this.elements.prevLessonBtn) {
      (this.elements.prevLessonBtn as HTMLButtonElement).disabled = !prev;
    }
    if (this.elements.nextLessonBtn) {
      (this.elements.nextLessonBtn as HTMLButtonElement).disabled = !next;
    }
  }

  private showAchievement(achievement: { name: string; description: string; icon: string }): void {
    if (this.elements.achievementTitle) {
      this.elements.achievementTitle.textContent = achievement.name;
    }
    if (this.elements.achievementDescription) {
      this.elements.achievementDescription.textContent = achievement.description;
    }
    
    const icon = document.querySelector('.achievement-icon');
    if (icon) {
      icon.textContent = achievement.icon;
    }

    this.elements.achievementToast?.classList.add('visible');

    setTimeout(() => {
      this.elements.achievementToast?.classList.remove('visible');
    }, 5000);
  }

  private async saveProgress(): Promise<void> {
    if (!this.currentLessonId || !this.editor) return;

    try {
      await api.updateProgress(this.currentLessonId, {
        currentCode: this.editor.getCode(),
        status: 'IN_PROGRESS'
      });
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  }

  // Public method to go back to landing
  public goToLanding(): void {
    this.elements.learningView?.classList.remove('active');
    this.elements.landingView!.style.display = 'block';
    
    // Clear URL parameter
    const url = new URL(window.location.href);
    url.searchParams.delete('lesson');
    window.history.pushState({}, '', url.toString());

    this.currentModuleId = null;
    this.currentLessonId = null;
  }

  /**
   * Public initialization method
   */
  public async init(): Promise<boolean> {
    try {
      await this.initApp();
      return true;
    } catch (error) {
      console.error('Failed to initialize app:', error);
      return false;
    }
  }

  /**
   * Load a lesson by module and lesson slug
   */
  public loadLessonBySlug(moduleSlug: string, lessonSlug: string): void {
    const lessonId = `${moduleSlug}/${lessonSlug}`;
    this.navigateToLesson(lessonId);
  }
}

export { LearningApp };
