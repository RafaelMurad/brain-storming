import { Component, createSignal, onMount, onCleanup } from 'solid-js';

const Header: Component = () => {
  const [scrolled, setScrolled] = createSignal(false);
  const [menuOpen, setMenuOpen] = createSignal(false);

  const navItems = [
    { label: 'ABOUT', href: '#about' },
    { label: 'SKILLS', href: '#skills' },
    { label: 'PROJECTS', href: '#projects' },
    { label: 'CONTACT', href: '#contact' },
  ];

  onMount(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    onCleanup(() => window.removeEventListener('scroll', handleScroll));
  });

  return (
    <header
      class={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled() ? 'bg-cyber-dark/80 backdrop-blur-lg border-b border-white/10' : ''
      }`}
    >
      <nav class="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Logo */}
        <a href="#" class="flex items-center gap-2">
          <span class="text-xl">[</span>
          <span class="font-display font-bold text-xl">NEON</span>
          <span class="font-display font-bold text-xl text-neon-magenta">GRID</span>
          <span class="text-xl">]</span>
        </a>

        {/* Desktop Nav */}
        <div class="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <a
              href={item.href}
              class="font-display text-sm text-gray-400 hover:text-neon-cyan transition-colors relative group"
            >
              {item.label}
              <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-neon-cyan to-neon-magenta transition-all group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          class="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen())}
        >
          <span
            class={`w-6 h-0.5 bg-neon-cyan transition-all ${
              menuOpen() ? 'rotate-45 translate-y-2' : ''
            }`}
          />
          <span
            class={`w-6 h-0.5 bg-neon-cyan transition-all ${
              menuOpen() ? 'opacity-0' : ''
            }`}
          />
          <span
            class={`w-6 h-0.5 bg-neon-cyan transition-all ${
              menuOpen() ? '-rotate-45 -translate-y-2' : ''
            }`}
          />
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        class={`md:hidden fixed inset-0 top-[72px] bg-cyber-dark/95 backdrop-blur-lg transition-all duration-300 ${
          menuOpen() ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div class="flex flex-col items-center justify-center h-full gap-8">
          {navItems.map((item) => (
            <a
              href={item.href}
              class="font-display text-2xl text-white hover:text-neon-cyan"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
