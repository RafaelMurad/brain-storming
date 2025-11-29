export const Projects = () => {
  const projects = [
    {
      id: 'PRJ_001',
      title: 'WhatsApp Reminder App',
      description: 'Building the Upside Down of reminder systems with TypeScript monorepo architecture',
      tech: ['TypeScript', 'Monorepo', 'WhatsApp API', 'Node.js'],
      status: 'ACTIVE',
      link: '#',
    },
    {
      id: 'PRJ_002',
      title: 'Date-Time Picker Component',
      description: 'Time-bending components for millions of users with accessibility and multi-market support',
      tech: ['React', 'TypeScript', 'Accessibility', 'i18n'],
      status: 'DEPLOYED',
      link: '#',
    },
    {
      id: 'PRJ_003',
      title: 'Scheduled Fulfilment System',
      description: 'Orchestrating order timelines across dimensions (European markets) with optimized performance',
      tech: ['React', 'Redux', 'Performance', 'State Management'],
      status: 'DEPLOYED',
      link: '#',
    },
  ];

  return (
    <section id="projects" className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-6xl mx-auto w-full">
        {/* Section header */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-6xl font-bold neon-red-subtle mb-4">
            {'<PROJECTS>'}
          </h2>
          <div className="h-1 w-32 bg-st-red shadow-[0_0_10px_#FF0000]"></div>
        </div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div
              key={index}
              className="neon-border-red bg-st-deep-black bg-opacity-50 p-6 hover:bg-opacity-70 transition-all duration-300 group"
            >
              {/* Project ID */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-st-neon-cyan font-mono text-sm">{project.id}</span>
                <span
                  className={`text-xs font-mono px-2 py-1 ${
                    project.status === 'ACTIVE'
                      ? 'text-st-neon-pink border border-st-neon-pink'
                      : 'text-st-neon-cyan border border-st-neon-cyan'
                  }`}
                >
                  {project.status}
                </span>
              </div>

              {/* Project title */}
              <h3 className="text-xl font-bold text-st-red mb-3 group-hover:glow-pulse">
                {project.title}
              </h3>

              {/* Description */}
              <p className="text-st-gray-light font-mono text-sm mb-4 leading-relaxed">
                {project.description}
              </p>

              {/* Tech stack */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 border border-st-gray-mid text-st-gray-light text-xs font-mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Link */}
              <a
                href={project.link}
                className="inline-block text-st-red font-mono text-sm hover:text-shadow-[0_0_5px_#FF0000] transition-all"
              >
                View Project →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
