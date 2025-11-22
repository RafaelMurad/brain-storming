import { Component, For, createSignal, onMount } from 'solid-js';
import Section from './Section';

interface Skill {
  name: string;
  level: number;
  exp: string;
}

const Skills: Component = () => {
  const [visible, setVisible] = createSignal(false);

  const skills: Skill[] = [
    { name: 'JavaScript/TypeScript', level: 95, exp: '5+ YRS' },
    { name: 'React/Vue', level: 90, exp: '4+ YRS' },
    { name: 'Node.js/Express', level: 85, exp: '4+ YRS' },
    { name: 'Python', level: 80, exp: '3+ YRS' },
    { name: 'Docker/Kubernetes', level: 75, exp: '2+ YRS' },
    { name: 'AWS/Cloud', level: 70, exp: '2+ YRS' },
  ];

  const getLevelLabel = (level: number) => {
    if (level >= 90) return 'EXPERT';
    if (level >= 80) return 'ADVANCED';
    return 'PROFICIENT';
  };

  onMount(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 }
    );

    const section = document.getElementById('skills');
    if (section) observer.observe(section);
  });

  return (
    <Section id="skills" tag="<MODULES>" title="SKILL_MATRIX">
      <div class="grid md:grid-cols-2 gap-6">
        <For each={skills}>
          {(skill) => (
            <div class="card-cyber relative">
              <div class="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-transparent to-neon-cyan/10" style="clip-path: polygon(100% 0, 0 0, 100% 100%);" />

              <div class="flex justify-between items-center mb-4">
                <span class="font-display font-semibold text-white">{skill.name}</span>
                <span class="text-xs text-neon-cyan px-2 py-1 border border-neon-cyan">
                  {getLevelLabel(skill.level)}
                </span>
              </div>

              <div class="h-2 bg-neon-cyan/10 mb-3 overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-neon-cyan to-neon-magenta transition-all duration-1000 ease-out"
                  style={`width: ${visible() ? skill.level : 0}%; box-shadow: 0 0 10px rgba(0, 255, 249, 0.5);`}
                />
              </div>

              <div class="flex justify-between text-xs text-gray-500">
                <span>PWR: {skill.level}%</span>
                <span>EXP: {skill.exp}</span>
              </div>
            </div>
          )}
        </For>
      </div>
    </Section>
  );
};

export default Skills;
