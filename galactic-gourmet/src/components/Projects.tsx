import { Component, For } from 'solid-js';
import Section from './Section';
import Button from './Button';

interface Project {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  ingredients: string[];
  cookingTime: string;
  difficulty: string;
  servings: string;
  tags: string[];
}

const Projects: Component = () => {
  const projects: Project[] = [
    {
      title: 'Nebula Dashboard',
      subtitle: 'A Stellar Analytics Recipe',
      description: 'A real-time analytics dashboard that visualizes data like stars in the night sky. Features interactive charts, live updates, and cosmic color schemes.',
      image: '\uD83D\uDCCA',
      ingredients: ['React', 'D3.js', 'WebSocket', 'Node.js', 'PostgreSQL'],
      cookingTime: '3 months',
      difficulty: '\u2605\u2605\u2605\u2605\u2606',
      servings: '10k+ users',
      tags: ['Full Stack', 'Real-time', 'Data Viz'],
    },
    {
      title: 'Cosmic Cart',
      subtitle: 'E-Commerce a la Mode',
      description: 'A feature-rich e-commerce platform with smooth checkout flow, inventory management, and payment integration. Seasoned with excellent UX.',
      image: '\uD83D\uDED2',
      ingredients: ['Next.js', 'Stripe', 'Prisma', 'TailwindCSS', 'TypeScript'],
      cookingTime: '4 months',
      difficulty: '\u2605\u2605\u2605\u2605\u2605',
      servings: '50k+ orders',
      tags: ['E-Commerce', 'Payments', 'Full Stack'],
    },
    {
      title: 'Starlink Chat',
      subtitle: 'Communication Flambe',
      description: 'A real-time messaging application with end-to-end encryption, file sharing, and video calls. Communication that travels at light speed.',
      image: '\uD83D\uDCAC',
      ingredients: ['Vue 3', 'Socket.io', 'WebRTC', 'Express', 'MongoDB'],
      cookingTime: '2 months',
      difficulty: '\u2605\u2605\u2605\u2605\u2606',
      servings: '5k+ daily users',
      tags: ['Real-time', 'WebRTC', 'Messaging'],
    },
    {
      title: 'Galaxy Portfolio',
      subtitle: 'Personal Brand Sous Vide',
      description: 'A stunning portfolio template (yes, like this one!) with smooth animations, responsive design, and stellar performance scores.',
      image: '\u2728',
      ingredients: ['SolidJS', 'TypeScript', 'TailwindCSS', 'Vite', 'GSAP'],
      cookingTime: '1 month',
      difficulty: '\u2605\u2605\u2605\u2606\u2606',
      servings: 'Open Source',
      tags: ['Portfolio', 'Animation', 'Performance'],
    },
    {
      title: 'Orbital CMS',
      subtitle: 'Content Management Reduction',
      description: 'A headless CMS with an intuitive admin panel, multi-language support, and lightning-fast API responses. Content that orbits your needs.',
      image: '\uD83D\uDCC1',
      ingredients: ['NestJS', 'GraphQL', 'React Admin', 'PostgreSQL', 'Redis'],
      cookingTime: '5 months',
      difficulty: '\u2605\u2605\u2605\u2605\u2605',
      servings: '100+ sites',
      tags: ['CMS', 'GraphQL', 'Enterprise'],
    },
    {
      title: 'Meteor Tasks',
      subtitle: 'Productivity Braised',
      description: 'A beautiful task management app with drag-and-drop, team collaboration, and AI-powered task suggestions. Productivity that strikes like a meteor.',
      image: '\u2705',
      ingredients: ['React', 'DnD Kit', 'FastAPI', 'OpenAI', 'Supabase'],
      cookingTime: '2 months',
      difficulty: '\u2605\u2605\u2605\u2606\u2606',
      servings: '2k+ teams',
      tags: ['Productivity', 'AI', 'Collaboration'],
    },
  ];

  return (
    <Section
      id="projects"
      title="Signature Recipes"
      subtitle="A collection of my finest creations, each one carefully crafted and tested to perfection"
      dividerIcon="\uD83C\uDF73"
    >
      {/* Recipe Cards Grid */}
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <For each={projects}>
          {(project, index) => (
            <article class="menu-card group hover:border-gold/60 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-gold/10">
              {/* Recipe Image/Icon */}
              <div class="text-center py-8 bg-gradient-to-b from-burgundy/20 to-transparent -mx-6 -mt-6 mb-6 rounded-t-lg">
                <span class="text-6xl group-hover:scale-110 transition-transform duration-300 inline-block">
                  {project.image}
                </span>
              </div>

              {/* Recipe Header */}
              <div class="mb-4">
                <span class="text-gold text-xs uppercase tracking-wider">{project.subtitle}</span>
                <h3 class="font-serif text-xl text-cream group-hover:text-gold transition-colors mt-1">
                  {project.title}
                </h3>
              </div>

              {/* Recipe Description */}
              <p class="text-cream/60 text-sm leading-relaxed mb-4">
                {project.description}
              </p>

              {/* Recipe Meta */}
              <div class="grid grid-cols-3 gap-2 mb-4 py-3 border-y border-gold/20">
                <div class="text-center">
                  <p class="text-gold text-xs uppercase mb-1">Time</p>
                  <p class="text-cream/80 text-sm">{project.cookingTime}</p>
                </div>
                <div class="text-center border-x border-gold/20">
                  <p class="text-gold text-xs uppercase mb-1">Difficulty</p>
                  <p class="text-cream/80 text-xs">{project.difficulty}</p>
                </div>
                <div class="text-center">
                  <p class="text-gold text-xs uppercase mb-1">Servings</p>
                  <p class="text-cream/80 text-sm">{project.servings}</p>
                </div>
              </div>

              {/* Ingredients */}
              <div class="mb-4">
                <p class="text-gold text-xs uppercase mb-2">\uD83E\uDDC2 Ingredients</p>
                <div class="flex flex-wrap gap-1">
                  <For each={project.ingredients}>
                    {(ingredient) => (
                      <span class="text-xs bg-space text-cream/70 px-2 py-1 rounded border border-gold/20">
                        {ingredient}
                      </span>
                    )}
                  </For>
                </div>
              </div>

              {/* Tags */}
              <div class="flex flex-wrap gap-2 mb-6">
                <For each={project.tags}>
                  {(tag) => (
                    <span class="text-xs text-burgundy-light bg-burgundy/20 px-2 py-0.5 rounded-full">
                      #{tag}
                    </span>
                  )}
                </For>
              </div>

              {/* Action Buttons */}
              <div class="flex gap-3">
                <Button variant="outline" size="sm" class="flex-1">
                  <span>\uD83D\uDC40</span>
                  <span>View</span>
                </Button>
                <Button variant="secondary" size="sm" class="flex-1">
                  <span>\uD83D\uDCBB</span>
                  <span>Code</span>
                </Button>
              </div>
            </article>
          )}
        </For>
      </div>

      {/* View All CTA */}
      <div class="text-center mt-12">
        <Button variant="primary" size="lg">
          <span>\uD83D\uDCD6</span>
          <span>View Full Recipe Book</span>
        </Button>
      </div>
    </Section>
  );
};

export default Projects;
