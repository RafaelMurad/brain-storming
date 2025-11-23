import { Component, For } from 'solid-js';

const Footer: Component = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Navigation',
      links: [
        { label: 'Home', href: '#' },
        { label: 'The Chef', href: '#about' },
        { label: 'The Menu', href: '#skills' },
        { label: 'Recipes', href: '#projects' },
        { label: 'Reservations', href: '#contact' },
      ],
    },
    {
      title: 'Services',
      links: [
        { label: 'Frontend Development', href: '#' },
        { label: 'Backend Development', href: '#' },
        { label: 'Full Stack Solutions', href: '#' },
        { label: 'Technical Consulting', href: '#' },
        { label: 'Code Reviews', href: '#' },
      ],
    },
    {
      title: 'Connect',
      links: [
        { label: 'GitHub', href: '#' },
        { label: 'LinkedIn', href: '#' },
        { label: 'Twitter', href: '#' },
        { label: 'Email', href: 'mailto:chef@galacticgourmet.dev' },
        { label: 'Resume', href: '#' },
      ],
    },
  ];

  return (
    <footer class="bg-space-light border-t border-gold/20">
      {/* Main Footer Content */}
      <div class="max-w-6xl mx-auto px-4 py-16">
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div class="lg:col-span-1">
            {/* Logo */}
            <div class="flex items-center gap-3 mb-6">
              <div class="relative w-10 h-10">
                <svg viewBox="0 0 40 40" class="w-full h-full">
                  <path
                    d="M20 0 L23 15 L40 20 L23 25 L20 40 L17 25 L0 20 L17 15 Z"
                    fill="url(#footerStarGradient)"
                  />
                  <circle cx="20" cy="20" r="6" fill="#0a0a12" />
                  <circle cx="20" cy="20" r="2" fill="#d4af37" />
                  <defs>
                    <linearGradient id="footerStarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#e6c65c" />
                      <stop offset="50%" stop-color="#d4af37" />
                      <stop offset="100%" stop-color="#b8942d" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <span class="font-serif text-xl font-bold">
                <span class="text-gradient-gold">Galactic</span>
                <span class="text-cream">Gourmet</span>
              </span>
            </div>

            <p class="text-cream/60 text-sm leading-relaxed mb-6">
              Crafting stellar digital experiences with the precision of a master chef.
              From appetizers to full-course enterprise solutions.
            </p>

            {/* Decorative stars */}
            <div class="flex gap-2">
              <span class="text-gold animate-twinkle">\u2605</span>
              <span class="text-gold/70 animate-twinkle animate-delay-200">\u2605</span>
              <span class="text-gold/50 animate-twinkle animate-delay-500">\u2605</span>
            </div>
          </div>

          {/* Link Columns */}
          <For each={footerLinks}>
            {(column) => (
              <div>
                <h4 class="font-serif text-gold text-lg mb-4 flex items-center gap-2">
                  <span class="text-sm">\u2726</span>
                  {column.title}
                </h4>
                <ul class="space-y-3">
                  <For each={column.links}>
                    {(link) => (
                      <li>
                        <a
                          href={link.href}
                          class="text-cream/60 text-sm hover:text-gold transition-colors duration-300 flex items-center gap-2 group"
                        >
                          <span class="text-gold/0 group-hover:text-gold/50 transition-colors text-xs">
                            \u2192
                          </span>
                          {link.label}
                        </a>
                      </li>
                    )}
                  </For>
                </ul>
              </div>
            )}
          </For>
        </div>
      </div>

      {/* Bottom Bar */}
      <div class="border-t border-gold/10">
        <div class="max-w-6xl mx-auto px-4 py-6">
          <div class="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p class="text-cream/40 text-sm text-center md:text-left">
              <span class="text-gold">\u00A9</span> {currentYear} Galactic Gourmet.
              All recipes reserved.
            </p>

            {/* Tagline */}
            <p class="text-cream/30 text-xs font-serif italic">
              "Serving stellar code across the galaxy"
            </p>

            {/* Made with */}
            <p class="text-cream/40 text-sm flex items-center gap-1">
              Made with <span class="text-burgundy animate-pulse">\u2764</span> and
              <span class="text-gold">\u2728</span> in the cosmos
            </p>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <a
        href="#"
        class="fixed bottom-6 right-6 w-12 h-12 bg-gold text-space rounded-full flex items-center justify-center shadow-lg shadow-gold/30 hover:bg-gold-light transition-all duration-300 hover:-translate-y-1 z-50 group"
        aria-label="Back to top"
      >
        <svg class="w-5 h-5 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </a>
    </footer>
  );
};

export default Footer;
