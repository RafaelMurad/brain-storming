/**
 * Nordic Minimal - Scandinavian Portfolio Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollEffects();
  initSkillBars();
  initFormHandling();
  initSmoothReveal();
});

// Navigation
function initNavigation() {
  const nav = document.querySelector('.nav');
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  // Scroll effect
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });

  // Mobile menu toggle
  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Scroll reveal effects
function initScrollEffects() {
  const sections = document.querySelectorAll('.section');

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    section.classList.add('reveal');
    observer.observe(section);
  });
}

// Smooth reveal animation
function initSmoothReveal() {
  const elements = document.querySelectorAll('.project-item, .expertise-card, .detail-block, .stat');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// Skill bars animation
function initSkillBars() {
  const levelBars = document.querySelectorAll('.level-bar');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        bar.style.width = bar.style.getPropertyValue('--level');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  levelBars.forEach(bar => {
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
      const originalText = submitBtn.textContent;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      submitBtn.style.opacity = '0.7';

      // Simulate form submission
      setTimeout(() => {
        submitBtn.textContent = 'Message Sent';
        submitBtn.style.background = '#27c93f';

        setTimeout(() => {
          form.reset();
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
          submitBtn.style.opacity = '1';
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

// Add reveal styles dynamically
const style = document.createElement('style');
style.textContent = `
  .reveal {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.8s ease, transform 0.8s ease;
  }

  .reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .nav-toggle.active span:first-child {
    transform: rotate(45deg) translate(5px, 5px);
  }

  .nav-toggle.active span:last-child {
    transform: rotate(-45deg) translate(5px, -5px);
  }
`;
document.head.appendChild(style);

// Cursor effect (subtle)
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
cursor.style.cssText = `
  position: fixed;
  width: 8px;
  height: 8px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transition: transform 0.1s ease;
  mix-blend-mode: difference;
`;
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX - 4 + 'px';
  cursor.style.top = e.clientY - 4 + 'px';
});

// Hover effect on interactive elements
document.querySelectorAll('a, button, .project-item').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'scale(3)';
    cursor.style.background = 'rgba(0, 102, 255, 0.2)';
  });

  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'scale(1)';
    cursor.style.background = 'rgba(0, 0, 0, 0.1)';
  });
});

// Console message
console.log('%cNordic Minimal', 'font-size: 24px; font-weight: bold; color: #0a0a0a;');
console.log('%cSimplicity is the ultimate sophistication.', 'font-size: 12px; color: #6a6a6a; font-style: italic;');
