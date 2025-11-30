export const Experience = () => {
  const experiences = [
    {
      company: 'Just Eat Takeaway',
      role: 'Senior Frontend Engineer',
      period: '2020 - 2024',
      duration: '4 years',
      location: 'Remote (Netherlands)',
      highlights: [
        'Architected and delivered enterprise-grade date-time picker component serving millions of users across 13 European markets',
        'Led development of scheduled fulfilment system with advanced Redux state management and real-time order tracking',
        'Optimized bundle size by 40% and improved TTI by 60% through code-splitting and lazy loading strategies',
        'Championed accessibility standards (WCAG 2.1 AA) and implemented comprehensive i18n support for multi-market deployment',
      ],
      tech: ['TypeScript', 'React', 'Redux', 'Testing Library', 'Webpack', 'i18n'],
    },
  ];

  return (
    <section id="experience" className="min-h-screen flex items-center justify-center px-4 py-20 relative">
      {/* Background accent */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5">
        <div className="w-[1000px] h-[1000px] bg-st-red blur-[200px]"></div>
      </div>

      <div className="max-w-5xl mx-auto w-full relative z-10">
        {/* Section header */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-st-red text-2xl animate-pulse">◉</div>
            <h2 className="text-4xl md:text-6xl font-bold neon-red-subtle tracking-wider">
              {'[ MISSION LOG ]'}
            </h2>
          </div>
          <div className="h-0.5 w-full bg-gradient-to-r from-st-red via-st-red to-transparent shadow-[0_0_10px_#FF0000]"></div>
        </div>

        {/* Experience timeline */}
        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="neon-border-red bg-st-deep-black bg-opacity-80 backdrop-blur-md hover:bg-opacity-90 transition-all duration-500 relative group overflow-hidden"
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-st-red via-transparent to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>

              {/* Experience header with terminal style */}
              <div className="border-b-2 border-st-red px-8 py-4 bg-st-red bg-opacity-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-st-red mb-2 tracking-wide">
                      {exp.role}
                    </h3>
                    <p className="text-xl text-st-neon-pink font-mono tracking-wider">
                      @ {exp.company}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="px-4 py-2 border-2 border-st-neon-cyan text-st-neon-cyan font-mono text-sm shadow-[0_0_10px_#00F0FF]">
                      {exp.period}
                    </div>
                    <p className="text-st-gray-mid font-mono text-sm">{exp.location}</p>
                  </div>
                </div>
              </div>

              {/* Experience content */}
              <div className="p-8 relative z-10">
                {/* Mission objectives */}
                <div className="mb-6">
                  <h4 className="text-st-neon-cyan font-mono text-sm tracking-wider mb-4 flex items-center gap-2">
                    <span className="text-lg">▸</span>
                    MISSION OBJECTIVES
                  </h4>
                  <ul className="space-y-3">
                    {exp.highlights.map((highlight, idx) => (
                      <li
                        key={idx}
                        className="text-st-gray-light font-mono text-sm md:text-base flex items-start leading-relaxed pl-6 relative"
                      >
                        <span className="absolute left-0 text-st-red font-bold">▸</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Divider */}
                <div className="h-px w-full bg-st-gray-dark my-6"></div>

                {/* Tech stack */}
                <div>
                  <h4 className="text-st-neon-pink font-mono text-sm tracking-wider mb-4 flex items-center gap-2">
                    <span className="text-lg">▸</span>
                    TECH ARSENAL
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {exp.tech.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 border-2 border-st-gray-mid text-st-gray-light text-sm font-mono hover:border-st-red hover:text-st-red hover:shadow-[0_0_10px_rgba(255,0,0,0.5)] transition-all duration-300 bg-st-gray-dark bg-opacity-30"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-st-red opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-st-red opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* Bottom accent line */}
        <div className="mt-16 h-px w-full bg-gradient-to-r from-transparent via-st-red to-transparent shadow-[0_0_10px_#FF0000]"></div>
      </div>
    </section>
  );
};
