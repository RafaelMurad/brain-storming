import { Component, For } from 'solid-js';
import Section from './Section';
import ProjectCard from './ProjectCard';

const Projects: Component = () => {
  const projects = [
    {
      id: 'PRJ_001',
      title: 'NEURAL_COMMERCE',
      description: 'AI-powered e-commerce platform with predictive analytics and real-time personalization.',
      tags: ['React', 'Node.js', 'TensorFlow'],
      status: 'DEPLOYED',
      visual: 'cyber',
    },
    {
      id: 'PRJ_002',
      title: 'QUANTUM_DASH',
      description: 'Real-time analytics dashboard with WebSocket streaming and 3D data visualization.',
      tags: ['Vue.js', 'Three.js', 'Go'],
      status: 'DEPLOYED',
      visual: 'matrix',
    },
    {
      id: 'PRJ_003',
      title: 'SYNTH_CLOUD',
      description: 'Serverless infrastructure management with auto-scaling and cost optimization AI.',
      tags: ['TypeScript', 'AWS', 'Terraform'],
      status: 'BETA',
      visual: 'hologram',
    },
    {
      id: 'PRJ_004',
      title: 'CRYPTO_NEXUS',
      description: 'Decentralized trading platform with smart contracts and cross-chain bridges.',
      tags: ['Solidity', 'React', 'Rust'],
      status: 'DEPLOYED',
      visual: 'neon',
    },
  ];

  return (
    <Section id="projects" tag="<ARCHIVE>" title="PROJECT_DATABASE">
      <div class="grid md:grid-cols-2 gap-8">
        <For each={projects}>
          {(project) => <ProjectCard {...project} />}
        </For>
      </div>
    </Section>
  );
};

export default Projects;
