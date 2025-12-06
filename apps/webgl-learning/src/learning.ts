/**
 * Three.js Academy - Learning Platform Entry Point
 * This file initializes the learning platform with curriculum navigation
 */

import { LearningApp } from './app';

// Initialize the learning platform when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  const app = new LearningApp();
  
  // Initialize the app
  const initialized = await app.init();
  
  if (!initialized) {
    console.error('Failed to initialize learning platform');
    showError('Failed to initialize the learning platform. Please refresh the page.');
    return;
  }
  
  console.log('🎓 Three.js Academy initialized successfully');
  
  // Handle route changes for direct lesson links
  handleRouting(app);
  
  // Listen for popstate events (browser back/forward)
  window.addEventListener('popstate', () => handleRouting(app));
});

/**
 * Handle URL routing to lessons
 */
function handleRouting(app: LearningApp): void {
  const hash = window.location.hash.slice(1); // Remove the #
  
  if (hash) {
    // Parse the hash: format is moduleId/lessonId
    const parts = hash.split('/');
    if (parts.length >= 2) {
      const moduleId = parts[0];
      const lessonId = parts[1];
      
      // Try to load the lesson
      app.loadLessonBySlug(moduleId, lessonId);
    }
  }
}

/**
 * Show an error message to the user
 */
function showError(message: string): void {
  const container = document.querySelector('.curriculum-section') || document.body;
  
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.innerHTML = `
    <div style="
      background: rgba(255, 77, 0, 0.1);
      border: 1px solid #FF4D00;
      border-radius: 8px;
      padding: 20px;
      margin: 20px;
      color: #FF4D00;
      text-align: center;
    ">
      <h3 style="margin-bottom: 10px;">⚠️ Error</h3>
      <p>${message}</p>
      <button onclick="window.location.reload()" style="
        margin-top: 15px;
        padding: 10px 20px;
        background: #FF4D00;
        border: none;
        border-radius: 4px;
        color: white;
        cursor: pointer;
      ">Refresh Page</button>
    </div>
  `;
  
  container.appendChild(errorDiv);
}

// Export for debugging
(window as any).LearningApp = LearningApp;
