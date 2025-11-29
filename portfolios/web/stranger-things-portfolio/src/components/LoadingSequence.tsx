import { useState, useEffect } from 'react';

export const LoadingSequence = ({ onComplete }: { onComplete: () => void }) => {
  const [stage, setStage] = useState(0);
  const [opacity, setOpacity] = useState(1);

  const messages = [
    'INITIALIZING...',
    'ACCESSING UPSIDE DOWN...',
    'LOADING PORTFOLIO...',
    'READY',
  ];

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 800),
      setTimeout(() => setStage(2), 1600),
      setTimeout(() => setStage(3), 2400),
      setTimeout(() => {
        setOpacity(0);
        setTimeout(onComplete, 500);
      }, 3200),
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-[10000] bg-st-deep-black flex items-center justify-center transition-opacity duration-500"
      style={{ opacity }}
    >
      <div className="text-center">
        <div className="mb-8">
          <div className="text-6xl md:text-8xl font-bold neon-red flicker mb-4">
            {messages[stage]}
          </div>
          <div className="flex justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i <= stage ? 'bg-st-red shadow-[0_0_10px_#FF0000]' : 'bg-st-gray-dark'
                }`}
                style={{
                  animation: i <= stage ? 'pulse 1s infinite' : 'none',
                }}
              />
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-64 h-1 bg-st-gray-dark mx-auto">
          <div
            className="h-full bg-st-red shadow-[0_0_10px_#FF0000] transition-all duration-800"
            style={{ width: `${((stage + 1) / 4) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
