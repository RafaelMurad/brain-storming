import { Component, createSignal, onMount, onCleanup, For } from 'solid-js';

interface NavLink {
  href: string;
  label: string;
}

const navLinks: NavLink[] = [
  { href: '#about', label: 'Transmission' },
  { href: '#skills', label: 'Frequencies' },
  { href: '#projects', label: 'Artifacts' },
  { href: '#contact', label: 'Beacon' },
];

const Header: Component = () => {
  const [isScrolled, setIsScrolled] = createSignal(false);
  const [isMenuOpen, setIsMenuOpen] = createSignal(false);

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 50);
  };

  onMount(() => {
    window.addEventListener('scroll', handleScroll);
  });

  onCleanup(() => {
    window.removeEventListener('scroll', handleScroll);
  });

  return (
    <header
      class={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled()
          ? 'bg-alien-void/90 backdrop-blur-md border-b border-alien-glow/20'
          : 'bg-transparent'
      }`}
    >
      <nav class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          {/* Logo with UFO */}
          <a href="#" class="flex items-center gap-3 group">
            <div class="relative">
              {/* UFO Icon */}
              <svg
                class="w-10 h-10 text-alien-glow animate-ufo-hover"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* UFO body */}
                <ellipse cx="24" cy="22" rx="18" ry="6" fill="currentColor" opacity="0.3" />
                <ellipse cx="24" cy="20" rx="14" ry="5" fill="currentColor" opacity="0.5" />
                <ellipse cx="24" cy="18" rx="10" ry="4" fill="currentColor" />
                {/* Dome */}
                <path
                  d="M18 18 C18 14 21 11 24 11 C27 11 30 14 30 18"
                  stroke="currentColor"
                  stroke-width="2"
                  fill="none"
                />
                {/* Lights */}
                <circle cx="18" cy="20" r="1.5" fill="currentColor" class="animate-pulse" />
                <circle cx="24" cy="21" r="1.5" fill="currentColor" class="animate-pulse animate-delay-200" />
                <circle cx="30" cy="20" r="1.5" fill="currentColor" class="animate-pulse animate-delay-500" />
                {/* Beam */}
                <path
                  d="M20 24 L16 36 L32 36 L28 24"
                  fill="currentColor"
                  opacity="0.2"
                  class="group-hover:opacity-40 transition-opacity"
                />
              </svg>
            </div>
            <span class="font-display font-bold text-xl text-alien-glow alien-text-glow">
              ASTRAL<span class="text-gray-300">CONTACT</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <div class="hidden md:flex items-center gap-8">
            <For each={navLinks}>
              {(link) => (
                <a
                  href={link.href}
                  class="relative font-mono text-sm text-gray-400 hover:text-alien-glow transition-colors duration-300 group"
                >
                  <span class="relative z-10">{link.label}</span>
                  <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-alien-glow group-hover:w-full transition-all duration-300" />
                </a>
              )}
            </For>

            {/* Signal indicator */}
            <div class="flex items-center gap-2 text-alien-glow/70">
              <div class="flex gap-1">
                <div class="w-1 h-3 bg-alien-glow rounded-full animate-pulse" />
                <div class="w-1 h-4 bg-alien-glow rounded-full animate-pulse animate-delay-100" />
                <div class="w-1 h-2 bg-alien-glow rounded-full animate-pulse animate-delay-200" />
                <div class="w-1 h-5 bg-alien-glow rounded-full animate-pulse animate-delay-300" />
              </div>
              <span class="font-mono text-xs">SIGNAL ACTIVE</span>
            </div>
          </div>

          {/* Mobile UFO Toggle */}
          <button
            class="md:hidden relative w-12 h-12 flex items-center justify-center"
            onClick={() => setIsMenuOpen(!isMenuOpen())}
            aria-label="Toggle menu"
          >
            <div
              class={`transition-transform duration-300 ${
                isMenuOpen() ? 'rotate-180 scale-110' : ''
              }`}
            >
              <svg
                class="w-8 h-8 text-alien-glow"
                viewBox="0 0 32 32"
                fill="none"
              >
                {isMenuOpen() ? (
                  <>
                    <path
                      d="M8 8 L24 24 M24 8 L8 24"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                  </>
                ) : (
                  <>
                    <ellipse cx="16" cy="14" rx="12" ry="4" fill="currentColor" opacity="0.5" />
                    <ellipse cx="16" cy="12" rx="8" ry="3" fill="currentColor" />
                    <path d="M12 16 L10 24 L22 24 L20 16" fill="currentColor" opacity="0.3" />
                  </>
                )}
              </svg>
            </div>
            {/* Pulsing ring */}
            <div class="absolute inset-0 rounded-full border border-alien-glow/30 animate-pulse-glow" />
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          class={`md:hidden absolute left-0 right-0 top-full transition-all duration-300 ${
            isMenuOpen()
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
        >
          <div class="bg-alien-void/95 backdrop-blur-lg border-b border-alien-glow/20 px-6 py-4">
            <For each={navLinks}>
              {(link, index) => (
                <a
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  class="block py-3 font-mono text-gray-400 hover:text-alien-glow transition-colors border-b border-alien-glow/10 last:border-0"
                  style={{ "animation-delay": `${index() * 50}ms` }}
                >
                  <span class="text-alien-glow/50 mr-2">[{String(index()).padStart(2, '0')}]</span>
                  {link.label}
                </a>
              )}
            </For>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
