import { Component, JSX } from 'solid-js';

interface SectionProps {
  id: string;
  tag: string;
  title: string;
  children: JSX.Element;
}

const Section: Component<SectionProps> = (props) => {
  return (
    <section id={props.id} class="py-24 md:py-32">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-16">
          <span class="text-neon-cyan text-sm font-mono">{props.tag}</span>
          <h2 class="font-display text-4xl md:text-5xl font-bold text-white mt-2 mb-4">{props.title}</h2>
          <div class="w-20 h-1 bg-gradient-to-r from-neon-cyan to-neon-magenta mx-auto" />
        </div>
        {props.children}
      </div>
    </section>
  );
};

export default Section;
