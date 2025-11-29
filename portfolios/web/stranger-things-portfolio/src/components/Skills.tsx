export const Skills = () => {
  const skillCategories = [
    {
      category: 'Frontend',
      skills: [
        { name: 'TypeScript', level: 95 },
        { name: 'React', level: 95 },
        { name: 'Redux', level: 90 },
        { name: 'Next.js', level: 85 },
      ],
    },
    {
      category: 'Styling',
      skills: [
        { name: 'Tailwind CSS', level: 90 },
        { name: 'CSS/SCSS', level: 90 },
        { name: 'Styled Components', level: 85 },
      ],
    },
    {
      category: 'Testing',
      skills: [
        { name: 'Jest', level: 85 },
        { name: 'Testing Library', level: 90 },
        { name: 'Cypress', level: 80 },
      ],
    },
    {
      category: 'Tools',
      skills: [
        { name: 'Git', level: 90 },
        { name: 'Vite', level: 85 },
        { name: 'Webpack', level: 80 },
      ],
    },
  ];

  return (
    <section id="skills" className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-6xl mx-auto w-full">
        {/* Section header */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-6xl font-bold neon-red-subtle mb-4">
            {'<SKILLS>'}
          </h2>
          <div className="h-1 w-32 bg-st-red shadow-[0_0_10px_#FF0000]"></div>
        </div>

        {/* Skills grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skillCategories.map((category, index) => (
            <div
              key={index}
              className="neon-border-red bg-st-deep-black bg-opacity-50 p-6"
            >
              <h3 className="text-2xl font-bold text-st-neon-pink mb-6 font-mono">
                {category.category}
              </h3>

              <div className="space-y-4">
                {category.skills.map((skill, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between mb-2">
                      <span className="text-st-gray-light font-mono">{skill.name}</span>
                      <span className="text-st-red font-mono text-sm">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-st-gray-dark border border-st-gray-mid overflow-hidden">
                      <div
                        className="h-full bg-st-red shadow-[0_0_10px_#FF0000] transition-all duration-1000 ease-out"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
