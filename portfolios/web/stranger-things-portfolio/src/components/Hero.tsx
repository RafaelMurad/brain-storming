import { useState, useEffect } from 'react';

export const Hero = () => {
  const [isFlickering, setIsFlickering] = useState(false);
  const [revealedLetters, setRevealedLetters] = useState(0);
  const [showTitle, setShowTitle] = useState(false);

  const name = "RAFAEL MURAD";
  const subtitle = ">> Frontend Engineer | TypeScript Specialist | React Expert";
  const tagline = "[ ENTERING THE UPSIDE DOWN ]";

  // Dramatic entrance
  useEffect(() => {
    setTimeout(() => setShowTitle(true), 500);
  }, []);

  // Letter-by-letter reveal effect
  useEffect(() => {
    if (!showTitle) return;

    const interval = setInterval(() => {
      setRevealedLetters((prev) => {
        if (prev >= name.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [showTitle, name.length]);

  // Intense flicker effect
  useEffect(() => {
    const flicker = setInterval(() => {
      setIsFlickering(true);
      setTimeout(() => setIsFlickering(false), 50);
    }, 2000 + Math.random() * 3000);

    return () => clearInterval(flicker);
  }, []);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[600px] h-[600px] bg-st-red opacity-20 blur-[120px] animate-pulse"></div>
      </div>

      {/* Hero content */}
      <div className="text-center max-w-5xl mx-auto relative z-10">
        {/* Tagline */}
        <div className={`mb-8 transition-all duration-1000 ${showTitle ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-st-neon-cyan text-sm md:text-base font-mono tracking-[0.3em] animate-pulse">
            {tagline}
          </p>
        </div>

        {/* Main title with intense neon effect */}
        <h1
          className={`text-6xl md:text-8xl lg:text-9xl font-bold mb-6 neon-red crt-screen ${
            isFlickering ? 'opacity-60' : 'opacity-100'
          } transition-opacity duration-75`}
          style={{
            fontFamily: "'Courier New', Courier, monospace",
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
        >
          {name.split('').map((letter, index) => (
            <span
              key={index}
              className="inline-block"
              style={{
                opacity: index < revealedLetters ? 1 : 0,
                transform: index < revealedLetters ? 'translateY(0)' : 'translateY(20px)',
                animation: index < revealedLetters ? `letterReveal 0.4s ease-out ${index * 0.08}s forwards` : 'none',
              }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </span>
          ))}
        </h1>

        {/* Subtitle with terminal-style cursor */}
        <div className={`mb-12 transition-all duration-1000 delay-500 ${revealedLetters >= name.length ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-lg md:text-2xl text-st-neon-pink font-mono mb-2">
            {subtitle}
          </p>
          <div className="flex items-center justify-center gap-2 text-st-gray-light">
            <span className="text-sm md:text-base font-mono">AVAILABLE FOR HIRE</span>
            <span className="inline-block w-2 h-4 bg-st-red animate-pulse"></span>
          </div>
        </div>

        {/* CTA Buttons with glow */}
        <div className={`flex flex-col sm:flex-row gap-6 justify-center mb-16 transition-all duration-1000 delay-700 ${revealedLetters >= name.length ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <a
            href="#projects"
            className="group neon-border-red px-10 py-5 text-st-red font-bold uppercase tracking-wider bg-st-deep-black backdrop-blur-sm relative overflow-hidden"
            data-text="View Projects"
          >
            <span className="relative z-10">⚡ View Projects</span>
            <div className="absolute inset-0 bg-st-red opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          </a>
          <a
            href="#contact"
            className="group border-2 border-st-neon-cyan px-10 py-5 text-st-neon-cyan font-bold uppercase tracking-wider hover:bg-st-neon-cyan hover:text-st-deep-black transition-all duration-300 backdrop-blur-sm"
          >
            <span>📡 Contact Me</span>
          </a>
        </div>

        {/* Scroll indicator with enhanced glow */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center gap-2">
            <span className="text-st-gray-mid text-xs font-mono tracking-wider">SCROLL DOWN</span>
            <div className="w-6 h-10 border-2 border-st-red rounded-full flex items-start justify-center p-2 shadow-[0_0_20px_rgba(255,0,0,0.5)]">
              <div className="w-1.5 h-3 bg-st-red rounded-full glow-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
