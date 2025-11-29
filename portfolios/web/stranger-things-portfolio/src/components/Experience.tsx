export const Experience = () => {
  const experiences = [
    {
      company: 'Just Eat Takeaway',
      role: 'Senior Frontend Engineer',
      period: '2020 - 2024',
      highlights: [
        'Built date-time picker component used by millions across European markets',
        'Developed scheduled fulfilment system with advanced state management',
        'Optimized performance for multi-market support and accessibility',
      ],
      tech: ['TypeScript', 'React', 'Redux', 'Testing Library'],
    },
    // Add more experiences as needed
  ];

  return (
    <section id="experience" className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-4xl mx-auto w-full">
        {/* Section header */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-6xl font-bold neon-red-subtle mb-4">
            {'<EXPERIENCE>'}
          </h2>
          <div className="h-1 w-32 bg-st-red shadow-[0_0_10px_#FF0000]"></div>
        </div>

        {/* Experience timeline */}
        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="neon-border-red bg-st-deep-black bg-opacity-50 p-8 hover:bg-opacity-70 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-st-red mb-1">{exp.role}</h3>
                  <p className="text-xl text-st-neon-pink font-mono">{exp.company}</p>
                </div>
                <p className="text-st-gray-mid font-mono mt-2 md:mt-0">{exp.period}</p>
              </div>

              <ul className="space-y-2 mb-4">
                {exp.highlights.map((highlight, idx) => (
                  <li key={idx} className="text-st-gray-light font-mono flex items-start">
                    <span className="text-st-red mr-2">▸</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-2">
                {exp.tech.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 border border-st-gray-mid text-st-gray-light text-sm font-mono hover:border-st-red hover:text-st-red transition-colors duration-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
