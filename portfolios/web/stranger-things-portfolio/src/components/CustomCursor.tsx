import { useEffect, useState } from 'react';

export const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [trail, setTrail] = useState<Array<{ x: number; y: number; id: number }>>([]);

  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });

      // Add to trail
      setTrail((prev) => [
        ...prev.slice(-10),
        { x: e.clientX, y: e.clientY, id: Date.now() },
      ]);

      // Check if hovering over clickable element
      const target = e.target as HTMLElement;
      setIsPointer(
        window.getComputedStyle(target).cursor === 'pointer' ||
          target.tagName === 'A' ||
          target.tagName === 'BUTTON'
      );
    };

    window.addEventListener('mousemove', updateCursor);

    return () => {
      window.removeEventListener('mousemove', updateCursor);
    };
  }, []);

  // Clean up old trail points
  useEffect(() => {
    const interval = setInterval(() => {
      setTrail((prev) => prev.filter((point) => Date.now() - point.id < 500));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Trail */}
      {trail.map((point, index) => (
        <div
          key={point.id}
          className="fixed w-2 h-2 rounded-full pointer-events-none z-[10001] mix-blend-screen"
          style={{
            left: point.x,
            top: point.y,
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(circle, rgba(255, 0, 0, ${
              0.5 - index * 0.05
            }) 0%, transparent 70%)`,
            transition: 'opacity 0.5s',
            opacity: 1 - index * 0.1,
          }}
        />
      ))}

      {/* Main cursor */}
      <div
        className="fixed w-6 h-6 rounded-full pointer-events-none z-[10002] mix-blend-screen transition-transform duration-100"
        style={{
          left: position.x,
          top: position.y,
          transform: `translate(-50%, -50%) scale(${isPointer ? 1.5 : 1})`,
          border: '2px solid #FF0000',
          boxShadow: '0 0 10px #FF0000, inset 0 0 10px #FF0000',
        }}
      />

      {/* Outer ring */}
      <div
        className="fixed w-10 h-10 rounded-full pointer-events-none z-[10001] transition-all duration-200"
        style={{
          left: position.x,
          top: position.y,
          transform: `translate(-50%, -50%) scale(${isPointer ? 1.2 : 1})`,
          border: '1px solid rgba(255, 0, 0, 0.3)',
          boxShadow: '0 0 20px rgba(255, 0, 0, 0.2)',
        }}
      />
    </>
  );
};
