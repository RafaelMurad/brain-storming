import { useState, useEffect } from 'react';

export const Hero = () => {
  const [isFlickering, setIsFlickering] = useState(false);
  const [revealedLetters, setRevealedLetters] = useState(0);

  const name = "YOUR NAME"; // TODO: Replace with actual name
  const subtitle = "Frontend Engineer | TypeScript Specialist";

  // Letter-by-letter reveal effect on mount
  useEffect(() => {
    const interval = setInterval(() => {
      setRevealedLetters((prev) => {
        if (prev >= name.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [name.length]);

  // Random flicker effect
  useEffect(() => {
    const flicker = setInterval(() => {
      setIsFlickering(true);
      setTimeout(() => setIsFlickering(false), 100);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(flicker);
  }, []);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 relative">
      {/* Hero content */}
      <div className="text-center max-w-4xl mx-auto">
        {/* Main title with neon effect */}
        <h1
          className={`text-6xl md:text-8xl lg:text-9xl font-bold mb-8 neon-red ${
            isFlickering ? 'opacity-80' : 'opacity-100'
          } transition-opacity duration-75`}
          style={{
            fontFamily: "'Courier New', Courier, monospace",
            letterSpacing: '0.1em',
          }}
        >
          {name.split('').map((letter, index) => (
            <span
              key={index}
              style={{
                opacity: index < revealedLetters ? 1 : 0,
                animation: index < revealedLetters ? `letterReveal 0.3s ease-out ${index * 0.1}s forwards` : 'none',
              }}
            >
              {letter}
            </span>
          ))}
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-light mb-12 font-mono">
          {subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#projects"
            className="neon-border-red px-8 py-4 text-st-red font-bold uppercase tracking-wider hover:bg-st-red hover:bg-opacity-10 transition-all duration-300"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="border border-st-gray-mid px-8 py-4 text-st-gray-light font-bold uppercase tracking-wider hover:border-st-red hover:text-st-red transition-all duration-300"
          >
            Get In Touch
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-st-red rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-st-red rounded-full glow-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
