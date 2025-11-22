import { Component, createSignal, onMount, onCleanup } from 'solid-js';

const GridBackground: Component = () => {
  let containerRef: HTMLDivElement | undefined;

  const createGlitchLine = () => {
    if (!containerRef) return;

    const line = document.createElement('div');
    line.className = 'absolute w-full h-0.5 pointer-events-none';
    line.style.top = `${Math.random() * 100}%`;
    line.style.background = Math.random() > 0.5
      ? 'linear-gradient(90deg, transparent, rgba(0, 255, 249, 0.5), transparent)'
      : 'linear-gradient(90deg, transparent, rgba(255, 0, 255, 0.5), transparent)';
    line.style.animation = 'glitch-line 0.3s ease-out forwards';

    containerRef.appendChild(line);
    setTimeout(() => line.remove(), 300);
  };

  onMount(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.95) createGlitchLine();
    }, 100);

    onCleanup(() => clearInterval(interval));
  });

  return (
    <>
      <div class="grid-bg" />
      <div ref={containerRef} class="fixed inset-0 pointer-events-none z-50 overflow-hidden" />
      <style>{`
        @keyframes glitch-line {
          0% { transform: translateX(-100%); opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
      `}</style>
    </>
  );
};

export default GridBackground;
