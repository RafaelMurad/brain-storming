import { Component, For } from 'solid-js';
import Section from './Section';
import Terminal from './Terminal';

const About: Component = () => {
  const cards = [
    { icon: '★', title: 'MISSION', text: 'Building cutting-edge solutions that push technological boundaries.' },
    { icon: '⚡', title: 'APPROACH', text: 'Clean code, optimal performance, and futuristic design principles.' },
    { icon: '⚙', title: 'EXPERTISE', text: 'Full-stack development with focus on scalable architectures.' },
  ];

  return (
    <Section id="about" tag="<PROFILE>" title="ABOUT_ME">
      <div class="grid lg:grid-cols-2 gap-10">
        <Terminal />
        <div class="space-y-4">
          <For each={cards}>
            {(card) => (
              <div class="card-cyber relative pl-4 border-l-4 border-neon-cyan">
                <span class="text-2xl mb-2 block">{card.icon}</span>
                <h3 class="font-display text-neon-cyan mb-2">{card.title}</h3>
                <p class="text-gray-400 text-sm">{card.text}</p>
              </div>
            )}
          </For>
        </div>
      </div>
    </Section>
  );
};

export default About;
