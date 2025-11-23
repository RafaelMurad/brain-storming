import { Component, For, createSignal } from 'solid-js';
import Section from './Section';
import Button from './Button';

interface Project {
  id: string;
  title: string;
  codename: string;
  description: string;
  technologies: string[];
  image: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'CLASSIFIED';
  links: {
    demo?: string;
    github?: string;
  };
}

const projects: Project[] = [
  {
    id: 'artifact-001',
    title: 'Nebula Dashboard',
    codename: 'PROJECT STARDUST',
    description: 'An interstellar analytics platform that visualizes cosmic data streams with real-time updates and quantum-encrypted communications.',
    technologies: ['React', 'TypeScript', 'D3.js', 'WebSocket'],
    image: 'nebula',
    status: 'ACTIVE',
    links: {
      demo: '#',
      github: '#',
    },
  },
  {
    id: 'artifact-002',
    title: 'Quantum Commerce',
    codename: 'OPERATION TRADE',
    description: 'E-commerce platform capable of processing transactions across multiple dimensions with anti-matter payment support.',
    technologies: ['Next.js', 'Stripe', 'PostgreSQL', 'Redis'],
    image: 'quantum',
    status: 'ACTIVE',
    links: {
      demo: '#',
      github: '#',
    },
  },
  {
    id: 'artifact-003',
    title: 'Warp Messenger',
    codename: 'SIGNAL ALPHA',
    description: 'Faster-than-light communication app enabling instant messaging across galaxies with end-to-end quantum encryption.',
    technologies: ['SolidJS', 'WebRTC', 'Node.js', 'MongoDB'],
    image: 'warp',
    status: 'ACTIVE',
    links: {
      demo: '#',
    },
  },
  {
    id: 'artifact-004',
    title: 'Stellar Portfolio',
    codename: 'DISPLAY PRIME',
    description: 'A portfolio template that showcases work across the multiverse with dynamic theme switching and 3D elements.',
    technologies: ['Three.js', 'GSAP', 'Tailwind', 'Vite'],
    image: 'stellar',
    status: 'ARCHIVED',
    links: {
      github: '#',
    },
  },
  {
    id: 'artifact-005',
    title: 'Cosmic CMS',
    codename: 'DATA NEXUS',
    description: 'Content management system optimized for managing knowledge bases spanning multiple star systems.',
    technologies: ['Vue.js', 'GraphQL', 'Prisma', 'AWS'],
    image: 'cosmic',
    status: 'CLASSIFIED',
    links: {},
  },
  {
    id: 'artifact-006',
    title: 'Gravity Forms',
    codename: 'INPUT ZERO',
    description: 'Form builder that bends space-time to create the most intuitive data collection experiences in the universe.',
    technologies: ['React', 'Formik', 'Zod', 'Framer Motion'],
    image: 'gravity',
    status: 'ACTIVE',
    links: {
      demo: '#',
      github: '#',
    },
  },
];

const Projects: Component = () => {
  const [filter, setFilter] = createSignal<'ALL' | 'ACTIVE' | 'ARCHIVED' | 'CLASSIFIED'>('ALL');
  const [hoveredProject, setHoveredProject] = createSignal<string | null>(null);

  const filteredProjects = () =>
    filter() === 'ALL' ? projects : projects.filter((p) => p.status === filter());

  return (
    <Section
      id="projects"
      title="RECOVERED ARTIFACTS"
      subtitle="// SPECIMEN DATABASE"
      cropCircles
      glowAccent="green"
    >
      {/* Filter controls */}
      <div class="flex flex-wrap justify-center gap-3 mb-12">
        <For each={['ALL', 'ACTIVE', 'ARCHIVED', 'CLASSIFIED'] as const}>
          {(status) => (
            <button
              onClick={() => setFilter(status)}
              class={`px-4 py-2 rounded-lg font-mono text-xs transition-all duration-300 ${
                filter() === status
                  ? 'bg-alien-glow text-alien-void'
                  : 'bg-alien-void-light border border-alien-glow/20 text-gray-400 hover:border-alien-glow/50'
              }`}
            >
              [{status}]
            </button>
          )}
        </For>
      </div>

      {/* Projects grid */}
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <For each={filteredProjects()}>
          {(project) => (
            <ProjectCard
              project={project}
              isHovered={hoveredProject() === project.id}
              onHover={() => setHoveredProject(project.id)}
              onLeave={() => setHoveredProject(null)}
            />
          )}
        </For>
      </div>

      {/* Empty state */}
      {filteredProjects().length === 0 && (
        <div class="text-center py-20">
          <div class="text-alien-glow/30 text-6xl mb-4">?</div>
          <p class="font-mono text-gray-500">NO ARTIFACTS MATCH CURRENT FILTER</p>
        </div>
      )}

      {/* View more CTA */}
      <div class="text-center mt-12">
        <Button variant="secondary" glowColor="purple">
          <span>ACCESS FULL ARCHIVE</span>
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
          </svg>
        </Button>
      </div>
    </Section>
  );
};

export default Projects;

// Project Card Component
interface ProjectCardProps {
  project: Project;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}

const ProjectCard: Component<ProjectCardProps> = (props) => {
  const statusColors = {
    ACTIVE: 'bg-alien-glow text-alien-void',
    ARCHIVED: 'bg-alien-purple text-white',
    CLASSIFIED: 'bg-red-500 text-white',
  };

  const getProjectVisual = () => {
    // Generate unique visual based on project image type
    const visuals: Record<string, { gradient: string; pattern: string }> = {
      nebula: {
        gradient: 'from-alien-purple via-alien-teal to-alien-glow',
        pattern: 'radial',
      },
      quantum: {
        gradient: 'from-alien-glow via-alien-purple to-alien-teal',
        pattern: 'grid',
      },
      warp: {
        gradient: 'from-alien-teal via-alien-glow to-alien-purple',
        pattern: 'lines',
      },
      stellar: {
        gradient: 'from-alien-purple to-alien-glow',
        pattern: 'dots',
      },
      cosmic: {
        gradient: 'from-alien-teal to-alien-purple',
        pattern: 'waves',
      },
      gravity: {
        gradient: 'from-alien-glow to-alien-teal',
        pattern: 'circles',
      },
    };
    return visuals[props.project.image] || visuals.nebula;
  };

  return (
    <div
      class="group alien-card overflow-hidden transition-all duration-500"
      onMouseEnter={props.onHover}
      onMouseLeave={props.onLeave}
    >
      {/* Project visual */}
      <div class="relative h-48 overflow-hidden">
        <div
          class={`absolute inset-0 bg-gradient-to-br ${getProjectVisual().gradient} opacity-20 group-hover:opacity-40 transition-opacity duration-500`}
        />

        {/* Pattern overlay */}
        <div class="absolute inset-0 opacity-30">
          <PatternVisual type={getProjectVisual().pattern} />
        </div>

        {/* Hologram effect on hover */}
        <div
          class={`absolute inset-0 transition-opacity duration-300 ${
            props.isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div class="absolute inset-0 bg-gradient-to-t from-alien-void via-transparent to-transparent" />
          <div class="absolute top-0 left-0 right-0 h-px bg-alien-glow animate-scan-line" />
        </div>

        {/* Status badge */}
        <div class="absolute top-4 right-4">
          <span
            class={`px-2 py-1 rounded text-xs font-mono ${statusColors[props.project.status]}`}
          >
            {props.project.status}
          </span>
        </div>

        {/* Codename */}
        <div class="absolute bottom-4 left-4">
          <span class="font-mono text-xs text-alien-glow/70 bg-alien-void/80 px-2 py-1 rounded">
            {props.project.codename}
          </span>
        </div>
      </div>

      {/* Content */}
      <div class="p-6">
        <h3 class="font-display text-xl font-bold text-white mb-2 group-hover:text-alien-glow transition-colors">
          {props.project.title}
        </h3>

        <p class="text-gray-400 text-sm mb-4 line-clamp-3">
          {props.project.description}
        </p>

        {/* Technologies */}
        <div class="flex flex-wrap gap-2 mb-4">
          <For each={props.project.technologies}>
            {(tech) => (
              <span class="px-2 py-1 bg-alien-void text-xs font-mono text-alien-teal rounded border border-alien-teal/20">
                {tech}
              </span>
            )}
          </For>
        </div>

        {/* Links */}
        <div class="flex gap-3">
          {props.project.links.demo && (
            <a
              href={props.project.links.demo}
              class="flex items-center gap-1 text-sm text-alien-glow hover:text-alien-glow/80 transition-colors"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
              </svg>
              <span class="font-mono">DEMO</span>
            </a>
          )}
          {props.project.links.github && (
            <a
              href={props.project.links.github}
              class="flex items-center gap-1 text-sm text-alien-purple hover:text-alien-purple-light transition-colors"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span class="font-mono">CODE</span>
            </a>
          )}
          {props.project.status === 'CLASSIFIED' && (
            <span class="flex items-center gap-1 text-sm text-red-400">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              <span class="font-mono">RESTRICTED</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// Pattern Visual Component
const PatternVisual: Component<{ type: string }> = (props) => {
  switch (props.type) {
    case 'radial':
      return (
        <div class="w-full h-full flex items-center justify-center">
          <div class="w-32 h-32 rounded-full border border-alien-purple/30 animate-pulse">
            <div class="w-full h-full rounded-full border border-alien-teal/30 m-2 animate-pulse animate-delay-200" />
          </div>
        </div>
      );
    case 'grid':
      return (
        <div
          class="w-full h-full"
          style={{
            "background-image": "linear-gradient(rgba(57, 255, 20, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(57, 255, 20, 0.1) 1px, transparent 1px)",
            "background-size": "20px 20px",
          }}
        />
      );
    case 'lines':
      return (
        <div class="w-full h-full flex flex-col justify-center gap-2 px-8">
          <For each={[1, 2, 3, 4, 5]}>
            {(i) => (
              <div
                class="h-px bg-alien-teal/30"
                style={{ width: `${100 - i * 15}%` }}
              />
            )}
          </For>
        </div>
      );
    case 'dots':
      return (
        <div class="w-full h-full p-4">
          <For each={Array.from({ length: 20 })}>
            {(_, i) => (
              <div
                class="absolute w-1 h-1 rounded-full bg-alien-glow/50"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
              />
            )}
          </For>
        </div>
      );
    case 'waves':
      return (
        <svg class="w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="none">
          <path
            d="M0 50 Q50 30, 100 50 T200 50"
            stroke="rgba(46, 196, 182, 0.3)"
            fill="none"
            stroke-width="1"
          />
          <path
            d="M0 60 Q50 40, 100 60 T200 60"
            stroke="rgba(157, 78, 221, 0.3)"
            fill="none"
            stroke-width="1"
          />
        </svg>
      );
    case 'circles':
      return (
        <div class="w-full h-full flex items-center justify-center">
          <div class="relative">
            <For each={[40, 60, 80]}>
              {(size) => (
                <div
                  class="absolute rounded-full border border-alien-glow/20"
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    top: `${-size / 2}px`,
                    left: `${-size / 2}px`,
                  }}
                />
              )}
            </For>
          </div>
        </div>
      );
    default:
      return null;
  }
};
