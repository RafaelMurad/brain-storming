import { Component, For, createSignal, onMount } from 'solid-js';
import Button, { LinkButton } from './Button';

const Hero: Component = () => {
  const [signalStrength, setSignalStrength] = createSignal(0);
  const [typewriterText, setTypewriterText] = createSignal('');

  const fullText = 'GREETINGS, EARTHLING';

  onMount(() => {
    // Typewriter effect
    let i = 0;
    const typeInterval = setInterval(() => {
      if (i <= fullText.length) {
        setTypewriterText(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(typeInterval);
      }
    }, 100);

    // Signal strength animation
    const signalInterval = setInterval(() => {
      setSignalStrength(Math.floor(Math.random() * 30) + 70);
    }, 500);

    return () => {
      clearInterval(typeInterval);
      clearInterval(signalInterval);
    };
  });

  return (
    <section class="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* UFO Animation */}
      <div class="absolute top-32 right-10 md:right-20 lg:right-32">
        <div class="animate-ufo-hover">
          <svg
            class="w-24 h-24 md:w-32 md:h-32 text-alien-glow opacity-60"
            viewBox="0 0 100 100"
            fill="none"
          >
            {/* UFO body */}
            <ellipse cx="50" cy="45" rx="40" ry="12" fill="currentColor" opacity="0.3" />
            <ellipse cx="50" cy="40" rx="32" ry="10" fill="currentColor" opacity="0.5" />
            <ellipse cx="50" cy="35" rx="22" ry="8" fill="currentColor" />
            {/* Dome */}
            <path
              d="M35 35 C35 25 42 18 50 18 C58 18 65 25 65 35"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
            />
            {/* Lights */}
            <circle cx="35" cy="42" r="3" fill="currentColor" class="animate-pulse" />
            <circle cx="50" cy="45" r="3" fill="currentColor" class="animate-pulse animate-delay-200" />
            <circle cx="65" cy="42" r="3" fill="currentColor" class="animate-pulse animate-delay-500" />
            {/* Tractor beam */}
            <path
              d="M38 48 L25 90 L75 90 L62 48"
              fill="url(#beamGradient)"
              opacity="0.3"
            />
            <defs>
              <linearGradient id="beamGradient" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stop-color="#39ff14" stop-opacity="0.5" />
                <stop offset="100%" stop-color="#39ff14" stop-opacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Signal rings */}
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <For each={[1, 2, 3]}>
            {(i) => (
              <div
                class="signal-ring"
                style={{
                  width: `${60 + i * 30}px`,
                  height: `${60 + i * 30}px`,
                  "animation-delay": `${i * 0.5}s`,
                  left: `${-(30 + i * 15)}px`,
                  top: `${-(30 + i * 15)}px`,
                }}
              />
            )}
          </For>
        </div>
      </div>

      {/* Background grid */}
      <div
        class="absolute inset-0 opacity-10"
        style={{
          "background-image": `
            linear-gradient(rgba(57, 255, 20, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(57, 255, 20, 0.1) 1px, transparent 1px)
          `,
          "background-size": "50px 50px",
        }}
      />

      {/* Main content */}
      <div class="container mx-auto px-6 relative z-10">
        <div class="max-w-4xl mx-auto text-center">
          {/* Signal badge */}
          <div class="inline-flex items-center gap-3 bg-alien-void-light/80 backdrop-blur-sm border border-alien-glow/30 rounded-full px-4 py-2 mb-8">
            <div class="relative">
              <div class="w-3 h-3 bg-alien-glow rounded-full animate-pulse" />
              <div class="absolute inset-0 w-3 h-3 bg-alien-glow rounded-full animate-ping" />
            </div>
            <span class="font-mono text-sm text-alien-glow">
              SIGNAL DETECTED: {signalStrength()}%
            </span>
            <div class="flex gap-0.5">
              <For each={[1, 2, 3, 4, 5]}>
                {(i) => (
                  <div
                    class={`w-1 rounded-full transition-all duration-300 ${
                      i <= Math.ceil(signalStrength() / 20)
                        ? 'bg-alien-glow h-4'
                        : 'bg-alien-glow/30 h-2'
                    }`}
                  />
                )}
              </For>
            </div>
          </div>

          {/* Greeting */}
          <p class="font-mono text-alien-teal text-lg mb-4 tracking-wider">
            {typewriterText()}
            <span class="animate-flicker">_</span>
          </p>

          {/* Main heading */}
          <h1 class="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span class="text-gray-100">I'm a </span>
            <span class="gradient-alien-text">Developer</span>
            <br />
            <span class="text-gray-100">From </span>
            <span class="text-alien-glow alien-text-glow">Another World</span>
          </h1>

          {/* Description */}
          <p class="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Transmitting cutting-edge web experiences across the digital cosmos.
            Specializing in <span class="text-alien-purple">interstellar interfaces</span>,{' '}
            <span class="text-alien-teal">quantum-grade code</span>, and{' '}
            <span class="text-alien-glow">cosmic user experiences</span>.
          </p>

          {/* CTA Buttons */}
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <LinkButton href="#projects" variant="primary" size="lg">
              <span>View Artifacts</span>
              <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </LinkButton>
            <LinkButton href="#contact" variant="secondary" size="lg">
              <span>Initiate Contact</span>
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </LinkButton>
          </div>

          {/* Coordinates display */}
          <div class="mt-16 flex justify-center">
            <div class="glass-panel rounded-xl px-6 py-4 font-mono text-xs">
              <div class="flex items-center gap-6 text-gray-500">
                <div>
                  <span class="text-alien-glow">LAT:</span> 37.7749
                </div>
                <div class="w-px h-4 bg-alien-glow/20" />
                <div>
                  <span class="text-alien-purple">LONG:</span> -122.4194
                </div>
                <div class="w-px h-4 bg-alien-glow/20" />
                <div>
                  <span class="text-alien-teal">SECTOR:</span> MILKY-WAY-7
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div class="absolute bottom-10 left-1/2 -translate-x-1/2">
        <div class="flex flex-col items-center gap-2 animate-float">
          <span class="font-mono text-xs text-gray-500">SCROLL TO EXPLORE</span>
          <div class="w-6 h-10 border-2 border-alien-glow/30 rounded-full p-1">
            <div class="w-1.5 h-2 bg-alien-glow rounded-full mx-auto animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
