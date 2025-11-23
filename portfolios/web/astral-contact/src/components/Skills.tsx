import { Component, For, createSignal, onMount } from 'solid-js';
import Section from './Section';

interface Skill {
  name: string;
  frequency: string;
  strength: number;
  category: 'frontend' | 'backend' | 'tools';
}

interface SkillCategory {
  title: string;
  icon: string;
  color: 'green' | 'purple' | 'teal';
  skills: Skill[];
}

const skillCategories: SkillCategory[] = [
  {
    title: 'FRONTEND FREQUENCIES',
    icon: 'monitor',
    color: 'green',
    skills: [
      { name: 'React/SolidJS', frequency: '432.7 MHz', strength: 95, category: 'frontend' },
      { name: 'TypeScript', frequency: '528.0 MHz', strength: 90, category: 'frontend' },
      { name: 'Tailwind CSS', frequency: '396.2 MHz', strength: 92, category: 'frontend' },
      { name: 'Next.js', frequency: '417.5 MHz', strength: 88, category: 'frontend' },
      { name: 'Three.js/WebGL', frequency: '741.3 MHz', strength: 75, category: 'frontend' },
    ],
  },
  {
    title: 'BACKEND SIGNALS',
    icon: 'server',
    color: 'purple',
    skills: [
      { name: 'Node.js', frequency: '852.4 MHz', strength: 88, category: 'backend' },
      { name: 'Python', frequency: '639.1 MHz', strength: 85, category: 'backend' },
      { name: 'PostgreSQL', frequency: '963.8 MHz', strength: 82, category: 'backend' },
      { name: 'GraphQL', frequency: '285.6 MHz', strength: 80, category: 'backend' },
      { name: 'Docker', frequency: '174.2 MHz', strength: 78, category: 'backend' },
    ],
  },
  {
    title: 'COSMIC TOOLS',
    icon: 'tool',
    color: 'teal',
    skills: [
      { name: 'Git/GitHub', frequency: '111.1 MHz', strength: 94, category: 'tools' },
      { name: 'VS Code', frequency: '222.2 MHz', strength: 96, category: 'tools' },
      { name: 'Figma', frequency: '333.3 MHz', strength: 85, category: 'tools' },
      { name: 'AWS/Cloud', frequency: '444.4 MHz', strength: 75, category: 'tools' },
      { name: 'CI/CD', frequency: '555.5 MHz', strength: 80, category: 'tools' },
    ],
  },
];

const Skills: Component = () => {
  const [activeCategory, setActiveCategory] = createSignal(0);
  const [animatedStrengths, setAnimatedStrengths] = createSignal<Record<string, number>>({});

  onMount(() => {
    // Animate skill bars on mount
    const allSkills = skillCategories.flatMap((cat) => cat.skills);
    allSkills.forEach((skill, index) => {
      setTimeout(() => {
        setAnimatedStrengths((prev) => ({ ...prev, [skill.name]: skill.strength }));
      }, index * 100);
    });
  });

  return (
    <Section
      id="skills"
      title="SIGNAL FREQUENCIES"
      subtitle="// DETECTED WAVELENGTHS"
      cropCircles
      glowAccent="teal"
    >
      {/* Frequency spectrum visualization */}
      <div class="mb-12">
        <div class="alien-card p-6 overflow-hidden">
          <div class="flex items-center justify-between mb-4">
            <span class="font-mono text-sm text-gray-500">SPECTRUM ANALYZER</span>
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-alien-glow rounded-full animate-pulse" />
              <span class="font-mono text-xs text-alien-glow">SCANNING</span>
            </div>
          </div>

          {/* Animated spectrum bars */}
          <div class="flex items-end justify-center gap-1 h-20">
            <For each={Array.from({ length: 40 })}>
              {(_, i) => (
                <div
                  class="w-2 bg-gradient-to-t from-alien-purple via-alien-teal to-alien-glow rounded-t transition-all duration-300"
                  style={{
                    height: `${Math.random() * 60 + 20}%`,
                    "animation": "pulseGlow 1s ease-in-out infinite",
                    "animation-delay": `${i() * 50}ms`,
                  }}
                />
              )}
            </For>
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div class="flex flex-wrap justify-center gap-4 mb-8">
        <For each={skillCategories}>
          {(category, index) => (
            <button
              onClick={() => setActiveCategory(index())}
              class={`flex items-center gap-2 px-6 py-3 rounded-xl font-mono text-sm transition-all duration-300 ${
                activeCategory() === index()
                  ? `bg-alien-${category.color}/20 border border-alien-${category.color} text-alien-${category.color} shadow-${category.color === 'green' ? 'glow' : category.color === 'purple' ? 'glow-purple' : 'glow-teal'}`
                  : 'bg-alien-void-light border border-alien-glow/20 text-gray-400 hover:border-alien-glow/40'
              }`}
            >
              <CategoryIcon type={category.icon} />
              {category.title}
            </button>
          )}
        </For>
      </div>

      {/* Skills display */}
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <For each={skillCategories}>
          {(category, catIndex) => (
            <div
              class={`transition-all duration-500 ${
                activeCategory() === catIndex()
                  ? 'opacity-100 scale-100'
                  : 'md:opacity-50 md:scale-95 hover:opacity-75'
              }`}
            >
              <div class={`alien-card p-6 h-full border-${category.color === 'green' ? 'alien-glow' : category.color === 'purple' ? 'alien-purple' : 'alien-teal'}/30`}>
                <h3 class={`font-display text-lg font-bold mb-6 text-${category.color === 'green' ? 'alien-glow' : category.color === 'purple' ? 'alien-purple' : 'alien-teal'}`}>
                  {category.title}
                </h3>

                <div class="space-y-4">
                  <For each={category.skills}>
                    {(skill) => (
                      <SkillBar
                        skill={skill}
                        strength={animatedStrengths()[skill.name] || 0}
                        color={category.color}
                      />
                    )}
                  </For>
                </div>
              </div>
            </div>
          )}
        </For>
      </div>

      {/* Legend */}
      <div class="mt-12 flex justify-center">
        <div class="glass-panel rounded-xl px-6 py-4">
          <div class="flex items-center gap-6 font-mono text-xs text-gray-500">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-alien-glow" />
              <span>Frontend</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-alien-purple" />
              <span>Backend</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-alien-teal" />
              <span>Tools</span>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Skills;

// Skill Bar Component
interface SkillBarProps {
  skill: Skill;
  strength: number;
  color: 'green' | 'purple' | 'teal';
}

const SkillBar: Component<SkillBarProps> = (props) => {
  const colorClasses = () => {
    switch (props.color) {
      case 'purple':
        return {
          bg: 'bg-alien-purple',
          text: 'text-alien-purple',
          glow: 'shadow-glow-purple',
        };
      case 'teal':
        return {
          bg: 'bg-alien-teal',
          text: 'text-alien-teal',
          glow: 'shadow-glow-teal',
        };
      default:
        return {
          bg: 'bg-alien-glow',
          text: 'text-alien-glow',
          glow: 'shadow-glow',
        };
    }
  };

  return (
    <div class="group">
      <div class="flex items-center justify-between mb-2">
        <span class="font-mono text-sm text-gray-300 group-hover:text-white transition-colors">
          {props.skill.name}
        </span>
        <span class={`font-mono text-xs ${colorClasses().text} opacity-70`}>
          {props.skill.frequency}
        </span>
      </div>

      <div class="relative h-2 bg-alien-void rounded-full overflow-hidden">
        {/* Background glow */}
        <div
          class={`absolute inset-y-0 left-0 ${colorClasses().bg}/20 rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${props.strength}%` }}
        />

        {/* Main bar */}
        <div
          class={`absolute inset-y-0 left-0 ${colorClasses().bg} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${props.strength}%` }}
        >
          {/* Animated pulse at the end */}
          <div
            class={`absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 ${colorClasses().bg} rounded-full animate-pulse ${colorClasses().glow}`}
          />
        </div>

        {/* Signal dots */}
        <div class="absolute inset-0 flex items-center">
          <For each={[20, 40, 60, 80]}>
            {(pos) => (
              <div
                class={`absolute w-1 h-1 rounded-full ${
                  props.strength >= pos ? colorClasses().bg : 'bg-gray-700'
                }`}
                style={{ left: `${pos}%` }}
              />
            )}
          </For>
        </div>
      </div>

      {/* Strength percentage */}
      <div class="flex justify-end mt-1">
        <span class={`font-mono text-xs ${colorClasses().text}`}>
          {props.strength}%
        </span>
      </div>
    </div>
  );
};

// Category Icon Component
const CategoryIcon: Component<{ type: string }> = (props) => {
  switch (props.type) {
    case 'monitor':
      return (
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </svg>
      );
    case 'server':
      return (
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="2" y="2" width="20" height="8" rx="2" />
          <rect x="2" y="14" width="20" height="8" rx="2" />
          <circle cx="6" cy="6" r="1" fill="currentColor" />
          <circle cx="6" cy="18" r="1" fill="currentColor" />
        </svg>
      );
    case 'tool':
      return (
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
        </svg>
      );
    default:
      return null;
  }
};
