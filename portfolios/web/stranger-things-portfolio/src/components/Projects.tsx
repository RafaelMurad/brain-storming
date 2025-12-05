import { useMemo, useState } from 'react';

const filters = [
  { id: 'all', label: 'All cases' },
  { id: 'experience', label: 'Product Experience' },
  { id: 'systems', label: 'Systems & Platforms' },
  { id: 'automation', label: 'Automation & AI' },
];

const caseFiles = [
  {
    id: 'CF-01',
    title: 'WhatsApp Ops Agent',
    classification: 'HIGH PRIORITY',
    type: 'automation',
    mission: 'Automated scheduling & reminder workflows for recurring orders using WhatsApp as the command channel.',
    highlights: [
      'TypeScript monorepo powering shared data contracts',
      'Multi-market SLA alignment with localized content packs',
    ],
    outcomes: [
      { label: 'Automation coverage', value: '68% flows' },
      { label: 'Markets live', value: '5 EU' },
      { label: 'Latency cut', value: '42%' },
    ],
    stack: ['TypeScript', 'Node.js', 'WhatsApp API', 'Temporal'],
    status: 'ACTIVE OPERATIONS',
    year: '2024',
    role: 'Lead Frontend + Architect',
    link: '#',
  },
  {
    id: 'CF-02',
    title: 'Chronos Picker',
    classification: 'CLEARED',
    type: 'experience',
    mission: 'Enterprise date-time picker reimagined for restaurant fleets with accessibility-first constraints.',
    highlights: [
      'WCAG AA compliance verified across 13 locales',
      'Composable API with 40+ integration surfaces',
    ],
    outcomes: [
      { label: 'Weekly users', value: '7.4M' },
      { label: 'Markets', value: '13' },
      { label: 'Error drop', value: '31%' },
    ],
    stack: ['React', 'TypeScript', 'Storybook', 'Testing Library'],
    status: 'DEPLOYED EU NETWORK',
    year: '2023',
    role: 'Senior Frontend Engineer',
    link: '#',
  },
  {
    id: 'CF-03',
    title: 'Fulfilment Grid',
    classification: 'CLASSIFIED',
    type: 'systems',
    mission: 'High-performance fulfilment scheduler orchestrating millions of restaurant orders with predictive load balancing.',
    highlights: [
      'Redux-powered data grid with intelligent diff streaming',
      'Real-time alerting console for ops leads',
    ],
    outcomes: [
      { label: 'Orders / day', value: '2.1M' },
      { label: 'Throughput gain', value: '+18%' },
      { label: 'Downtime', value: '< 0.2%' },
    ],
    stack: ['React', 'Redux Toolkit', 'WebSockets', 'NX'],
    status: 'CONTINUOUS MONITORING',
    year: '2022',
    role: 'Frontend Platform',
    link: '#',
  },
];

export const Projects = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const visibleCases = useMemo(() => {
    if (activeFilter === 'all') return caseFiles;
    return caseFiles.filter((file) => file.type === activeFilter);
  }, [activeFilter]);

  return (
    <section id="projects" className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-14 flex flex-col gap-6">
          <div className="flex items-start gap-6">
            <div className="evidence-stamp" aria-hidden="true">
              <span>HL</span>
            </div>
            <div>
              <p className="text-xs font-mono text-text-tertiary tracking-[0.3em] mb-2 uppercase">
                HAWKINS LAB // CLASSIFIED CASE FILES
              </p>
              <h2 className="text-5xl md:text-6xl font-bold text-st-red-glow font-benguiat" style={{ textShadow: '0 0 30px rgba(230, 46, 46, 0.4)' }}>
                Evidence Board
              </h2>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-st-red-primary to-transparent" />

          <div className="flex flex-wrap gap-3">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`board-filter ${activeFilter === filter.id ? 'board-filter--active' : ''}`}
                type="button"
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="evidence-board">
          <div className="thread-overlay" aria-hidden="true" />
          <div className="grid md:grid-cols-2 gap-10 relative">
            {visibleCases.map((project) => (
              <article key={project.id} className="case-card group">
                <div className="case-pin" aria-hidden="true" />
                <div className="case-thread case-thread--left" aria-hidden="true" />
                <div className="case-thread case-thread--right" aria-hidden="true" />

                <div className="case-card__header">
                  <div>
                    <p className="text-xs font-mono tracking-[0.35em] text-text-tertiary uppercase">FILE {project.id}</p>
                    <h3 className="text-2xl md:text-3xl font-bold text-text-primary font-sans mt-2">
                      {project.title}
                    </h3>
                  </div>
                  <span className="case-classification" data-status={project.classification}>
                    {project.classification}
                  </span>
                </div>

                <div className="case-card__body">
                  <p className="text-text-secondary text-base leading-relaxed font-sans">
                    {project.mission}
                  </p>

                  <ul className="case-highlights">
                    {project.highlights.map((item) => (
                      <li key={item}>
                        <span className="case-bullet" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="case-outcomes">
                    {project.outcomes.map((outcome) => (
                      <div key={outcome.label} className="case-outcomes__item">
                        <p className="text-xs font-mono tracking-[0.3em] text-text-tertiary uppercase">{outcome.label}</p>
                        <p className="text-xl font-semibold text-text-primary">{outcome.value}</p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <p className="text-xs font-mono text-text-tertiary tracking-[0.35em] uppercase mb-2">Stack Evidence</p>
                    <div className="flex flex-wrap gap-2">
                      {project.stack.map((tech) => (
                        <span key={tech} className="case-tag">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="case-card__footer">
                  <div className="case-meta">
                    <p>
                      <span>Deployment</span>
                      {project.status}
                    </p>
                    <p>
                      <span>Role</span>
                      {project.role}
                    </p>
                    <p>
                      <span>Year</span>
                      {project.year}
                    </p>
                  </div>
                  <a href={project.link} className="case-link">
                    Access case file
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m0 0-6-6m6 6-6 6" />
                    </svg>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
