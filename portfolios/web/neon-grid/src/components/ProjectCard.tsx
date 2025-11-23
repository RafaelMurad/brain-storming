import { Component, For } from 'solid-js';

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  tags: string[];
  status: string;
  visual: string;
}

const ProjectCard: Component<ProjectCardProps> = (props) => {
  const visualStyles: Record<string, string> = {
    cyber: 'bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#16213e]',
    matrix: 'bg-gradient-to-b from-[#0a0f0a] to-[#001a00]',
    hologram: 'bg-gradient-to-br from-[#0f0f1a] to-[#1a0f1a]',
    neon: 'bg-gradient-to-br from-[#0a0a0f] to-[#1a0a1a]',
  };

  return (
    <article class="group bg-cyber-card border border-white/10 overflow-hidden transition-all duration-300 hover:border-neon-cyan/50 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,255,249,0.1)]">
      {/* Image */}
      <div class="relative h-48 overflow-hidden">
        <div class={`absolute inset-0 ${visualStyles[props.visual]} transition-transform duration-500 group-hover:scale-110`} />
        <div class="absolute inset-0 bg-gradient-to-t from-cyber-dark via-transparent to-transparent" />
        <span class="absolute bottom-4 left-4 text-xs text-neon-cyan font-mono opacity-70">{props.id}</span>
      </div>

      {/* Content */}
      <div class="p-6">
        <div class="flex items-center gap-2 mb-3">
          <span class={`w-2 h-2 rounded-full ${props.status === 'DEPLOYED' ? 'bg-green-500 shadow-[0_0_10px_#27c93f]' : 'bg-yellow-500 shadow-[0_0_10px_#ffff00]'}`} />
          <span class="text-xs text-gray-500">{props.status}</span>
        </div>

        <h3 class="font-display text-xl font-bold text-white mb-2 group-hover:text-neon-cyan transition-colors">
          {props.title}
        </h3>
        <p class="text-gray-400 text-sm mb-4 line-clamp-2">{props.description}</p>

        {/* Tags */}
        <div class="flex flex-wrap gap-2 mb-4">
          <For each={props.tags}>
            {(tag) => (
              <span class="px-3 py-1 text-xs text-neon-cyan bg-neon-cyan/10 border border-neon-cyan/30">
                {tag}
              </span>
            )}
          </For>
        </div>

        {/* Links */}
        <div class="flex gap-4">
          <a href="#" class="font-display text-sm text-neon-magenta hover:text-white transition-colors">
            DEMO ▶
          </a>
          <a href="#" class="font-display text-sm text-neon-magenta hover:text-white transition-colors">
            CODE ⎔
          </a>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
