import { Component, For } from 'solid-js';
import Button from './Button';

const Hero: Component = () => {
  const floatingFoods = [
    { emoji: '\uD83C\uDF54', top: '15%', left: '10%', delay: '0s' },
    { emoji: '\uD83C\uDF55', top: '25%', right: '15%', delay: '1s' },
    { emoji: '\uD83C\uDF63', top: '60%', left: '5%', delay: '2s' },
    { emoji: '\uD83C\uDF70', top: '70%', right: '10%', delay: '0.5s' },
    { emoji: '\uD83C\uDF77', top: '40%', left: '15%', delay: '1.5s' },
    { emoji: '\uD83E\uDD5B', top: '80%', left: '20%', delay: '2.5s' },
    { emoji: '\uD83C\uDF57', top: '20%', right: '25%', delay: '0.8s' },
    { emoji: '\uD83E\uDDC1', top: '55%', right: '20%', delay: '1.8s' },
  ];

  const orbitingDishes = [
    { emoji: '\uD83C\uDF73', size: 'text-3xl' },
    { emoji: '\uD83C\uDF5D', size: 'text-2xl' },
    { emoji: '\uD83C\uDF71', size: 'text-3xl' },
    { emoji: '\uD83E\uDD57', size: 'text-2xl' },
  ];

  return (
    <section class="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Background Stars */}
      <div class="absolute inset-0 overflow-hidden">
        <For each={Array.from({ length: 50 })}>
          {(_, i) => (
            <div
              class="absolute w-1 h-1 bg-gold rounded-full animate-twinkle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                'animation-delay': `${Math.random() * 3}s`,
                opacity: Math.random() * 0.5 + 0.2,
              }}
            />
          )}
        </For>
      </div>

      {/* Floating Food Emojis */}
      <For each={floatingFoods}>
        {(food) => (
          <div
            class="floating-food animate-float"
            style={{
              top: food.top,
              left: food.left,
              right: food.right,
              'animation-delay': food.delay,
            }}
          >
            {food.emoji}
          </div>
        )}
      </For>

      {/* Main Content */}
      <div class="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Orbital Ring with Dishes */}
        <div class="relative w-80 h-80 md:w-96 md:h-96 mx-auto mb-8">
          {/* Center Content */}
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="text-center">
              <div class="text-7xl md:text-8xl mb-4 animate-pulse-gold">
                \uD83D\uDC68\u200D\uD83C\uDF73
              </div>
              <div class="w-24 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto" />
            </div>
          </div>

          {/* Orbit Path */}
          <div class="absolute inset-0 border-2 border-gold/20 rounded-full" />
          <div class="absolute inset-4 border border-gold/10 rounded-full" />
          <div class="absolute inset-8 border border-dashed border-gold/10 rounded-full" />

          {/* Orbiting Dishes */}
          <div class="absolute inset-0 animate-orbit">
            <For each={orbitingDishes}>
              {(dish, i) => (
                <div
                  class={`absolute ${dish.size}`}
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `rotate(${i() * 90}deg) translateX(150px) rotate(-${i() * 90}deg)`,
                  }}
                >
                  {dish.emoji}
                </div>
              )}
            </For>
          </div>

          {/* Reverse Orbit */}
          <div class="absolute inset-12 animate-orbit-reverse opacity-50">
            <div class="absolute text-xl" style={{ top: '0', left: '50%', transform: 'translateX(-50%)' }}>
              \u2B50
            </div>
            <div class="absolute text-xl" style={{ bottom: '0', left: '50%', transform: 'translateX(-50%)' }}>
              \u2B50
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 class="font-serif text-5xl md:text-7xl font-bold mb-6">
          <span class="text-gradient-gold">Galactic</span>
          <br />
          <span class="text-cream">Gourmet</span>
        </h1>

        {/* Subtitle */}
        <p class="text-cream/70 text-lg md:text-xl font-light tracking-wide mb-4 max-w-2xl mx-auto">
          Where Code Meets Cuisine in the Cosmic Kitchen
        </p>
        <p class="text-cream/50 text-base mb-8 font-serif italic">
          "Crafting stellar digital experiences with the precision of a master chef"
        </p>

        {/* CTA Buttons */}
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="primary" size="lg">
            <span>\uD83C\uDF7D\uFE0F</span>
            <span>View The Menu</span>
          </Button>
          <Button variant="outline" size="lg">
            <span>\uD83D\uDCE7</span>
            <span>Make a Reservation</span>
          </Button>
        </div>

        {/* Scroll Indicator */}
        <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div class="flex flex-col items-center gap-2 text-gold/60">
            <span class="text-xs uppercase tracking-widest">Scroll</span>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Decorative Corner Elements */}
      <div class="absolute top-24 left-8 text-gold/20 text-6xl font-serif">"</div>
      <div class="absolute bottom-24 right-8 text-gold/20 text-6xl font-serif rotate-180">"</div>
    </section>
  );
};

export default Hero;
