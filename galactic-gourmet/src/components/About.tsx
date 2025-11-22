import { Component, For } from 'solid-js';
import Section from './Section';

const About: Component = () => {
  const philosophyItems = [
    {
      icon: '\uD83C\uDF1F',
      title: 'Fresh Ingredients',
      description: 'Using cutting-edge technologies and modern frameworks to create crisp, clean code.',
    },
    {
      icon: '\uD83D\uDD25',
      title: 'Passion & Heat',
      description: 'Bringing intense dedication and fiery creativity to every project I touch.',
    },
    {
      icon: '\u2696\uFE0F',
      title: 'Perfect Balance',
      description: 'Harmonizing aesthetics with functionality, like balancing flavors in a signature dish.',
    },
    {
      icon: '\u2728',
      title: 'Stellar Presentation',
      description: 'Because we eat with our eyes first - pixel-perfect interfaces that delight users.',
    },
  ];

  const stats = [
    { value: '5+', label: 'Years of Experience', icon: '\uD83D\uDCC5' },
    { value: '50+', label: 'Projects Delivered', icon: '\uD83D\uDE80' },
    { value: '100%', label: 'Client Satisfaction', icon: '\u2B50' },
    { value: '24/7', label: 'Support Available', icon: '\uD83D\uDCAC' },
  ];

  return (
    <Section
      id="about"
      title="The Chef"
      subtitle="Behind every great dish is a passionate chef. Behind every great application is a dedicated developer."
      dividerIcon="\uD83D\uDC68\u200D\uD83C\uDF73"
    >
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Column - Bio */}
        <div class="space-y-6">
          <div class="glass-card p-8 relative">
            {/* Decorative quote marks */}
            <span class="absolute -top-4 -left-2 text-gold/30 text-6xl font-serif">"</span>

            <p class="text-cream/90 text-lg leading-relaxed mb-4 relative z-10">
              Welcome to my cosmic kitchen! I'm a <span class="text-gold font-semibold">full-stack developer</span> who
              approaches code like a master chef approaches cuisine - with precision, creativity, and an
              unwavering commitment to excellence.
            </p>
            <p class="text-cream/70 leading-relaxed mb-4">
              Just as a chef carefully selects ingredients and techniques, I meticulously choose the right
              technologies and architectures for each project. From the <span class="text-gold">sizzling frontend</span> to
              the <span class="text-burgundy-light">simmering backend</span>, every layer is crafted with care.
            </p>
            <p class="text-cream/70 leading-relaxed">
              My kitchen spans the entire development galaxy - from responsive interfaces that adapt like
              the perfect sauce, to robust APIs that serve data like a well-orchestrated tasting menu.
            </p>

            <span class="absolute -bottom-4 -right-2 text-gold/30 text-6xl font-serif rotate-180">"</span>
          </div>

          {/* Stats */}
          <div class="grid grid-cols-2 gap-4">
            <For each={stats}>
              {(stat) => (
                <div class="menu-card text-center group hover:border-gold/60 transition-all duration-300">
                  <span class="text-2xl mb-2 block group-hover:scale-110 transition-transform">{stat.icon}</span>
                  <div class="text-2xl font-bold text-gold mb-1">{stat.value}</div>
                  <div class="text-cream/60 text-sm">{stat.label}</div>
                </div>
              )}
            </For>
          </div>
        </div>

        {/* Right Column - Philosophy */}
        <div class="space-y-6">
          <h3 class="font-serif text-2xl text-gold text-center lg:text-left mb-8">
            \uD83C\uDF7D\uFE0F Culinary Philosophy
          </h3>

          <div class="space-y-4">
            <For each={philosophyItems}>
              {(item, index) => (
                <div
                  class="glass-card p-6 flex gap-4 items-start group hover:border-gold/40 transition-all duration-300 hover:translate-x-2"
                  style={{ 'animation-delay': `${index() * 100}ms` }}
                >
                  <span class="text-3xl group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </span>
                  <div>
                    <h4 class="font-serif text-lg text-gold mb-2">{item.title}</h4>
                    <p class="text-cream/70 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              )}
            </For>
          </div>

          {/* Signature */}
          <div class="text-center lg:text-right pt-4">
            <p class="font-serif italic text-cream/50 text-sm">
              "Every line of code is a step in the recipe for success"
            </p>
            <p class="text-gold font-serif text-lg mt-2">- The Galactic Chef</p>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default About;
