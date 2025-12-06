/**
 * Three.js Academy - API Client
 * Handles all communication with the backend API
 */

export interface User {
  id: string;
  fingerprint?: string;
  name?: string;
  avatar?: string;
  githubId?: string | null;
  githubUsername?: string | null;
  githubAvatar?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Progress {
  id: string;
  lessonId: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  starterCode?: string | null;
  currentCode?: string | null;
  timeSpent: number;
  completedAt?: string | null;
}

export interface LessonNote {
  id: string;
  lessonId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Achievement {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  unlockedAt?: string;
}

export interface ExerciseSubmission {
  id: string;
  lessonId: string;
  code: string;
  passed: boolean;
  feedback?: string | null;
  submittedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';
const TOKEN_KEY = 'threejs_academy_token';

class ApiClient {
  private token: string | null = null;
  private user: User | null = null;
  private initialized = false;

  /**
   * Initialize the API client
   * Checks for existing token or handles OAuth callback
   */
  async init(): Promise<User | null> {
    if (this.initialized) return this.user;

    // Check for OAuth callback token in URL
    const urlParams = new URLSearchParams(window.location.search);
    const callbackToken = urlParams.get('token');
    
    if (callbackToken) {
      // Save the token from OAuth callback
      this.token = callbackToken;
      localStorage.setItem(TOKEN_KEY, callbackToken);
      
      // Clean up URL
      const cleanUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, '', cleanUrl);
    } else {
      // Load saved token
      this.token = localStorage.getItem(TOKEN_KEY);
    }

    // Try to validate existing token
    if (this.token) {
      try {
        const response = await this.request<{ user: User }>('/auth/me');
        if (response.success && response.data) {
          this.user = response.data.user;
          this.initialized = true;
          return this.user;
        }
      } catch {
        // Token invalid, clear it
        this.token = null;
        localStorage.removeItem(TOKEN_KEY);
      }
    }

    // No valid token - user needs to login via GitHub
    this.initialized = true;
    return null;
  }

  /**
   * Logout and clear session
   */
  async logout(): Promise<void> {
    if (this.token) {
      try {
        await this.request('/auth/logout', { method: 'POST' });
      } catch {
        // Ignore errors on logout
      }
    }

    this.token = null;
    this.user = null;
    localStorage.removeItem(TOKEN_KEY);
  }

  /**
   * Start GitHub OAuth login - redirects to GitHub
   */
  loginWithGitHub(): void {
    window.location.href = `${API_BASE_URL}/auth/github`;
  }

  /**
   * Get GitHub auth URL for linking account
   */
  getGitHubAuthUrl(): string {
    return `${API_BASE_URL}/auth/github`;
  }

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    return this.user !== null;
  }

  /**
   * Complete GitHub OAuth flow
   */
  async handleGitHubCallback(code: string): Promise<User> {
    const response = await this.request<{ token: string; user: User }>('/auth/github/callback', {
      method: 'POST',
      body: JSON.stringify({ code })
    });

    if (response.success && response.data) {
      this.token = response.data.token;
      this.user = response.data.user;
      localStorage.setItem(TOKEN_KEY, this.token);
      return this.user;
    }

    throw new Error(response.error || 'GitHub auth failed');
  }

  // ============= Progress API =============

  /**
   * Get all lesson progress
   */
  async getAllProgress(): Promise<Progress[]> {
    const response = await this.request<{ progress: Progress[] }>('/progress');
    return response.data?.progress || [];
  }

  /**
   * Get progress for a specific lesson
   */
  async getLessonProgress(lessonId: string): Promise<Progress | null> {
    const response = await this.request<{ progress: Progress }>(`/progress/${lessonId}`);
    return response.data?.progress || null;
  }

  /**
   * Update lesson progress
   */
  async updateProgress(
    lessonId: string,
    data: { status?: string; currentCode?: string; timeSpent?: number }
  ): Promise<Progress> {
    const response = await this.request<{ progress: Progress }>(`/progress/${lessonId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to update progress');
    }

    return response.data.progress;
  }

  /**
   * Complete a lesson
   */
  async completeLesson(lessonId: string): Promise<Progress> {
    const response = await this.request<{ progress: Progress }>(`/progress/${lessonId}/complete`, {
      method: 'POST'
    });

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to complete lesson');
    }

    return response.data.progress;
  }

  /**
   * Reset lesson progress
   */
  async resetProgress(lessonId: string): Promise<void> {
    await this.request(`/progress/${lessonId}`, { method: 'DELETE' });
  }

  // ============= Notes API =============

  /**
   * Get notes for a lesson
   */
  async getLessonNotes(lessonId: string): Promise<LessonNote[]> {
    const response = await this.request<{ notes: LessonNote[] }>(`/notes/${lessonId}`);
    return response.data?.notes || [];
  }

  /**
   * Save or update a note
   */
  async saveNote(lessonId: string, content: string): Promise<LessonNote> {
    const response = await this.request<{ note: LessonNote }>(`/notes/${lessonId}`, {
      method: 'POST',
      body: JSON.stringify({ content })
    });

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to save note');
    }

    return response.data.note;
  }

  /**
   * Delete a note
   */
  async deleteNote(noteId: string): Promise<void> {
    await this.request(`/notes/note/${noteId}`, { method: 'DELETE' });
  }

  // ============= Achievements API =============

  /**
   * Get all available achievements
   */
  async getAllAchievements(): Promise<Achievement[]> {
    const response = await this.request<{ achievements: Achievement[] }>('/achievements');
    return response.data?.achievements || [];
  }

  /**
   * Get user's unlocked achievements
   */
  async getUnlockedAchievements(): Promise<Achievement[]> {
    const response = await this.request<{ achievements: Achievement[] }>('/achievements/unlocked');
    return response.data?.achievements || [];
  }

  /**
   * Check for new achievements
   */
  async checkAchievements(): Promise<Achievement[]> {
    const response = await this.request<{ newAchievements: Achievement[] }>('/achievements/check', {
      method: 'POST'
    });
    return response.data?.newAchievements || [];
  }

  // ============= Exercise Submissions API =============

  /**
   * Submit exercise solution
   */
  async submitExercise(
    lessonId: string,
    code: string
  ): Promise<{ submission: ExerciseSubmission; passed: boolean; feedback: string }> {
    const response = await this.request<{
      submission: ExerciseSubmission;
      passed: boolean;
      feedback: string;
    }>(`/exercise/${lessonId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ code })
    });

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to submit exercise');
    }

    return response.data;
  }

  /**
   * Get all submissions for a lesson
   */
  async getSubmissions(lessonId: string): Promise<ExerciseSubmission[]> {
    const response = await this.request<{ submissions: ExerciseSubmission[] }>(
      `/exercise/${lessonId}/submissions`
    );
    return response.data?.submissions || [];
  }

  // ============= Stats API =============

  /**
   * Get user stats
   */
  async getStats(): Promise<{
    lessonsCompleted: number;
    totalLessons: number;
    achievementsUnlocked: number;
    totalAchievements: number;
    totalTimeSpent: number;
  }> {
    const response = await this.request<{
      lessonsCompleted: number;
      totalLessons: number;
      achievementsUnlocked: number;
      totalAchievements: number;
      totalTimeSpent: number;
    }>('/progress/stats');

    return (
      response.data || {
        lessonsCompleted: 0,
        totalLessons: 0,
        achievementsUnlocked: 0,
        totalAchievements: 0,
        totalTimeSpent: 0
      }
    );
  }

  // ============= Helper Methods =============

  /**
   * Get current user
   */
  getUser(): User | null {
    return this.user;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.token && !!this.user;
  }

  /**
   * Check if user has GitHub linked
   */
  hasGitHub(): boolean {
    return !!this.user?.githubId;
  }

  /**
   * Make authenticated API request
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>)
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    return response.json();
  }
}

// Export singleton instance
export const api = new ApiClient();
export default api;
