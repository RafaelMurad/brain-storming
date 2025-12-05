import { useState, useEffect } from 'react';
import { Section, SectionHeader, TerminalWindow, GlowDivider } from './ui';

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
    <Section id="about" backgroundAccent="pink">
      {/* Section header */}
      <SectionHeader title="[ PROFILE ACCESSED ]" icon="⬢" />

      {/* Hawkins Lab Terminal */}
      <TerminalWindow>
        {/* System initialization */}
        <div className="text-st-gray-mid mb-8 text-lg">
          <p className="mb-2">{'> INITIALIZING PROFILE SCAN...'}</p>
          <p className="flex items-center gap-3">
            {'> STATUS: '}
            <span className="text-st-neon-cyan font-medium">[ COMPLETE ]</span>
          </p>
          <GlowDivider variant="gray" className="my-6" />
        </div>

        {/* Profile data */}
        <div className="space-y-6">
          {lines.map((line, index) => (
            <div
              key={index}
              className={`transition-all duration-500 ${
                index < typedLines ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <p className={`${line.color} text-lg md:text-xl leading-relaxed flex items-start gap-4`}>
                <span className={`${line.glow ? 'text-st-red' : 'text-st-gray-mid'} font-bold`}>
                  {line.prefix}
                </span>
                <span className={line.glow ? 'drop-shadow-[0_0_8px_rgba(255,0,0,0.8)]' : ''}>
                  {line.text}
                </span>
              </p>
            </div>
          ))}
        </div>

        <GlowDivider variant="gray" className="my-10" />

        {/* Bio data */}
        <div className="space-y-6 text-st-gray-light">
          <p className="text-lg md:text-xl leading-loose">
            <span className="text-st-red font-bold mr-3" aria-hidden="true">{'▸'}</span>
            Senior Frontend Engineer with <span className="text-st-neon-pink font-bold">4+ years</span> of experience building production-grade web applications at scale.
          </p>

          <p className="text-lg md:text-xl leading-loose">
            <span className="text-st-red font-bold mr-3" aria-hidden="true">{'▸'}</span>
            Previously at <span className="text-st-neon-cyan font-bold">Just Eat Takeaway</span>, developed date-time picker components and scheduled fulfilment systems serving <span className="text-st-neon-pink font-bold">millions of users</span> across European markets.
          </p>

          <p className="text-lg md:text-xl leading-loose">
            <span className="text-st-red font-bold mr-3" aria-hidden="true">{'▸'}</span>
            Expert in TypeScript monorepo architecture, state management, and building accessible, performant React applications with comprehensive test coverage.
          </p>

          <p className="text-lg md:text-xl leading-loose">
            <span className="text-st-red font-bold mr-3" aria-hidden="true">{'▸'}</span>
            Currently building <span className="text-st-neon-cyan font-bold">WhatsApp reminder applications</span> and exploring cutting-edge web technologies.
          </p>
        </div>

        {/* Blinking cursor */}
        <div className="flex items-center gap-2 mt-10" aria-hidden="true">
          <span className="text-st-red text-xl">{'>'}</span>
          <div className="inline-block w-3 h-5 bg-st-red animate-pulse shadow-neon-red" />
        </div>
      </TerminalWindow>
    </Section>
  );
};
