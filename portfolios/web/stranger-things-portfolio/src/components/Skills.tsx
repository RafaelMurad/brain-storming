export const Skills = () => {
  const skillCategories = [
    {
      category: 'Frontend',
      icon: '⚛',
      skills: [
        { name: 'TypeScript', level: 95 },
        { name: 'React', level: 95 },
        { name: 'Redux', level: 90 },
        { name: 'Next.js', level: 85 },
      ],
    },
    {
      category: 'Styling',
      icon: '🎨',
      skills: [
        { name: 'Tailwind CSS', level: 90 },
        { name: 'CSS/SCSS', level: 90 },
        { name: 'Styled Components', level: 85 },
      ],
    },
    {
      category: 'Testing',
      icon: '🧪',
      skills: [
        { name: 'Jest', level: 85 },
        { name: 'Testing Library', level: 90 },
        { name: 'Cypress', level: 80 },
      ],
    },
    {
      category: 'Tools',
      icon: '⚙',
      skills: [
        { name: 'Git', level: 90 },
        { name: 'Vite', level: 85 },
        { name: 'Webpack', level: 80 },
      ],
    },
  ];

  return (
    <section id="skills" className="min-h-screen flex items-center justify-center px-4 py-20 relative">
      {/* Background accent */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5">
        <div className="w-[1000px] h-[1000px] bg-st-neon-pink blur-[200px]"></div>
      </div>

      <div className="max-w-6xl mx-auto w-full relative z-10">
        {/* Section header */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-st-red text-2xl animate-pulse">◈</div>
            <h2 className="text-4xl md:text-6xl font-bold neon-red-subtle tracking-wider">
              {'[ ABILITIES MATRIX ]'}
            </h2>
          </div>
          <div className="h-0.5 w-full bg-gradient-to-r from-st-red via-st-red to-transparent shadow-[0_0_10px_#FF0000]"></div>
        </div>

        {/* Skills grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skillCategories.map((category, index) => (
            <div
              key={index}
              className="neon-border-red bg-st-deep-black bg-opacity-70 backdrop-blur-sm p-8 hover:bg-opacity-90 transition-all duration-300 relative group"
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-st-neon-pink via-transparent to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>

              {/* Category header */}
              <div className="flex items-center gap-3 mb-8 pb-4 border-b-2 border-st-gray-dark">
                <span className="text-3xl">{category.icon}</span>
                <h3 className="text-2xl md:text-3xl font-bold text-st-neon-pink font-mono tracking-wider">
                  {category.category}
                </h3>
              </div>

              {/* Skills list */}
              <div className="space-y-6 relative z-10">
                {category.skills.map((skill, idx) => (
                  <div key={idx} className="group/skill">
                    <div className="flex justify-between mb-3">
                      <span className="text-st-gray-light font-mono font-bold tracking-wider">
                        {skill.name}
                      </span>
                      <span className="text-st-red font-mono text-sm px-3 py-1 border border-st-red shadow-[0_0_5px_rgba(255,0,0,0.5)]">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="relative h-3 bg-st-gray-dark border-2 border-st-gray-mid overflow-hidden">
                      {/* Animated progress bar */}
                      <div
                        className="h-full bg-gradient-to-r from-st-red via-st-neon-pink to-st-red shadow-[0_0_15px_#FF0000] transition-all duration-1000 ease-out relative"
                        style={{
                          width: `${skill.level}%`,
                          animation: 'pulse 2s infinite'
                        }}
                      >
                        {/* Scanning effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom accent line */}
        <div className="mt-16 h-px w-full bg-gradient-to-r from-transparent via-st-red to-transparent shadow-[0_0_10px_#FF0000]"></div>
      </div>
    </section>
  );
};
