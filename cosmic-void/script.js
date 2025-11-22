/**
 * Cosmic Void - Portfolio Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // Generate stars
  generateStars();

  // Initialize navigation
  initNavigation();

  // Initialize scroll effects
  initScrollEffects();

  // Initialize animations
  initAnimations();

  // Shooting stars
  startShootingStars();
});

// Star generation
function generateStars() {
  const starLayers = [
    { id: 'stars', count: 200, minSize: 1, maxSize: 2 },
    { id: 'stars2', count: 100, minSize: 2, maxSize: 3 },
    { id: 'stars3', count: 50, minSize: 1, maxSize: 2 }
  ];

  starLayers.forEach(layer => {
    const container = document.getElementById(layer.id);
    if (!container) return;

    for (let i = 0; i < layer.count; i++) {
      const star = document.createElement('div');
      star.className = 'star';

      const size = Math.random() * (layer.maxSize - layer.minSize) + layer.minSize;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const opacity = Math.random() * 0.5 + 0.3;
      const duration = Math.random() * 3 + 2;

      star.style.cssText = `
        left: ${x}%;
        top: ${y}%;
        width: ${size}px;
        height: ${size}px;
        --opacity: ${opacity};
        --duration: ${duration}s;
      `;

      container.appendChild(star);
    }
  });
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
  navToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
  });

  // Close mobile menu on link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      navToggle.classList.remove('active');
    });
  });

  // Smooth scroll for nav links
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

// Scroll effects
function initScrollEffects() {
  // Parallax for cosmic background elements
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;

    const nebula = document.querySelector('.nebula');
    const planet1 = document.querySelector('.planet-1');
    const planet2 = document.querySelector('.planet-2');

    if (nebula) nebula.style.transform = `translateY(${scrolled * 0.1}px)`;
    if (planet1) planet1.style.transform = `translateY(${scrolled * 0.05}px)`;
    if (planet2) planet2.style.transform = `translateY(${scrolled * 0.08}px)`;
  });

  // Reveal animations on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');

        // Animate skill bars when visible
        if (entry.target.classList.contains('skills')) {
          animateSkillBars();
        }
      }
    });
  }, observerOptions);

  document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
  });
}

// Animations
function initAnimations() {
  // Hero elements fade in
  const heroElements = document.querySelectorAll('[data-aos]');
  heroElements.forEach((el, index) => {
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, index * 100 + 300);
  });

  // Initial styles for animated elements
  heroElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });
}

// Animate skill bars
function animateSkillBars() {
  const skillBars = document.querySelectorAll('.skill-progress');
  skillBars.forEach(bar => {
    const width = bar.style.width;
    bar.style.width = '0';
    setTimeout(() => {
      bar.style.width = width;
    }, 100);
  });
}

// Shooting stars
function startShootingStars() {
  const container = document.getElementById('shootingStars');
  if (!container) return;

  function createShootingStar() {
    const star = document.createElement('div');
    star.className = 'shooting-star';
    star.style.cssText = `
      top: ${Math.random() * 50}%;
      right: ${Math.random() * 30}%;
    `;
    container.appendChild(star);

    setTimeout(() => {
      star.remove();
    }, 2000);
  }

  // Create shooting stars at random intervals
  setInterval(() => {
    if (Math.random() > 0.7) {
      createShootingStar();
    }
  }, 3000);
}

// Cursor glow effect (optional enhancement)
document.addEventListener('mousemove', (e) => {
  const cursor = document.querySelector('.cursor-glow');
  if (cursor) {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  }
});

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

document.addEventListener('keydown', (e) => {
  konamiCode.push(e.keyCode);
  konamiCode = konamiCode.slice(-10);

  if (konamiCode.join(',') === konamiSequence.join(',')) {
    activateHyperspace();
  }
});

function activateHyperspace() {
  document.body.style.animation = 'hyperspace 2s ease-in-out';

  // Add hyperspace keyframe dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes hyperspace {
      0% { filter: blur(0); }
      50% { filter: blur(20px); transform: scale(1.1); }
      100% { filter: blur(0); }
    }
  `;
  document.head.appendChild(style);

  setTimeout(() => {
    document.body.style.animation = '';
    style.remove();
  }, 2000);
}

console.log('🚀 Cosmic Void Portfolio loaded');
console.log('💡 Tip: Try the Konami code for a surprise!');
