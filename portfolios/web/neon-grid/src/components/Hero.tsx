import { Component, createSignal, onMount, For } from 'solid-js';
import Button from './Button';
import HoloDisplay from './HoloDisplay';

const Hero: Component = () => {
  const [counts, setCounts] = createSignal({ projects: 0, years: 0, clients: 0 });

  const stats = [
    { label: 'PROJECTS', target: 50, key: 'projects' },
    { label: 'YEARS EXP', target: 5, key: 'years' },
    { label: 'CLIENTS', target: 100, key: 'clients' },
  ];

  onMount(() => {
    // Animate counters
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setCounts({
        projects: Math.floor(50 * progress),
        years: Math.floor(5 * progress),
        clients: Math.floor(100 * progress),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);
  });

  return (
    <section class="min-h-screen flex items-center pt-20 relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        {/* Content */}
        <div class="text-center lg:text-left z-10">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded bg-neon-cyan/10 border border-neon-cyan/30 mb-6">
            <span class="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
            <span class="text-sm text-neon-cyan font-mono">SYSTEM ONLINE</span>
          </div>

          <h1 class="font-display text-5xl md:text-6xl lg:text-7xl font-black mb-6">
            <span class="block text-sm md:text-base text-neon-cyan tracking-[0.3em] mb-4 glitch" data-text="FULL-STACK">
              FULL-STACK
            </span>
            <span class="bg-gradient-to-r from-white to-neon-cyan bg-clip-text text-transparent">
              DEVELOPER
            </span>
          </h1>

          <div class="font-mono text-gray-400 mb-8 space-y-1">
            <p>&gt; Initializing neural interface...</p>
            <p>&gt; Loading skill modules...</p>
            <p>&gt; Ready to build the future<span class="animate-pulse">_</span></p>
          </div>

          {/* Stats */}
          <div class="flex gap-8 mb-8 justify-center lg:justify-start">
            <For each={stats}>
              {(stat) => (
                <div class="text-center">
                  <span class="block font-display text-3xl font-bold text-neon">
                    {counts()[stat.key as keyof typeof counts.arguments]}+
                  </span>
                  <span class="text-xs text-gray-500">{stat.label}</span>
                </div>
              )}
            </For>
          </div>

          <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button href="#projects" variant="primary">VIEW PROJECTS ▶</Button>
            <Button href="#contact" variant="secondary">CONNECT</Button>
          </div>
        </div>

        {/* Visual */}
        <div class="flex items-center justify-center">
          <HoloDisplay />
        </div>
      </div>
    </section>
  );
};

export default Hero;
