/**
 * Galactic Gourmet - Space + Food Portfolio Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  generateStars();
  initNavigation();
  initScrollEffects();
  initFormHandling();
  initFoodParticles();
});

// Generate stars background
function generateStars() {
  const spaceBg = document.getElementById('spaceBg');
  if (!spaceBg) return;

  const starCount = 150;

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.className = 'star';

    const size = Math.random() * 2 + 1;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const delay = Math.random() * 3;
    const duration = Math.random() * 3 + 2;

    star.style.cssText = `
      left: ${x}%;
      top: ${y}%;
      width: ${size}px;
      height: ${size}px;
      animation-delay: ${delay}s;
      animation-duration: ${duration}s;
    `;

    spaceBg.appendChild(star);
  }

  // Generate footer stars
  const footerStars = document.getElementById('footerStars');
  if (footerStars) {
    for (let i = 0; i < 30; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        width: ${Math.random() * 2 + 1}px;
        height: ${Math.random() * 2 + 1}px;
        animation-delay: ${Math.random() * 3}s;
      `;
      footerStars.appendChild(star);
    }
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
  const cards = document.querySelectorAll('.recipe-card, .menu-category, .philosophy-item');

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 100);
      }
    });
  }, observerOptions);

  // Initial styles
  [...sections, ...cards].forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // Parallax for hero dish
  const heroDish = document.querySelector('.hero-dish');
  window.addEventListener('scroll', () => {
    if (heroDish && window.scrollY < window.innerHeight) {
      heroDish.style.transform = `translateY(${window.scrollY * 0.2}px)`;
    }
  });
}

// Form handling
function initFormHandling() {
  const form = document.getElementById('reserveForm');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.querySelector('span').textContent;

      submitBtn.disabled = true;
      submitBtn.querySelector('span').textContent = 'Sending...';

      // Add sparkle effect
      createSparkles(submitBtn);

      setTimeout(() => {
        submitBtn.querySelector('span').textContent = 'Reservation Confirmed!';
        submitBtn.style.background = 'linear-gradient(135deg, #27c93f 0%, #1fa32e 100%)';

        setTimeout(() => {
          form.reset();
          submitBtn.disabled = false;
          submitBtn.querySelector('span').textContent = originalText;
          submitBtn.style.background = '';
        }, 2000);
      }, 1500);
    });
  }
}

// Create sparkle effect
function createSparkles(element) {
  const rect = element.getBoundingClientRect();
  const sparkleCount = 10;

  for (let i = 0; i < sparkleCount; i++) {
    const sparkle = document.createElement('div');
    sparkle.style.cssText = `
      position: fixed;
      width: 10px;
      height: 10px;
      background: #d4af37;
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      left: ${rect.left + rect.width / 2}px;
      top: ${rect.top + rect.height / 2}px;
      animation: sparkle 0.8s ease-out forwards;
    `;
    document.body.appendChild(sparkle);

    // Random direction
    const angle = (Math.PI * 2 * i) / sparkleCount;
    const distance = 50 + Math.random() * 50;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;

    sparkle.animate([
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
    ], {
      duration: 800,
      easing: 'ease-out'
    });

    setTimeout(() => sparkle.remove(), 800);
  }
}

// Food particles floating
function initFoodParticles() {
  const container = document.getElementById('foodParticles');
  if (!container) return;

  const foods = ['🍕', '🍔', '🌮', '🍣', '🥗', '🍜', '🥐', '🧁', '🍰', '🍩'];
  const particleCount = 15;

  for (let i = 0; i < particleCount; i++) {
    setTimeout(() => {
      createFoodParticle(container, foods);
    }, i * 2000);
  }

  // Continuous particle generation
  setInterval(() => {
    if (Math.random() > 0.7) {
      createFoodParticle(container, foods);
    }
  }, 3000);
}

function createFoodParticle(container, foods) {
  const particle = document.createElement('div');
  const food = foods[Math.floor(Math.random() * foods.length)];

  particle.textContent = food;
  particle.style.cssText = `
    position: fixed;
    font-size: ${Math.random() * 1.5 + 1}rem;
    left: ${Math.random() * 100}vw;
    top: 100vh;
    opacity: 0.3;
    pointer-events: none;
    z-index: -1;
    animation: floatUp ${Math.random() * 10 + 10}s linear forwards;
  `;

  container.appendChild(particle);

  // Remove after animation
  setTimeout(() => particle.remove(), 20000);
}

// Add float up animation
const style = document.createElement('style');
style.textContent = `
  @keyframes floatUp {
    0% {
      transform: translateY(0) rotate(0deg);
      opacity: 0;
    }
    10% {
      opacity: 0.3;
    }
    90% {
      opacity: 0.3;
    }
    100% {
      transform: translateY(-120vh) rotate(360deg);
      opacity: 0;
    }
  }

  @keyframes sparkle {
    0% { transform: scale(1); opacity: 1; }
    100% { transform: scale(0); opacity: 0; }
  }
`;
document.head.appendChild(style);

// Easter egg: Secret recipe
let secretCode = [];
const secretSequence = [67, 72, 69, 70]; // C-H-E-F

document.addEventListener('keydown', (e) => {
  secretCode.push(e.keyCode);
  secretCode = secretCode.slice(-4);

  if (secretCode.join(',') === secretSequence.join(',')) {
    showSecretRecipe();
  }
});

function showSecretRecipe() {
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
    <div style="text-align: center; padding: 40px;">
      <div style="font-size: 4rem; margin-bottom: 20px;">👨‍🍳</div>
      <h2 style="font-family: 'Playfair Display', serif; font-size: 2rem; color: #d4af37; margin-bottom: 16px;">
        Secret Recipe Unlocked!
      </h2>
      <p style="color: #a0a0a0; font-size: 1.1rem; max-width: 400px; margin: 0 auto 24px;">
        "The secret ingredient is always passion. Code with love, cook with care,
        and never stop learning."
      </p>
      <div style="font-size: 2rem;">
        ⭐ 🍳 💻 🚀 ⭐
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Add fadeIn animation
  const fadeStyle = document.createElement('style');
  fadeStyle.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `;
  document.head.appendChild(fadeStyle);

  // Close on click
  overlay.addEventListener('click', () => {
    overlay.style.animation = 'fadeOut 0.5s ease forwards';
    setTimeout(() => {
      overlay.remove();
      fadeStyle.remove();
    }, 500);
  });

  // Add fadeOut
  fadeStyle.textContent += `
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `;
}

// Console message
console.log('%c🌟 Galactic Gourmet', 'font-size: 24px; font-weight: bold; color: #d4af37;');
console.log('%c"Where code meets cuisine"', 'font-size: 14px; color: #a0a0a0; font-style: italic;');
console.log('%cType "CHEF" to unlock a secret recipe...', 'font-size: 12px; color: #722f37;');
