const radarStats = [
  { label: 'Markets', value: '13 EU' },
  { label: 'Systems shipped', value: '22' },
  { label: 'Users impacted', value: '7.4M+' },
  { label: 'Latency savings', value: '60%' },
];

const missionTimeline = [
  {
    codename: 'Chronos Initiative',
    role: 'Senior Frontend Engineer',
    organization: 'Just Eat Takeaway',
    timeframe: '2020 — 2024',
    location: 'Remote · Netherlands',
    summary:
      'Rebuilt the platform scheduling experience across 13 markets with accessible, composable UI primitives and Ops tooling.',
    dossiers: [
      'Architected the enterprise date-time system delivering 7.4M weekly interactions with WCAG AA coverage.',
      'Led cross-market fulfilment console: predictive order routing, alerting grid, and real-time diff streaming.',
      'Cut bundle weight 40% via federated modules, progressive hydration, and mission-based lazy loading.',
    ],
    tech: ['TypeScript', 'React', 'Redux', 'NX', 'Testing Library', 'Storybook'],
  },
];

export const Experience = () => {
  return (
    <section id="experience" className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex items-start gap-6">
          <div className="evidence-stamp" aria-hidden="true">
            <span>OPS</span>
          </div>
          <div>
            <p className="text-xs font-mono text-text-tertiary tracking-[0.35em] uppercase mb-3">
              HAWKINS LAB // DEPLOYMENT RADAR
            </p>
            <h2 className="text-5xl md:text-6xl font-bold text-st-red-glow font-benguiat" style={{ textShadow: '0 0 30px rgba(230, 46, 46, 0.4)' }}>
              Experience Signal
            </h2>
          </div>
        </div>

        <div className="experience-grid">
          <aside className="radar-console">
            <div className="radar-display" aria-hidden="true">
              <div className="radar-grid" />
              <div className="radar-ring" />
              <div className="radar-ring radar-ring--mid" />
              <div className="radar-ring radar-ring--outer" />
              <div className="radar-sweep" />
              {radarStats.map((stat, idx) => (
                <div key={stat.label} className={`radar-dot radar-dot--${idx}`}>
                  <span />
                </div>
              ))}
            </div>
            <div className="radar-stats">
              {radarStats.map((stat) => (
                <div key={stat.label}>
                  <p>{stat.value}</p>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>

            <div className="radar-footnotes">
              <p className="font-mono text-xs tracking-[0.35em] text-text-tertiary uppercase">Status</p>
              <div className="flex items-center gap-3">
                <span className="radar-status" aria-hidden="true" />
                <p className="text-sm text-text-secondary">Active mission · Availability window open</p>
              </div>
            </div>
          </aside>

          <div className="mission-feed">
            {missionTimeline.map((mission) => (
              <article key={mission.codename} className="mission-card">
                <header className="mission-card__header">
                  <div>
                    <p className="mission-codename">{mission.codename}</p>
                    <h3>{mission.role}</h3>
                    <p className="mission-organization">
                      @ {mission.organization}
                    </p>
                  </div>
                  <div className="mission-meta">
                    <span>{mission.timeframe}</span>
                    <span>{mission.location}</span>
                  </div>
                </header>

                <p className="mission-summary">{mission.summary}</p>

                <ul className="mission-dossier">
                  {mission.dossiers.map((item) => (
                    <li key={item}>
                      <span aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div>
                  <p className="mission-label">Tech arsenal</p>
                  <div className="mission-tags">
                    {mission.tech.map((tool) => (
                      <span key={tool}>{tool}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
