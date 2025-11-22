import { Component } from 'solid-js';

const Footer: Component = () => {
  return (
    <footer class="py-12 border-t border-white/10">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div class="flex items-center gap-2">
            <span>[</span>
            <span class="font-display font-bold">NEON</span>
            <span class="font-display font-bold text-neon-magenta">GRID</span>
            <span>]</span>
          </div>

          <p class="text-gray-500 text-sm">Designed & Developed in the Digital Frontier</p>

          <p class="text-gray-600 text-sm">
            © {new Date().getFullYear()} NeonGrid. All systems operational.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
