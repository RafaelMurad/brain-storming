import { useState, useEffect } from 'react';

export const About = () => {
  const [typedLines, setTypedLines] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTypedLines(4);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const lines = [
    {
      prefix: '>>',
      text: 'SUBJECT: RAFAEL MURAD',
      color: 'text-st-red',
      glow: true,
    },
    {
      prefix: '>>',
      text: 'CLASSIFICATION: Frontend Engineer',
      color: 'text-st-neon-pink',
      glow: false,
    },
    {
      prefix: '>>',
      text: 'SPECIALIZATION: TypeScript • React • Modern Web Architecture',
      color: 'text-st-neon-cyan',
      glow: false,
    },
    {
      prefix: '>>',
      text: 'STATUS: Available for hire • Remote • Contract work',
      color: 'text-st-red',
      glow: true,
    },
  ];

  return (
    <section id="about" className="min-h-screen flex items-center justify-center px-4 py-20 relative">
      {/* Background accent */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <div className="w-[800px] h-[800px] bg-st-neon-pink blur-[150px]"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section header - Hawkins Lab style */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-st-red text-2xl animate-pulse">⬢</div>
            <h2 className="text-4xl md:text-6xl font-bold neon-red-subtle tracking-wider">
              {'[ PROFILE ACCESSED ]'}
            </h2>
          </div>
          <div className="h-0.5 w-full bg-gradient-to-r from-st-red via-st-red to-transparent shadow-[0_0_10px_#FF0000]"></div>
        </div>

        {/* Hawkins Lab Terminal */}
        <div className="neon-border-red bg-st-deep-black bg-opacity-80 backdrop-blur-md relative">
          {/* Terminal header */}
          <div className="border-b-2 border-st-red px-6 py-3 bg-st-red bg-opacity-5">
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-st-red shadow-[0_0_10px_#FF0000] animate-pulse"></div>
                <div className="w-3 h-3 rounded-full bg-st-neon-cyan shadow-[0_0_10px_#00F0FF]"></div>
                <div className="w-3 h-3 rounded-full bg-st-neon-pink shadow-[0_0_10px_#FF006E]"></div>
              </div>
              <span className="text-st-gray-light font-mono text-xs tracking-wider">
                HAWKINS_LAB_TERMINAL_v1.983
              </span>
            </div>
          </div>

          {/* Terminal content */}
          <div className="p-8 font-mono text-sm md:text-base space-y-4">
            {/* System initialization */}
            <div className="text-st-gray-mid mb-6">
              <p>{'> INITIALIZING PROFILE SCAN...'}</p>
              <p className="flex items-center gap-2">
                {'> STATUS: '}
                <span className="text-st-neon-cyan">[ COMPLETE ]</span>
              </p>
              <div className="h-px w-full bg-st-gray-dark my-4"></div>
            </div>

            {/* Profile data */}
            {lines.map((line, index) => (
              <div
                key={index}
                className={`transition-all duration-500 ${
                  index < typedLines ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <p className={`${line.color} leading-relaxed flex items-start gap-3`}>
                  <span className={`${line.glow ? 'text-st-red' : 'text-st-gray-mid'} font-bold`}>
                    {line.prefix}
                  </span>
                  <span className={line.glow ? 'drop-shadow-[0_0_8px_rgba(255,0,0,0.8)]' : ''}>
                    {line.text}
                  </span>
                </p>
              </div>
            ))}

            <div className="h-px w-full bg-st-gray-dark my-6"></div>

            {/* Bio data */}
            <div className="space-y-3 text-st-gray-light">
              <p className="leading-relaxed">
                <span className="text-st-red font-bold">{'▸'}</span> Senior Frontend Engineer with <span className="text-st-neon-pink font-bold">4+ years</span> of experience building production-grade web applications at scale.
              </p>

              <p className="leading-relaxed">
                <span className="text-st-red font-bold">{'▸'}</span> Previously at <span className="text-st-neon-cyan font-bold">Just Eat Takeaway</span>, developed date-time picker components and scheduled fulfilment systems serving <span className="text-st-neon-pink font-bold">millions of users</span> across European markets.
              </p>

              <p className="leading-relaxed">
                <span className="text-st-red font-bold">{'▸'}</span> Expert in TypeScript monorepo architecture, state management, and building accessible, performant React applications with comprehensive test coverage.
              </p>

              <p className="leading-relaxed">
                <span className="text-st-red font-bold">{'▸'}</span> Currently building <span className="text-st-neon-cyan font-bold">WhatsApp reminder applications</span> and exploring cutting-edge web technologies.
              </p>
            </div>

            {/* Blinking cursor */}
            <div className="flex items-center gap-1 mt-6">
              <span className="text-st-red">{'>'}</span>
              <div className="inline-block w-2 h-4 bg-st-red animate-pulse shadow-[0_0_10px_#FF0000]"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
