const terminalLog = [
  '> INITIALIZING SECURE CONNECTION…',
  '> DECRYPTING PERSONNEL FILE…',
  '> STATUS: [ ACCESS GRANTED ]',
];

const heroHighlights = [
  { label: 'Years experience', value: '4+' },
  { label: 'Core stack', value: 'TypeScript · React' },
  { label: 'Current location', value: 'Portugal · Remote' },
];

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-24 md:py-32 overflow-hidden bg-gradient-to-b from-bg-void via-bg-primary to-bg-void">
      <span className="sr-only">Rafael Murad · Senior Frontend Engineer Portfolio</span>

      {/* Ambient grid + glow */}
      <div className="hero-grid" aria-hidden="true" />
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="hero-light-beam hidden lg:block" style={{ left: '12%' }} />
        <div className="hero-light-beam hidden lg:block" style={{ right: '14%', animationDelay: '6s' }} />
        <div className="hero-radial-glow absolute inset-0" />
      </div>

      <div className="relative z-10 max-w-5xl w-full mx-auto space-y-10">
        {/* Classification banner */}
        <div>
          <div className="classified-header px-5 py-3 border border-st-yellow-classified/40 bg-st-yellow-classified/5 text-center">
            <p className="text-xs md:text-sm font-mono tracking-[0.35em] text-st-yellow-classified uppercase">
              [ CLEARANCE LEVEL 4 REQUIRED ]
            </p>
          </div>
        </div>

        {/* Terminal intro */}
        <div className="space-y-1 font-mono text-xs md:text-sm text-text-secondary">
          {terminalLog.map((line) => (
            <p key={line} className="tracking-[0.2em] text-left">
              {line}
            </p>
          ))}
        </div>

        {/* Primary identity */}
        <div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-[0.2em] uppercase text-st-red-primary font-benguiat leading-tight">
            <span className="block hero-title-highlight">Rafael</span>
            <span className="block hero-title-highlight">Murad</span>
          </h1>
          <div className="mt-6 space-y-3">
            <p className="text-2xl md:text-3xl font-sans text-text-primary">Senior Frontend Engineer</p>
            <p className="text-lg md:text-xl font-mono text-text-secondary tracking-[0.25em] uppercase">
              TypeScript · React · Scalable Systems
            </p>
          </div>
        </div>

        {/* Availability badge */}
        <div className="inline-flex items-center gap-3 px-5 py-3 bg-st-green-terminal/10 border border-st-green-terminal/50 backdrop-blur-sm shadow-glow-green-subtle">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-st-green-terminal opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-st-green-terminal" />
          </span>
          <span className="text-st-green-terminal font-mono text-sm tracking-[0.3em] uppercase phosphor-text">
            Available for hire
          </span>
        </div>

        {/* Highlights */}
        <div className="grid gap-4 sm:grid-cols-3">
          {heroHighlights.map((highlight) => (
            <div key={highlight.label} className="p-4 border border-text-dim/40 bg-bg-elevated/40 backdrop-blur-sm shadow-card">
              <p className="text-xs font-mono text-text-tertiary tracking-[0.35em] uppercase mb-2">
                {highlight.label}
              </p>
              <p className="text-lg font-semibold text-text-primary">
                {highlight.value}
              </p>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4">
          <a
            href="#projects"
            className="group relative px-8 py-4 bg-st-red-primary text-white font-mono text-sm tracking-[0.3em] uppercase border border-st-red-primary shadow-glow-red overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent translate-y-[-120%] group-hover:translate-y-[120%] transition-transform duration-700" aria-hidden="true" />
            <span className="relative flex items-center gap-2">
              Access case files
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m0 0-6-6m6 6-6 6" />
              </svg>
            </span>
          </a>
          <a
            href="#contact"
            className="group relative px-8 py-4 text-st-green-terminal font-mono text-sm tracking-[0.3em] uppercase border border-st-green-terminal/60 hover:bg-st-green-terminal/10 transition-all duration-300 hover:shadow-glow-green"
          >
            <span className="relative flex items-center gap-2">
              Establish contact
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m0 0 6-6m-6 6-6-6" />
              </svg>
            </span>
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center">
        <div className="flex flex-col items-center gap-3 text-text-tertiary/80">
          <span className="text-xs font-mono tracking-[0.4em] uppercase">Scroll to continue</span>
          <div className="hero-scroll-indicator">
            <span className="hero-scroll-indicator__dot" />
          </div>
        </div>
      </div>
    </section>
  );
};
