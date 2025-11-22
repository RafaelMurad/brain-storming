import { Component, JSX } from 'solid-js';

export interface SectionProps {
  id?: string;
  title?: string;
  subtitle?: string;
  class?: string;
  children: JSX.Element;
  cropCircles?: boolean;
  glowAccent?: 'green' | 'purple' | 'teal';
}

const Section: Component<SectionProps> = (props) => {
  const glowAccent = () => props.glowAccent || 'green';

  const accentColors = {
    green: {
      title: 'text-alien-glow alien-text-glow',
      line: 'bg-alien-glow',
      circle: 'border-alien-glow',
    },
    purple: {
      title: 'text-alien-purple alien-text-glow-purple',
      line: 'bg-alien-purple',
      circle: 'border-alien-purple',
    },
    teal: {
      title: 'text-alien-teal alien-text-glow-teal',
      line: 'bg-alien-teal',
      circle: 'border-alien-teal',
    },
  };

  const colors = () => accentColors[glowAccent()];

  return (
    <section
      id={props.id}
      class={`relative py-20 md:py-32 ${props.class || ''}`}
    >
      {/* Crop circle pattern background */}
      {props.cropCircles && (
        <div class="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Large crop circle */}
          <div
            class={`absolute -right-32 top-1/4 w-64 h-64 rounded-full border ${colors().circle}/10 animate-rotate-slow`}
          >
            <div class={`absolute inset-8 rounded-full border ${colors().circle}/10`} />
            <div class={`absolute inset-16 rounded-full border ${colors().circle}/10`} />
            <div class={`absolute inset-24 rounded-full border ${colors().circle}/10`} />
            {/* Cross lines */}
            <div class={`absolute top-1/2 left-0 right-0 h-px ${colors().line}/5`} />
            <div class={`absolute left-1/2 top-0 bottom-0 w-px ${colors().line}/5`} />
          </div>

          {/* Small crop circle */}
          <div
            class={`absolute -left-16 bottom-1/4 w-32 h-32 rounded-full border ${colors().circle}/10 animate-rotate-slow`}
            style={{ "animation-direction": "reverse", "animation-duration": "30s" }}
          >
            <div class={`absolute inset-4 rounded-full border ${colors().circle}/10`} />
            <div class={`absolute inset-8 rounded-full border ${colors().circle}/10`} />
          </div>

          {/* Decorative dots */}
          <CropCircleIcon class="absolute top-20 left-1/4 w-8 h-8 opacity-20" color={glowAccent()} />
          <CropCircleIcon class="absolute bottom-32 right-1/4 w-6 h-6 opacity-15" color={glowAccent()} />
        </div>
      )}

      <div class="container mx-auto px-6 relative z-10">
        {/* Section header */}
        {(props.title || props.subtitle) && (
          <div class="text-center mb-16">
            {props.subtitle && (
              <p class="font-mono text-sm text-gray-500 mb-2 tracking-widest uppercase">
                {props.subtitle}
              </p>
            )}
            {props.title && (
              <div class="relative inline-block">
                <h2 class={`font-display text-3xl md:text-4xl lg:text-5xl font-bold ${colors().title}`}>
                  {props.title}
                </h2>
                {/* Decorative line */}
                <div class="flex items-center justify-center gap-2 mt-4">
                  <div class={`w-12 h-px ${colors().line}/50`} />
                  <CropCircleIcon class="w-4 h-4" color={glowAccent()} />
                  <div class={`w-12 h-px ${colors().line}/50`} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Section content */}
        {props.children}
      </div>
    </section>
  );
};

export default Section;

// Crop Circle Icon Component
interface CropCircleIconProps {
  class?: string;
  color?: 'green' | 'purple' | 'teal';
}

export const CropCircleIcon: Component<CropCircleIconProps> = (props) => {
  const colorClass = () => {
    switch (props.color || 'green') {
      case 'purple':
        return 'text-alien-purple';
      case 'teal':
        return 'text-alien-teal';
      default:
        return 'text-alien-glow';
    }
  };

  return (
    <svg
      class={`${colorClass()} ${props.class || ''}`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1" opacity="0.6" />
      <circle cx="12" cy="12" r="6" stroke="currentColor" stroke-width="1" opacity="0.8" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" stroke-width="0.5" opacity="0.3" />
      <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="0.5" opacity="0.3" />
    </svg>
  );
};

// Signal Wave Icon
export const SignalWaveIcon: Component<{ class?: string }> = (props) => (
  <svg
    class={`text-alien-glow ${props.class || ''}`}
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M2 12 Q6 6, 12 12 T22 12"
      stroke="currentColor"
      stroke-width="2"
      fill="none"
      stroke-linecap="round"
    />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
);
