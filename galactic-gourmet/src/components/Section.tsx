import { Component, JSX } from 'solid-js';

interface SectionProps {
  id?: string;
  title: string;
  subtitle?: string;
  children: JSX.Element;
  class?: string;
  dividerIcon?: string;
}

const Section: Component<SectionProps> = (props) => {
  return (
    <section id={props.id} class={`py-20 px-4 ${props.class || ''}`}>
      <div class="max-w-6xl mx-auto">
        {/* Decorative Top Divider */}
        <div class="divider-stars mb-8">
          <span class="text-gold text-2xl">{props.dividerIcon || '\u2726'}</span>
        </div>

        {/* Section Header */}
        <div class="text-center mb-16">
          <h2 class="font-serif text-4xl md:text-5xl font-bold text-gradient-gold mb-4">
            {props.title}
          </h2>
          {props.subtitle && (
            <p class="text-cream/70 text-lg font-light tracking-wide max-w-2xl mx-auto">
              {props.subtitle}
            </p>
          )}
        </div>

        {/* Section Content */}
        <div class="animate-slide-up">
          {props.children}
        </div>

        {/* Decorative Bottom Stars */}
        <div class="flex justify-center gap-2 mt-16">
          <span class="text-gold/40 text-sm animate-twinkle">\u2605</span>
          <span class="text-gold/60 text-xs animate-twinkle animate-delay-200">\u2605</span>
          <span class="text-gold/40 text-sm animate-twinkle animate-delay-500">\u2605</span>
        </div>
      </div>
    </section>
  );
};

export default Section;
