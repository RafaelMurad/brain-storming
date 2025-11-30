export const Projects = () => {
  const projects = [
    {
      id: 'PRJ_001',
      title: 'WhatsApp Reminder App',
      description: 'Building a TypeScript monorepo architecture for automated WhatsApp reminders with intelligent scheduling and notifications',
      tech: ['TypeScript', 'Monorepo', 'WhatsApp API', 'Node.js'],
      status: 'ACTIVE',
      statusColor: 'neon-pink',
      link: '#',
    },
    {
      id: 'PRJ_002',
      title: 'Date-Time Picker Component',
      description: 'Enterprise-grade React component serving millions of users with full accessibility support and multi-market localization',
      tech: ['React', 'TypeScript', 'Accessibility', 'i18n'],
      status: 'DEPLOYED',
      statusColor: 'neon-cyan',
      link: '#',
    },
    {
      id: 'PRJ_003',
      title: 'Scheduled Fulfilment System',
      description: 'High-performance order scheduling system handling millions of transactions across European markets with Redux state management',
      tech: ['React', 'Redux', 'Performance', 'State Management'],
      status: 'DEPLOYED',
      statusColor: 'neon-cyan',
      link: '#',
    },
  ];

  return (
    <section id="projects" className="min-h-screen flex items-center justify-center px-4 py-20 relative">
      {/* Background accent */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5">
        <div className="w-[1000px] h-[1000px] bg-st-neon-cyan blur-[200px]"></div>
      </div>

      <div className="max-w-6xl mx-auto w-full relative z-10">
        {/* Section header */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-st-red text-2xl animate-pulse">◆</div>
            <h2 className="text-4xl md:text-6xl font-bold neon-red-subtle tracking-wider">
              {'[ CASE FILES ]'}
            </h2>
          </div>
          <div className="h-0.5 w-full bg-gradient-to-r from-st-red via-st-red to-transparent shadow-[0_0_10px_#FF0000]"></div>
        </div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="group neon-border-red bg-st-deep-black bg-opacity-70 backdrop-blur-sm hover:bg-opacity-90 transition-all duration-500 relative overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-st-red via-transparent to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>

              <div className="p-6 relative z-10">
                {/* Project header */}
                <div className="flex items-center justify-between mb-5 pb-3 border-b border-st-gray-dark">
                  <span className="text-st-neon-cyan font-mono text-sm tracking-wider font-bold">
                    {project.id}
                  </span>
                  <span
                    className={`text-xs font-mono px-3 py-1.5 border-2 ${
                      project.statusColor === 'neon-pink'
                        ? 'text-st-neon-pink border-st-neon-pink shadow-[0_0_10px_#FF006E]'
                        : 'text-st-neon-cyan border-st-neon-cyan shadow-[0_0_10px_#00F0FF]'
                    } animate-pulse`}
                  >
                    ● {project.status}
                  </span>
                </div>

                {/* Project title */}
                <h3 className="text-xl md:text-2xl font-bold text-st-red mb-4 group-hover:neon-red transition-all duration-300">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-st-gray-light font-mono text-sm mb-6 leading-relaxed min-h-[100px]">
                  {project.description}
                </p>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 border border-st-gray-mid text-st-gray-light text-xs font-mono hover:border-st-neon-cyan hover:text-st-neon-cyan transition-all duration-300 bg-st-gray-dark bg-opacity-30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Link */}
                <a
                  href={project.link}
                  className="inline-flex items-center gap-2 text-st-red font-mono text-sm font-bold uppercase tracking-wider border-2 border-st-red px-4 py-2 hover:bg-st-red hover:text-st-deep-black transition-all duration-300 shadow-[0_0_10px_rgba(255,0,0,0.3)] hover:shadow-[0_0_20px_rgba(255,0,0,0.6)]"
                >
                  <span>Access File</span>
                  <span className="text-lg">→</span>
                </a>
              </div>

              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-st-red opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-st-red opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* Bottom accent line */}
        <div className="mt-16 h-px w-full bg-gradient-to-r from-transparent via-st-red to-transparent shadow-[0_0_10px_#FF0000]"></div>
      </div>
    </section>
  );
};
