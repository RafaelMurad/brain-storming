export const Skills = () => {
  const categories = [
    {
      name: 'Frontend Development',
      icon: '⚛',
      skills: [
        { name: 'TypeScript', proficiency: 5 },
        { name: 'React', proficiency: 5 },
        { name: 'Redux', proficiency: 4 },
        { name: 'Next.js', proficiency: 4 },
      ],
    },
    {
      name: 'Styling & Design',
      icon: '🎨',
      skills: [
        { name: 'Tailwind CSS', proficiency: 5 },
        { name: 'CSS/SCSS', proficiency: 5 },
        { name: 'Styled Components', proficiency: 4 },
      ],
    },
    {
      name: 'Testing & Quality',
      icon: '🧪',
      skills: [
        { name: 'Jest', proficiency: 4 },
        { name: 'Testing Library', proficiency: 5 },
        { name: 'Cypress', proficiency: 4 },
      ],
    },
    {
      name: 'Tools & Platform',
      icon: '⚙',
      skills: [
        { name: 'Git', proficiency: 5 },
        { name: 'Vite', proficiency: 4 },
        { name: 'Webpack', proficiency: 4 },
      ],
    },
  ];

  const competencies = [
    'Enterprise-scale application development',
    'TypeScript monorepo architecture',
    'WCAG 2.1 AA accessibility standards',
    'Multi-market i18n implementation',
    'Performance optimization & monitoring',
    'Component library development',
  ];

  return (
    <section id="skills" className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-4xl text-st-red-glow">◈</span>
            <div>
              <p className="text-xs font-mono text-text-tertiary tracking-[0.3em] mb-2">
                EVALUATION PROTOCOL // TECHNICAL ASSESSMENT
              </p>
              <h2
                className="text-5xl md:text-6xl font-bold text-st-red-glow font-mono"
                style={{ textShadow: '0 0 30px rgba(230, 46, 46, 0.4)' }}
              >
                ABILITIES MATRIX
              </h2>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-st-red-primary to-transparent" />
        </div>

        {/* Skills organized by category */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {categories.map((category, i) => (
            <div key={i} className="holo-card overflow-hidden">
              {/* Category header */}
              <div className="border-b border-st-red-primary/30 bg-st-red-subtle px-8 py-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-mono text-text-tertiary tracking-wider mb-1">
                      CATEGORY {String(i + 1).padStart(2, '0')}
                    </p>
                    <h3 className="text-2xl font-bold text-st-green-terminal phosphor-text font-mono">
                      {category.name}
                    </h3>
                  </div>
                  <span className="text-4xl">{category.icon}</span>
                </div>
              </div>

              {/* Skills with 5-bar proficiency indicator */}
              <div className="p-8 space-y-6">
                {category.skills.map((skill, idx) => (
                  <div key={idx} className="group/skill">
                    {/* Skill name and proficiency meter */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-text-primary font-mono font-bold tracking-wide">
                        {skill.name}
                      </span>

                      {/* 5-bar proficiency indicator */}
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-6 border transition-all duration-300 ${
                              i < skill.proficiency
                                ? 'bg-st-green-terminal border-st-green-terminal shadow-glow-green-subtle'
                                : 'bg-transparent border-text-dim'
                            } group-hover/skill:border-st-green-terminal/60`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Skill bar - refined */}
                    <div className="relative h-1 bg-bg-void overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-st-green-terminal to-st-cyan-data transition-all duration-1000"
                        style={{ width: `${(skill.proficiency / 5) * 100}%` }}
                      >
                        {/* Scan effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Core competencies */}
        <div className="p-8 bg-st-yellow-classified/5 border border-st-yellow-classified/30 backdrop-blur-sm holo-card">
          <div className="flex items-start gap-4 mb-6">
            <span className="text-3xl">⚡</span>
            <div>
              <h3 className="text-xl font-bold text-st-yellow-classified mb-2 font-mono">
                SPECIAL QUALIFICATIONS
              </h3>
              <p className="text-xs font-mono text-text-tertiary tracking-wider uppercase">
                High-Priority Competencies
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 text-text-secondary font-sans">
            {competencies.map((comp, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-st-green-terminal mt-1">▸</span>
                <span className="leading-relaxed">{comp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
