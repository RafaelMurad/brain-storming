import { useEffect, useRef } from 'react';

const PARALLAX_LAYERS = [
  { className: 'parallax-layer parallax-layer--stars', depth: 8 },
  { className: 'parallax-layer parallax-layer--grid', depth: 16 },
];

export const ParallaxBackground = () => {
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;

      layerRefs.current.forEach((layer) => {
        if (!layer) {
          return;
        }

        const depth = Number(layer.dataset.depth ?? 0);
        layer.style.transform = `translate3d(${x * depth}px, ${y * depth}px, 0)`;
      });
    };

    window.addEventListener('pointermove', handlePointerMove);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  return (
    <>
      <div className="parallax-root" aria-hidden="true">
        {PARALLAX_LAYERS.map((layer, index) => (
          <div
            key={layer.className}
            ref={(el) => {
              layerRefs.current[index] = el;
            }}
            className={layer.className}
            data-depth={layer.depth}
          />
        ))}
      </div>

      <div className="parallax-gradient" aria-hidden="true" />
    </>
  );
};
