import { Component, For } from 'solid-js';
import Section from './Section';

interface MenuItem {
  name: string;
  description: string;
  price: string;
  tags?: string[];
}

interface MenuCategory {
  title: string;
  icon: string;
  subtitle: string;
  items: MenuItem[];
}

const Skills: Component = () => {
  const menuCategories: MenuCategory[] = [
    {
      title: 'Appetizers',
      icon: '\uD83E\uDD57',
      subtitle: 'Frontend Delights',
      items: [
        {
          name: 'React Carpaccio',
          description: 'Thinly sliced components with hooks and context reduction',
          price: '\u2605\u2605\u2605\u2605\u2605',
          tags: ['React', 'Redux', 'Hooks'],
        },
        {
          name: 'Vue Spring Rolls',
          description: 'Fresh, light, and perfectly wrapped reactive data',
          price: '\u2605\u2605\u2605\u2605',
          tags: ['Vue 3', 'Pinia', 'Composition API'],
        },
        {
          name: 'Solid Bruschetta',
          description: 'Fine-grained reactivity on a crispy TypeScript base',
          price: '\u2605\u2605\u2605\u2605\u2605',
          tags: ['SolidJS', 'Signals', 'TypeScript'],
        },
        {
          name: 'Tailwind Tapas',
          description: 'Utility-first styling bites, perfectly seasoned',
          price: '\u2605\u2605\u2605\u2605\u2605',
          tags: ['Tailwind CSS', 'CSS3', 'Animations'],
        },
      ],
    },
    {
      title: 'Main Course',
      icon: '\uD83C\uDF56',
      subtitle: 'Backend Entrees',
      items: [
        {
          name: 'Node.js Prime Rib',
          description: 'Slow-cooked event-driven architecture, juicy async/await',
          price: '\u2605\u2605\u2605\u2605\u2605',
          tags: ['Node.js', 'Express', 'NestJS'],
        },
        {
          name: 'Python Coq au Vin',
          description: 'Classic elegance braised in Django and Flask',
          price: '\u2605\u2605\u2605\u2605',
          tags: ['Python', 'Django', 'FastAPI'],
        },
        {
          name: 'PostgreSQL Risotto',
          description: 'Creamy data consistency, perfectly al dente queries',
          price: '\u2605\u2605\u2605\u2605\u2605',
          tags: ['PostgreSQL', 'MongoDB', 'Redis'],
        },
        {
          name: 'GraphQL Wellington',
          description: 'Wrapped in schemas, served with resolvers',
          price: '\u2605\u2605\u2605\u2605',
          tags: ['GraphQL', 'Apollo', 'REST APIs'],
        },
      ],
    },
    {
      title: 'Sides',
      icon: '\uD83C\uDF5F',
      subtitle: 'DevOps & Tools',
      items: [
        {
          name: 'Docker Fries',
          description: 'Containerized, crispy, consistent every time',
          price: '\u2605\u2605\u2605\u2605\u2605',
          tags: ['Docker', 'Kubernetes', 'CI/CD'],
        },
        {
          name: 'Git Slaw',
          description: 'Fresh version control, perfectly branched',
          price: '\u2605\u2605\u2605\u2605\u2605',
          tags: ['Git', 'GitHub', 'GitLab'],
        },
        {
          name: 'AWS Cloud Bread',
          description: 'Light, fluffy, infinitely scalable infrastructure',
          price: '\u2605\u2605\u2605\u2605',
          tags: ['AWS', 'Vercel', 'Netlify'],
        },
      ],
    },
    {
      title: 'Desserts',
      icon: '\uD83C\uDF70',
      subtitle: 'Sweet Extras',
      items: [
        {
          name: 'Testing Tiramisu',
          description: 'Layers of unit, integration, and E2E coverage',
          price: '\u2605\u2605\u2605\u2605',
          tags: ['Jest', 'Cypress', 'Vitest'],
        },
        {
          name: 'UI/UX Souffle',
          description: 'Delicate, user-centered design that rises to the occasion',
          price: '\u2605\u2605\u2605\u2605\u2605',
          tags: ['Figma', 'Adobe XD', 'Prototyping'],
        },
        {
          name: 'Agile Affogato',
          description: 'Espresso shots of sprints drowned in methodology',
          price: '\u2605\u2605\u2605\u2605',
          tags: ['Scrum', 'Kanban', 'Jira'],
        },
      ],
    },
  ];

  return (
    <Section
      id="skills"
      title="The Menu"
      subtitle="A carefully curated selection of technical specialties, prepared with years of expertise"
      dividerIcon="\uD83D\uDCD6"
    >
      {/* Menu Header */}
      <div class="text-center mb-12">
        <div class="inline-block border-2 border-gold/40 rounded-lg px-8 py-4 bg-space-light/50">
          <p class="font-serif italic text-gold text-lg">\u2726 Chef's Tasting Menu \u2726</p>
          <p class="text-cream/50 text-sm mt-1">All dishes prepared with fresh, modern ingredients</p>
        </div>
      </div>

      {/* Menu Categories */}
      <div class="grid md:grid-cols-2 gap-8">
        <For each={menuCategories}>
          {(category) => (
            <div class="menu-card">
              {/* Category Header */}
              <div class="flex items-center gap-3 mb-6 pb-4 border-b border-gold/30">
                <span class="text-4xl">{category.icon}</span>
                <div>
                  <h3 class="font-serif text-2xl text-gold">{category.title}</h3>
                  <p class="text-cream/50 text-sm italic">{category.subtitle}</p>
                </div>
              </div>

              {/* Menu Items */}
              <div class="space-y-6">
                <For each={category.items}>
                  {(item) => (
                    <div class="group">
                      {/* Item Header */}
                      <div class="flex justify-between items-start mb-1">
                        <h4 class="font-serif text-lg text-cream group-hover:text-gold transition-colors">
                          <span class="text-gold text-sm mr-2">\u2605</span>
                          {item.name}
                        </h4>
                        <span class="text-gold text-sm tracking-wider">{item.price}</span>
                      </div>

                      {/* Item Description */}
                      <p class="text-cream/60 text-sm italic mb-2 pl-5">
                        {item.description}
                      </p>

                      {/* Tags */}
                      {item.tags && (
                        <div class="flex flex-wrap gap-2 pl-5">
                          <For each={item.tags}>
                            {(tag) => (
                              <span class="text-xs bg-burgundy/30 text-cream/70 px-2 py-0.5 rounded border border-burgundy/50">
                                {tag}
                              </span>
                            )}
                          </For>
                        </div>
                      )}
                    </div>
                  )}
                </For>
              </div>
            </div>
          )}
        </For>
      </div>

      {/* Chef's Note */}
      <div class="mt-12 text-center">
        <div class="inline-block glass-card px-8 py-6 max-w-2xl">
          <p class="font-serif italic text-cream/70">
            <span class="text-gold text-xl">\u2726</span>
            {' '}All dishes can be customized to your project's dietary requirements.
            Ask your server about our seasonal specials and enterprise tasting menus.{' '}
            <span class="text-gold text-xl">\u2726</span>
          </p>
        </div>
      </div>
    </Section>
  );
};

export default Skills;
