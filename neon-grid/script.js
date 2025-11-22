/**
 * NeonGrid - Cyberpunk Portfolio Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  initNavigation();
  initCounters();
  initSkillBars();
  initScrollReveal();
  initGlitchEffects();
  initFormHandling();
  initTypingEffect();
});

// Navigation
function initNavigation() {
  const nav = document.querySelector('.nav');
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
    });

    // Close on link click
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        navToggle.classList.remove('active');
      });
    });
  }

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// Counter animation
function initCounters() {
  const counters = document.querySelectorAll('.stat-value[data-count]');

  const animateCounter = (counter) => {
    const target = parseInt(counter.dataset.count);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += step;
      if (current < target) {
        counter.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target + '+';
      }
    };

    updateCounter();
  };

  // Intersection observer for counters
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

// Skill bars animation
function initSkillBars() {
  const skillModules = document.querySelectorAll('.skill-module');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progress = entry.target.querySelector('.module-progress');
        if (progress) {
          progress.style.width = progress.style.getPropertyValue('--progress');
        }
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.2 });

  skillModules.forEach(module => {
    const progress = module.querySelector('.module-progress');
    if (progress) {
      progress.style.width = '0';
    }
    observer.observe(module);
  });
}

// Scroll reveal animations
function initScrollReveal() {
  const sections = document.querySelectorAll('.section');
  const cards = document.querySelectorAll('.project-card, .info-card');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 100);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  // Initial styles
  [...sections, ...cards].forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(el);
  });
}

// Glitch effects
function initGlitchEffects() {
  const glitchText = document.querySelector('.glitch-text');

  if (glitchText) {
    // Random glitch intensity
    setInterval(() => {
      if (Math.random() > 0.95) {
        glitchText.style.animation = 'none';
        glitchText.offsetHeight; // Trigger reflow
        glitchText.style.animation = null;
      }
    }, 100);
  }

  // Mouse trail effect (optional)
  let mouseTrail = [];
  const maxTrailLength = 10;

  document.addEventListener('mousemove', (e) => {
    mouseTrail.push({ x: e.clientX, y: e.clientY, time: Date.now() });

    if (mouseTrail.length > maxTrailLength) {
      mouseTrail.shift();
    }
  });
}

// Form handling
function initFormHandling() {
  const form = document.getElementById('contactForm');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Get form data
      const formData = new FormData(form);

      // Simulate submission
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.querySelector('.btn-text').textContent;

      submitBtn.disabled = true;
      submitBtn.querySelector('.btn-text').textContent = 'TRANSMITTING...';

      // Simulate API call
      setTimeout(() => {
        submitBtn.querySelector('.btn-text').textContent = 'TRANSMISSION COMPLETE';
        submitBtn.style.background = 'linear-gradient(135deg, #27c93f, #00ff88)';

        // Reset after delay
        setTimeout(() => {
          form.reset();
          submitBtn.disabled = false;
          submitBtn.querySelector('.btn-text').textContent = originalText;
          submitBtn.style.background = '';
        }, 2000);
      }, 1500);
    });

    // Input focus effects
    const inputs = form.querySelectorAll('.form-input');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
      });

      input.addEventListener('blur', () => {
        input.parentElement.classList.remove('focused');
      });
    });
  }
}

// Typing effect
function initTypingEffect() {
  const typingElement = document.querySelector('.typing-text');

  if (typingElement) {
    const text = typingElement.innerHTML;
    typingElement.innerHTML = '';

    let index = 0;
    const speed = 30;

    function type() {
      if (index < text.length) {
        // Handle HTML tags
        if (text.charAt(index) === '<') {
          const closingIndex = text.indexOf('>', index);
          typingElement.innerHTML += text.substring(index, closingIndex + 1);
          index = closingIndex + 1;
        } else {
          typingElement.innerHTML += text.charAt(index);
          index++;
        }
        setTimeout(type, speed);
      }
    }

    // Start typing after a delay
    setTimeout(type, 500);
  }
}

// Matrix rain effect for project cards
function createMatrixRain(container) {
  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789';
  const columns = Math.floor(container.offsetWidth / 20);

  for (let i = 0; i < columns; i++) {
    const drop = document.createElement('div');
    drop.className = 'matrix-drop';
    drop.style.left = `${i * 20}px`;
    drop.style.animationDelay = `${Math.random() * 2}s`;
    drop.textContent = chars[Math.floor(Math.random() * chars.length)];
    container.appendChild(drop);
  }
}

// Random glitch on title (Easter egg)
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

document.addEventListener('keydown', (e) => {
  konamiCode.push(e.keyCode);
  konamiCode = konamiCode.slice(-10);

  if (konamiCode.join(',') === konamiSequence.join(',')) {
    activateHackerMode();
  }
});

function activateHackerMode() {
  document.body.style.filter = 'hue-rotate(180deg)';

  // Create random glitch elements
  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      createGlitchBlock();
    }, i * 100);
  }

  setTimeout(() => {
    document.body.style.filter = '';
    document.querySelectorAll('.hacker-glitch').forEach(el => el.remove());
  }, 3000);
}

function createGlitchBlock() {
  const block = document.createElement('div');
  block.className = 'hacker-glitch';
  block.style.cssText = `
    position: fixed;
    top: ${Math.random() * 100}vh;
    left: ${Math.random() * 100}vw;
    width: ${Math.random() * 200 + 50}px;
    height: ${Math.random() * 20 + 5}px;
    background: ${Math.random() > 0.5 ? '#00fff9' : '#ff00ff'};
    opacity: ${Math.random() * 0.5 + 0.2};
    z-index: 10000;
    pointer-events: none;
    mix-blend-mode: screen;
  `;
  document.body.appendChild(block);

  setTimeout(() => block.remove(), 200);
}

// Parallax effect for hero visual
window.addEventListener('scroll', () => {
  const holoDisplay = document.querySelector('.holo-display');
  const scrolled = window.scrollY;

  if (holoDisplay && scrolled < window.innerHeight) {
    holoDisplay.style.transform = `translateY(${scrolled * 0.2}px) rotate(${scrolled * 0.05}deg)`;
  }
});

// Cursor glow effect
const cursorGlow = document.createElement('div');
cursorGlow.className = 'cursor-glow';
cursorGlow.style.cssText = `
  position: fixed;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(0, 255, 249, 0.15) 0%, transparent 70%);
  pointer-events: none;
  z-index: -1;
  transform: translate(-50%, -50%);
  transition: opacity 0.3s;
`;
document.body.appendChild(cursorGlow);

document.addEventListener('mousemove', (e) => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top = e.clientY + 'px';
});

// Console easter egg
console.log('%c[NEONGRID SYSTEM]', 'color: #00fff9; font-size: 20px; font-weight: bold;');
console.log('%c> Connection established', 'color: #27c93f;');
console.log('%c> All systems operational', 'color: #27c93f;');
console.log('%c> Try the Konami code for a surprise...', 'color: #ff00ff;');
