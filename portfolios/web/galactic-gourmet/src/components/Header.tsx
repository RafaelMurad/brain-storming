import { Component, createSignal, onMount } from 'solid-js';

const Header: Component = () => {
  const [isScrolled, setIsScrolled] = createSignal(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = createSignal(false);

  onMount(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  const navLinks = [
    { href: '#about', label: 'The Chef' },
    { href: '#skills', label: 'The Menu' },
    { href: '#projects', label: 'Recipes' },
    { href: '#contact', label: 'Reservations' },
  ];

  return (
    <header
      class={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled()
          ? 'bg-space/95 backdrop-blur-md shadow-lg shadow-gold/5 py-3'
          : 'bg-transparent py-6'
      }`}
    >
      <nav class="max-w-6xl mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <a href="#" class="flex items-center gap-3 group">
          {/* Star Logo */}
          <div class="relative w-10 h-10">
            <svg
              viewBox="0 0 40 40"
              class="w-full h-full transition-transform duration-500 group-hover:rotate-180"
            >
              {/* Outer star */}
              <path
                d="M20 0 L23 15 L40 20 L23 25 L20 40 L17 25 L0 20 L17 15 Z"
                fill="url(#starGradient)"
                class="drop-shadow-lg"
              />
              {/* Inner circle */}
              <circle cx="20" cy="20" r="6" fill="#0a0a12" />
              {/* Center dot */}
              <circle cx="20" cy="20" r="2" fill="#d4af37" />
              <defs>
                <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
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
        </a>

        {/* Desktop Navigation */}
        <ul class="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li>
              <a
                href={link.href}
                class="relative font-sans text-sm uppercase tracking-wider text-cream/80 hover:text-gold transition-colors duration-300 py-2 group"
              >
                {link.label}
                <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-gold to-gold-light group-hover:w-full transition-all duration-300" />
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button
          class="md:hidden text-cream hover:text-gold transition-colors p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen())}
          aria-label="Toggle menu"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen() ? (
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        class={`md:hidden absolute top-full left-0 right-0 bg-space-light/98 backdrop-blur-md border-t border-gold/20 transition-all duration-300 ${
          isMobileMenuOpen() ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <ul class="flex flex-col p-4">
          {navLinks.map((link) => (
            <li>
              <a
                href={link.href}
                class="block py-3 px-4 font-sans text-sm uppercase tracking-wider text-cream/80 hover:text-gold hover:bg-gold/5 transition-all duration-300 rounded"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span class="text-gold mr-2">\u2726</span>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
};

export default Header;
