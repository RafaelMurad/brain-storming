import { Component } from 'solid-js';

const Terminal: Component = () => {
  return (
    <div class="bg-cyber-card border border-white/10 rounded-lg overflow-hidden">
      {/* Header */}
      <div class="flex items-center gap-2 px-4 py-3 bg-black/30 border-b border-white/10">
        <span class="w-3 h-3 rounded-full bg-red-500" />
        <span class="w-3 h-3 rounded-full bg-yellow-500" />
        <span class="w-3 h-3 rounded-full bg-green-500" />
        <span class="ml-auto text-xs text-gray-500 font-mono">profile.exe</span>
      </div>

      {/* Body */}
      <div class="p-5 font-mono text-sm space-y-4">
        <div>
          <p class="text-white"><span class="text-neon-cyan">$</span> cat about.txt</p>
          <p class="text-gray-400 mt-2 pl-4">
            A passionate developer navigating the digital frontier.
            Specialized in crafting high-performance applications
            and immersive user experiences.
          </p>
        </div>

        <div>
          <p class="text-white"><span class="text-neon-cyan">$</span> skills --list</p>
          <div class="text-gray-400 mt-2 pl-4 space-y-1">
            <p><span class="text-neon-cyan">[FRONTEND]</span> React, Vue, TypeScript, WebGL</p>
            <p><span class="text-neon-cyan">[BACKEND]</span> Node.js, Python, Go, Rust</p>
            <p><span class="text-neon-cyan">[DATABASE]</span> PostgreSQL, MongoDB, Redis</p>
            <p><span class="text-neon-cyan">[DEVOPS]</span> Docker, K8s, AWS, CI/CD</p>
          </div>
        </div>

        <p class="text-white"><span class="text-neon-cyan">$</span> <span class="animate-pulse">_</span></p>
      </div>
    </div>
  );
};

export default Terminal;
