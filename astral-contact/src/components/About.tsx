import { Component, For, createSignal, onMount } from 'solid-js';
import Section from './Section';

interface TransmissionLine {
  label: string;
  value: string;
  color: 'green' | 'purple' | 'teal';
}

const transmissionData: TransmissionLine[] = [
  { label: 'DESIGNATION', value: 'Full-Stack Developer', color: 'green' },
  { label: 'ORIGIN', value: 'Planet Earth (temporarily)', color: 'purple' },
  { label: 'MISSION', value: 'Building the Future', color: 'teal' },
  { label: 'EXPERIENCE', value: '5+ Earth Years', color: 'green' },
];

const About: Component = () => {
  const [hologramActive, setHologramActive] = createSignal(false);
  const [scanLine, setScanLine] = createSignal(0);

  onMount(() => {
    setTimeout(() => setHologramActive(true), 500);

    // Animate scan line
    const scanInterval = setInterval(() => {
      setScanLine((prev) => (prev + 1) % 100);
    }, 30);

    return () => clearInterval(scanInterval);
  });

  return (
    <Section
      id="about"
      title="TRANSMISSION LOG"
      subtitle="// INCOMING SIGNAL"
      cropCircles
      glowAccent="purple"
    >
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        {/* Hologram Display */}
        <div class="relative">
          <div
            class={`relative aspect-square max-w-md mx-auto transition-all duration-1000 ${
              hologramActive() ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            {/* Hologram container */}
            <div class="absolute inset-0 rounded-full border-2 border-alien-purple/30 animate-pulse-glow" style={{ "box-shadow": "0 0 30px rgba(157, 78, 221, 0.3)" }}>
              {/* Rotating rings */}
              <div class="absolute inset-4 rounded-full border border-alien-purple/20 animate-rotate-slow" />
              <div
                class="absolute inset-8 rounded-full border border-alien-teal/20 animate-rotate-slow"
                style={{ "animation-direction": "reverse", "animation-duration": "15s" }}
              />
              <div class="absolute inset-12 rounded-full border border-alien-glow/20 animate-rotate-slow" style={{ "animation-duration": "25s" }} />

              {/* Center avatar/hologram */}
              <div class="absolute inset-16 rounded-full overflow-hidden hologram-effect bg-gradient-to-br from-alien-purple/20 to-alien-teal/20">
                {/* Placeholder avatar - alien silhouette */}
                <div class="absolute inset-0 flex items-center justify-center">
                  <svg
                    class="w-3/4 h-3/4 text-alien-glow/60"
                    viewBox="0 0 100 100"
                    fill="none"
                  >
                    {/* Alien head */}
                    <ellipse cx="50" cy="35" rx="25" ry="30" fill="currentColor" opacity="0.3" />
                    <ellipse cx="50" cy="35" rx="22" ry="27" stroke="currentColor" stroke-width="1" fill="none" />
                    {/* Eyes */}
                    <ellipse cx="40" cy="32" rx="8" ry="10" fill="currentColor" opacity="0.5" />
                    <ellipse cx="60" cy="32" rx="8" ry="10" fill="currentColor" opacity="0.5" />
                    <ellipse cx="40" cy="32" rx="4" ry="6" fill="currentColor" />
                    <ellipse cx="60" cy="32" rx="4" ry="6" fill="currentColor" />
                    {/* Body hint */}
                    <path
                      d="M35 60 Q30 80, 35 95 L65 95 Q70 80, 65 60"
                      fill="currentColor"
                      opacity="0.2"
                    />
                  </svg>
                </div>

                {/* Scan line effect */}
                <div
                  class="absolute left-0 right-0 h-1 bg-gradient-to-b from-transparent via-alien-glow/50 to-transparent pointer-events-none"
                  style={{ top: `${scanLine()}%` }}
                />
              </div>

              {/* Data points around the circle */}
              <For each={[0, 45, 90, 135, 180, 225, 270, 315]}>
                {(angle) => (
                  <div
                    class="absolute w-2 h-2 bg-alien-glow rounded-full animate-pulse"
                    style={{
                      top: `${50 + 45 * Math.sin((angle * Math.PI) / 180)}%`,
                      left: `${50 + 45 * Math.cos((angle * Math.PI) / 180)}%`,
                      "animation-delay": `${angle * 10}ms`,
                    }}
                  />
                )}
              </For>
            </div>

            {/* Status indicators */}
            <div class="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-alien-void-light border border-alien-purple/30 rounded-lg px-4 py-2">
              <div class="flex items-center gap-2 font-mono text-xs">
                <div class="w-2 h-2 bg-alien-glow rounded-full animate-pulse" />
                <span class="text-alien-glow">HOLOGRAM ACTIVE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Transmission Log */}
        <div class="space-y-6">
          {/* Terminal-style header */}
          <div class="alien-card p-6">
            <div class="flex items-center gap-2 mb-4">
              <div class="w-3 h-3 rounded-full bg-red-500/70" />
              <div class="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div class="w-3 h-3 rounded-full bg-alien-glow/70" />
              <span class="ml-2 font-mono text-xs text-gray-500">transmission_log.data</span>
            </div>

            <div class="font-mono text-sm space-y-3">
              <For each={transmissionData}>
                {(line, index) => (
                  <div
                    class="flex items-center gap-4 p-3 bg-alien-void/50 rounded-lg border border-alien-glow/10"
                    style={{ "animation-delay": `${index() * 100}ms` }}
                  >
                    <span class={`text-${line.color === 'green' ? 'alien-glow' : line.color === 'purple' ? 'alien-purple' : 'alien-teal'} w-32 shrink-0`}>
                      {line.label}:
                    </span>
                    <span class="text-gray-300">{line.value}</span>
                  </div>
                )}
              </For>
            </div>
          </div>

          {/* Bio text */}
          <div class="alien-card p-6">
            <p class="text-gray-400 leading-relaxed mb-4">
              <span class="text-alien-purple font-mono">&gt;</span> Intercepted transmission indicates
              expertise in crafting{' '}
              <span class="text-alien-glow">intergalactic web applications</span> using advanced
              technologies from across the galaxy.
            </p>
            <p class="text-gray-400 leading-relaxed mb-4">
              <span class="text-alien-teal font-mono">&gt;</span> Subject demonstrates proficiency in
              translating complex cosmic requirements into{' '}
              <span class="text-alien-purple">elegant, user-friendly interfaces</span> that transcend
              dimensional boundaries.
            </p>
            <p class="text-gray-400 leading-relaxed">
              <span class="text-alien-glow font-mono">&gt;</span> Mission objective: To bridge the gap
              between{' '}
              <span class="text-alien-teal">alien technology</span> and{' '}
              <span class="text-alien-purple">human experience</span>, creating digital artifacts that
              inspire wonder.
            </p>
          </div>

          {/* Stats */}
          <div class="grid grid-cols-3 gap-4">
            <StatCard number="50+" label="PROJECTS" color="green" />
            <StatCard number="30+" label="CLIENTS" color="purple" />
            <StatCard number="99%" label="SUCCESS" color="teal" />
          </div>
        </div>
      </div>
    </Section>
  );
};

export default About;

// Stat Card Component
interface StatCardProps {
  number: string;
  label: string;
  color: 'green' | 'purple' | 'teal';
}

const StatCard: Component<StatCardProps> = (props) => {
  const colorClasses = () => {
    switch (props.color) {
      case 'purple':
        return 'text-alien-purple alien-text-glow-purple border-alien-purple/30';
      case 'teal':
        return 'text-alien-teal alien-text-glow-teal border-alien-teal/30';
      default:
        return 'text-alien-glow alien-text-glow border-alien-glow/30';
    }
  };

  return (
    <div class={`alien-card p-4 text-center border ${colorClasses()}`}>
      <div class={`font-display text-2xl md:text-3xl font-bold ${colorClasses()}`}>
        {props.number}
      </div>
      <div class="font-mono text-xs text-gray-500 mt-1">{props.label}</div>
    </div>
  );
};
