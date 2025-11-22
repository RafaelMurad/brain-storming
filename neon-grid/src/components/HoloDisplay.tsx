import { Component } from 'solid-js';

const HoloDisplay: Component = () => {
  return (
    <div class="relative w-72 h-72 md:w-80 md:h-80">
      {/* Rings */}
      <div class="absolute top-1/2 left-1/2 w-48 h-48 border-2 border-neon-cyan rounded-full animate-holo-spin" style="animation-duration: 8s;" />
      <div class="absolute top-1/2 left-1/2 w-60 h-60 border-2 border-neon-magenta rounded-full animate-holo-spin" style="animation-duration: 12s; animation-direction: reverse;" />
      <div class="absolute top-1/2 left-1/2 w-72 h-72 border-2 border-neon-yellow/50 rounded-full animate-holo-spin" style="animation-duration: 15s;" />

      {/* Core */}
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-neon-cyan/20 animate-pulse" />
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-neon-cyan to-neon-magenta animate-glow-pulse" />
    </div>
  );
};

export default HoloDisplay;
