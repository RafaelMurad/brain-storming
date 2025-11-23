import { Component, For, createSignal, onMount } from 'solid-js';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const footerSections: FooterSection[] = [
  {
    title: 'NAVIGATION',
    links: [
      { label: 'Transmission', href: '#about' },
      { label: 'Frequencies', href: '#skills' },
      { label: 'Artifacts', href: '#projects' },
      { label: 'Beacon', href: '#contact' },
    ],
  },
  {
    title: 'RESOURCES',
    links: [
      { label: 'Documentation', href: '#' },
      { label: 'Source Code', href: '#' },
      { label: 'Changelog', href: '#' },
      { label: 'License', href: '#' },
    ],
  },
  {
    title: 'CONNECT',
    links: [
      { label: 'GitHub', href: '#' },
      { label: 'LinkedIn', href: '#' },
      { label: 'Twitter', href: '#' },
      { label: 'Discord', href: '#' },
    ],
  },
];

const Footer: Component = () => {
  const [currentTime, setCurrentTime] = createSignal(new Date());

  onMount(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  });

  const formatTime = () => {
    return currentTime().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
  };

  return (
    <footer class="relative border-t border-alien-glow/20 bg-alien-void-light/50">
      {/* Decorative top border glow */}
      <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-alien-glow/50 to-transparent" />

      <div class="container mx-auto px-6 py-16">
        {/* Main footer content */}
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand section */}
          <div class="lg:col-span-1">
            <div class="flex items-center gap-3 mb-4">
              {/* Logo */}
              <svg
                class="w-10 h-10 text-alien-glow"
                viewBox="0 0 48 48"
                fill="none"
              >
                <ellipse cx="24" cy="22" rx="18" ry="6" fill="currentColor" opacity="0.3" />
                <ellipse cx="24" cy="20" rx="14" ry="5" fill="currentColor" opacity="0.5" />
                <ellipse cx="24" cy="18" rx="10" ry="4" fill="currentColor" />
                <path d="M18 18 C18 14 21 11 24 11 C27 11 30 14 30 18" stroke="currentColor" stroke-width="2" fill="none" />
                <circle cx="18" cy="20" r="1.5" fill="currentColor" />
                <circle cx="24" cy="21" r="1.5" fill="currentColor" />
                <circle cx="30" cy="20" r="1.5" fill="currentColor" />
              </svg>
              <span class="font-display font-bold text-xl text-alien-glow alien-text-glow">
                ASTRAL<span class="text-gray-300">CONTACT</span>
              </span>
            </div>

            <p class="text-gray-400 text-sm mb-6 max-w-xs">
              Bridging worlds through code. Creating cosmic digital experiences from another dimension.
            </p>

            {/* Signal status */}
            <div class="inline-flex items-center gap-2 bg-alien-void border border-alien-glow/30 rounded-lg px-3 py-2">
              <div class="relative">
                <div class="w-2 h-2 bg-alien-glow rounded-full animate-pulse" />
                <div class="absolute inset-0 w-2 h-2 bg-alien-glow rounded-full animate-ping" />
              </div>
              <span class="font-mono text-xs text-alien-glow">SIGNAL ONLINE</span>
            </div>
          </div>

          {/* Footer sections */}
          <For each={footerSections}>
            {(section) => (
              <div>
                <h4 class="font-mono text-sm text-alien-purple mb-4">{section.title}</h4>
                <ul class="space-y-2">
                  <For each={section.links}>
                    {(link) => (
                      <li>
                        <a
                          href={link.href}
                          class="text-gray-400 hover:text-alien-glow transition-colors text-sm flex items-center gap-2 group"
                        >
                          <span class="w-1 h-1 rounded-full bg-alien-glow/30 group-hover:bg-alien-glow transition-colors" />
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

        {/* System status bar */}
        <div class="alien-card p-4 mb-8">
          <div class="flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <div class="flex items-center gap-6">
              <StatusIndicator label="CORE" status="online" />
              <StatusIndicator label="DATABASE" status="online" />
              <StatusIndicator label="CDN" status="online" />
              <StatusIndicator label="API" status="online" />
            </div>
            <div class="text-gray-500">
              <span class="text-alien-teal">TIMESTAMP:</span> {formatTime()}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div class="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-alien-glow/10">
          <div class="flex items-center gap-4">
            <p class="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} AstralContact. All rights reserved across the multiverse.
            </p>
          </div>

          <div class="flex items-center gap-6">
            <a href="#" class="text-gray-500 hover:text-alien-glow text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" class="text-gray-500 hover:text-alien-glow text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" class="text-gray-500 hover:text-alien-glow text-sm transition-colors">
              Cookie Preferences
            </a>
          </div>
        </div>

        {/* Coordinates */}
        <div class="text-center mt-8">
          <p class="font-mono text-xs text-gray-600">
            SECTOR: EARTH-616 | COORDINATES: 37.7749N, 122.4194W | DIMENSION: PRIME
          </p>
        </div>
      </div>

      {/* Scroll to top button */}
      <ScrollToTop />
    </footer>
  );
};

export default Footer;

// Status Indicator Component
interface StatusIndicatorProps {
  label: string;
  status: 'online' | 'offline' | 'warning';
}

const StatusIndicator: Component<StatusIndicatorProps> = (props) => {
  const statusColors = {
    online: 'bg-alien-glow',
    offline: 'bg-red-500',
    warning: 'bg-yellow-500',
  };

  return (
    <div class="flex items-center gap-2">
      <div class={`w-2 h-2 rounded-full ${statusColors[props.status]} animate-pulse`} />
      <span class="text-gray-400">{props.label}</span>
    </div>
  );
};

// Scroll to Top Component
const ScrollToTop: Component = () => {
  const [isVisible, setIsVisible] = createSignal(false);

  onMount(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      class={`fixed bottom-8 right-8 w-12 h-12 rounded-full bg-alien-glow text-alien-void flex items-center justify-center shadow-glow transition-all duration-300 hover:scale-110 z-50 ${
        isVisible() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      aria-label="Scroll to top"
    >
      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  );
};
