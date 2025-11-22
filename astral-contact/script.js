/**
 * AstralContact - Alien Portfolio Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  generateParticles();
  generateCropCircles();
  initNavigation();
  initScrollEffects();
  initSkillBars();
  initFormHandling();
  initAlienEffects();
});

// Generate floating particles
function generateParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const particleCount = 50;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    const size = Math.random() * 3 + 1;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const delay = Math.random() * 5;
    const duration = Math.random() * 10 + 5;

    particle.style.cssText = `
      left: ${x}%;
      top: ${y}%;
      width: ${size}px;
      height: ${size}px;
      animation-delay: ${delay}s;
      animation-duration: ${duration}s;
    `;

    container.appendChild(particle);
  }
}

// Generate crop circles background
function generateCropCircles() {
  const container = document.getElementById('cropCircles');
  if (!container) return;

  const circleCount = 8;

  for (let i = 0; i < circleCount; i++) {
    const circle = document.createElement('div');
    circle.className = 'crop-circle';

    const size = Math.random() * 300 + 100;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const delay = Math.random() * 5;

    circle.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x}%;
      top: ${y}%;
      animation-delay: ${delay}s;
    `;

    container.appendChild(circle);
  }
}

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

// Scroll reveal effects
function initScrollEffects() {
  const sections = document.querySelectorAll('.section');
  const cards = document.querySelectorAll('.artifact-card, .signal-card, .data-block');

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

// Skill bars animation
function initSkillBars() {
  const strengthBars = document.querySelectorAll('.strength-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        bar.style.width = bar.style.getPropertyValue('--strength');
      }
    });
  }, { threshold: 0.5 });

  strengthBars.forEach(bar => {
    bar.style.width = '0';
    observer.observe(bar);
  });
}

// Form handling
function initFormHandling() {
  const form = document.getElementById('contactForm');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.querySelector('.btn-text').textContent;

      submitBtn.disabled = true;
      submitBtn.querySelector('.btn-text').textContent = 'TRANSMITTING...';

      // Add transmission effect
      submitBtn.style.boxShadow = '0 0 50px rgba(57, 255, 20, 0.8)';

      setTimeout(() => {
        submitBtn.querySelector('.btn-text').textContent = 'TRANSMISSION RECEIVED';
        submitBtn.style.background = 'rgba(57, 255, 20, 0.2)';
        submitBtn.style.borderColor = '#27c93f';

        setTimeout(() => {
          form.reset();
          submitBtn.disabled = false;
          submitBtn.querySelector('.btn-text').textContent = originalText;
          submitBtn.style.background = '';
          submitBtn.style.borderColor = '';
          submitBtn.style.boxShadow = '';
        }, 2000);
      }, 2000);
    });
  }
}

// Alien effects
function initAlienEffects() {
  // UFO follows mouse in hero section
  const ufo = document.getElementById('ufo');
  const hero = document.querySelector('.hero');

  if (ufo && hero) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 50;

      ufo.style.left = `${x * 0.3}%`;
      ufo.style.top = `${y * 0.3 + 10}%`;
    });
  }

  // Parallax effect for planet
  window.addEventListener('scroll', () => {
    const planet = document.querySelector('.planet');
    const rings = document.querySelector('.rings');
    const scrolled = window.scrollY;

    if (planet) {
      planet.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
    if (rings) {
      rings.style.transform = `rotateX(70deg) translateX(50px) rotateZ(${scrolled * 0.1}deg)`;
    }
  });

  // Random signal interference
  setInterval(() => {
    if (Math.random() > 0.95) {
      createInterference();
    }
  }, 2000);

  // Footer stars
  generateFooterStars();
}

// Create interference effect
function createInterference() {
  const interference = document.createElement('div');
  interference.style.cssText = `
    position: fixed;
    top: ${Math.random() * 100}vh;
    left: 0;
    width: 100%;
    height: ${Math.random() * 5 + 2}px;
    background: linear-gradient(90deg, transparent, rgba(57, 255, 20, 0.3), transparent);
    pointer-events: none;
    z-index: 9999;
    animation: interferenceSlide 0.3s ease-out forwards;
  `;

  document.body.appendChild(interference);

  setTimeout(() => interference.remove(), 300);
}

// Generate footer stars
function generateFooterStars() {
  const container = document.getElementById('footerStars');
  if (!container) return;

  for (let i = 0; i < 30; i++) {
    const star = document.createElement('div');
    star.style.cssText = `
      position: absolute;
      width: ${Math.random() * 2 + 1}px;
      height: ${Math.random() * 2 + 1}px;
      background: #fff;
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      opacity: ${Math.random() * 0.5 + 0.3};
      animation: twinkle ${Math.random() * 3 + 2}s infinite;
    `;
    container.appendChild(star);
  }
}

// Easter egg: Alien message
let alienCode = [];
const alienSequence = [65, 76, 73, 69, 78]; // A-L-I-E-N

document.addEventListener('keydown', (e) => {
  alienCode.push(e.keyCode);
  alienCode = alienCode.slice(-5);

  if (alienCode.join(',') === alienSequence.join(',')) {
    activateAlienMode();
  }
});

function activateAlienMode() {
  // Create alien message overlay
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(10, 10, 18, 0.95);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: fadeIn 0.5s ease;
  `;

  overlay.innerHTML = `
    <div style="font-family: 'Audiowide', cursive; font-size: 2rem; color: #39ff14; text-align: center; animation: glowPulse 1s infinite;">
      &#9788; GREETINGS, EARTHLING &#9788;
    </div>
    <div style="margin-top: 20px; color: #8892b0; font-size: 1rem; text-align: center;">
      You have discovered the secret transmission.<br>
      The truth is out there... in the code.
    </div>
    <div style="margin-top: 40px; font-size: 3rem;">
      &#128125;
    </div>
  `;

  document.body.appendChild(overlay);

  // Add glow animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes glowPulse {
      0%, 100% { text-shadow: 0 0 20px #39ff14; }
      50% { text-shadow: 0 0 50px #39ff14, 0 0 100px #39ff14; }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes interferenceSlide {
      from { transform: translateX(-100%); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  // Close on click
  overlay.addEventListener('click', () => {
    overlay.style.animation = 'fadeOut 0.5s ease forwards';
    setTimeout(() => {
      overlay.remove();
      style.remove();
    }, 500);
  });

  // Add fadeOut animation
  const fadeOutStyle = document.createElement('style');
  fadeOutStyle.textContent = `
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `;
  document.head.appendChild(fadeOutStyle);
}

// Console message
console.log('%c&#9788; ASTRAL CONTACT ESTABLISHED', 'color: #39ff14; font-size: 16px; font-weight: bold;');
console.log('%c> Scanning for life forms...', 'color: #8892b0;');
console.log('%c> Life form detected!', 'color: #27c93f;');
console.log('%c> Type "ALIEN" to receive a special transmission...', 'color: #9d4edd;');
