/**
 * CelebrateKit - Embeddable Celebration Widget
 * Add confetti, achievements, and joy to any web app!
 *
 * Usage:
 * <script src="https://your-api/widget/celebratekit.js"></script>
 * <script>
 *   CelebrateKit.init({ appId: 'your-app-id' });
 *   CelebrateKit.confetti();
 * </script>
 */

(function (window) {
  'use strict';

  const API_BASE = window.CELEBRATEKIT_API || 'http://localhost:3004';

  // Default configuration
  const defaultConfig = {
    appId: null,
    userId: null,
    apiBase: API_BASE,
  };

  let config = { ...defaultConfig };
  let canvas = null;
  let ctx = null;
  let particles = [];
  let animationId = null;

  // Particle class
  class Particle {
    constructor(options) {
      this.x = options.x;
      this.y = options.y;
      this.vx = (Math.random() - 0.5) * options.spread * 0.2;
      this.vy = Math.random() * -15 - 5;
      this.gravity = 0.5;
      this.friction = 0.99;
      this.color = options.colors[Math.floor(Math.random() * options.colors.length)];
      this.size = Math.random() * 8 + 4;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 10;
      this.shape = options.shape || 'square';
      this.opacity = 1;
      this.decay = 0.01 + Math.random() * 0.01;
    }

    update() {
      this.vy += this.gravity;
      this.vx *= this.friction;
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotationSpeed;
      this.opacity -= this.decay;
      return this.opacity > 0;
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;

      switch (this.shape) {
        case 'circle':
          ctx.beginPath();
          ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'star':
          this.drawStar(ctx, 0, 0, 5, this.size / 2, this.size / 4);
          break;
        case 'heart':
          this.drawHeart(ctx, 0, 0, this.size);
          break;
        default: // square
          ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
      }

      ctx.restore();
    }

    drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      ctx.beginPath();
      ctx.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
      ctx.fill();
    }

    drawHeart(ctx, x, y, size) {
      const topCurveHeight = size * 0.3;
      ctx.beginPath();
      ctx.moveTo(x, y + topCurveHeight);
      ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
      ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 2, x, y + size);
      ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 2, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
      ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
      ctx.fill();
    }
  }

  // Create canvas
  function createCanvas() {
    if (canvas) return;

    canvas = document.createElement('canvas');
    canvas.id = 'celebratekit-canvas';
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 999999;
    `;
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  }

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // Animation loop
  function animate() {
    if (!ctx || particles.length === 0) {
      cancelAnimationFrame(animationId);
      animationId = null;
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter(p => p.update());
    particles.forEach(p => p.draw(ctx));
    animationId = requestAnimationFrame(animate);
  }

  // Spawn particles
  function spawnParticles(options) {
    createCanvas();

    const x = (options.origin?.x || 0.5) * canvas.width;
    const y = (options.origin?.y || 0.5) * canvas.height;
    const count = options.particleCount || 150;

    const shapeMap = {
      confetti: 'square',
      stars: 'star',
      hearts: 'heart',
      fireworks: 'circle',
      coins: 'circle',
    };

    for (let i = 0; i < count; i++) {
      particles.push(
        new Particle({
          x,
          y,
          spread: options.spread || 70,
          colors: options.colors || ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
          shape: shapeMap[options.type] || 'square',
        })
      );
    }

    if (!animationId) {
      animate();
    }

    // Auto cleanup after duration
    if (options.duration) {
      setTimeout(() => {
        particles = [];
      }, options.duration);
    }
  }

  // API call helper
  async function apiCall(endpoint, method = 'GET', body = null) {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(`${config.apiBase}${endpoint}`, options);
    return response.json();
  }

  // Public API
  const CelebrateKit = {
    init(options) {
      config = { ...config, ...options };
      createCanvas();
      console.log('🎉 CelebrateKit initialized');
    },

    // Quick celebration methods
    confetti(options = {}) {
      const celebrationConfig = {
        type: 'confetti',
        duration: 3000,
        particleCount: 150,
        colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'],
        spread: 70,
        origin: { x: 0.5, y: 0.5 },
        ...options,
      };
      spawnParticles(celebrationConfig);
      this.logCelebration('confetti', options);
    },

    fireworks(options = {}) {
      const celebrationConfig = {
        type: 'fireworks',
        duration: 4000,
        particleCount: 200,
        colors: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'],
        spread: 360,
        origin: { x: 0.5, y: 0.9 },
        ...options,
      };
      spawnParticles(celebrationConfig);
      this.logCelebration('fireworks', options);
    },

    stars(options = {}) {
      const celebrationConfig = {
        type: 'stars',
        duration: 3000,
        particleCount: 50,
        colors: ['#FFD700', '#FFA500', '#FF8C00', '#FFEE58'],
        spread: 100,
        origin: { x: 0.5, y: 0.5 },
        ...options,
      };
      spawnParticles(celebrationConfig);
      this.logCelebration('stars', options);
    },

    hearts(options = {}) {
      const celebrationConfig = {
        type: 'hearts',
        duration: 3000,
        particleCount: 30,
        colors: ['#FF6B6B', '#FF8E8E', '#FFB4B4', '#E91E63'],
        spread: 80,
        origin: { x: 0.5, y: 0.7 },
        ...options,
      };
      spawnParticles(celebrationConfig);
      this.logCelebration('hearts', options);
    },

    coins(options = {}) {
      const celebrationConfig = {
        type: 'coins',
        duration: 2500,
        particleCount: 50,
        colors: ['#FFD700', '#FFC107', '#FF9800'],
        spread: 45,
        origin: { x: 0.5, y: 0.3 },
        ...options,
      };
      spawnParticles(celebrationConfig);
      this.logCelebration('coins', options);
    },

    // Trigger by preset name
    async celebrate(preset = 'default', options = {}) {
      try {
        const result = await apiCall('/api/v1/celebrate', 'POST', {
          appId: config.appId,
          userId: config.userId,
          preset,
          ...options,
        });

        if (result.success) {
          spawnParticles(result.data.config);
        }
        return result;
      } catch (error) {
        // Fallback to local celebration if API fails
        this.confetti(options);
        return { success: true, fallback: true };
      }
    },

    // Log celebration to API
    async logCelebration(type, metadata = {}) {
      if (!config.appId) return;

      try {
        await apiCall('/api/v1/celebrate', 'POST', {
          appId: config.appId,
          userId: config.userId,
          config: { type },
          trigger: metadata.trigger,
          metadata,
        });
      } catch (error) {
        // Silent fail for logging
      }
    },

    // Achievement methods
    async unlockAchievement(code) {
      if (!config.appId || !config.userId) {
        console.warn('CelebrateKit: appId and userId required for achievements');
        return null;
      }

      try {
        const result = await apiCall('/api/v1/achievements/unlock', 'POST', {
          appId: config.appId,
          achievementCode: code,
          userId: config.userId,
        });

        if (result.success && !result.data.alreadyUnlocked) {
          // Trigger celebration based on achievement
          this.stars({ particleCount: 100 });
        }

        return result;
      } catch (error) {
        console.error('CelebrateKit: Failed to unlock achievement', error);
        return null;
      }
    },

    async getAchievements() {
      if (!config.appId || !config.userId) return null;

      try {
        return await apiCall(`/api/v1/achievements/${config.appId}/user/${config.userId}`);
      } catch (error) {
        return null;
      }
    },

    // User progress
    async addPoints(points) {
      if (!config.appId || !config.userId) return null;

      try {
        return await apiCall('/api/v1/leaderboard/progress', 'POST', {
          appId: config.appId,
          userId: config.userId,
          addPoints: points,
        });
      } catch (error) {
        return null;
      }
    },

    async getLeaderboard(limit = 10) {
      if (!config.appId) return null;

      try {
        return await apiCall(`/api/v1/leaderboard/${config.appId}?limit=${limit}`);
      } catch (error) {
        return null;
      }
    },

    async getUserStats() {
      if (!config.appId || !config.userId) return null;

      try {
        return await apiCall(`/api/v1/leaderboard/${config.appId}/user/${config.userId}/stats`);
      } catch (error) {
        return null;
      }
    },

    // Utility
    setUser(userId) {
      config.userId = userId;
    },

    clear() {
      particles = [];
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    },
  };

  // Export to window
  window.CelebrateKit = CelebrateKit;

})(window);
