export const About = () => {
  return (
    <section id="about" className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-6xl font-bold neon-red-subtle mb-4">
            {'<ABOUT_ME>'}
          </h2>
          <div className="h-1 w-32 bg-st-red shadow-[0_0_10px_#FF0000]"></div>
        </div>

        {/* Terminal-style about section */}
        <div className="neon-border-red bg-st-deep-black bg-opacity-50 p-8">
          <div className="font-mono text-st-gray-light space-y-4">
            <p className="text-lg leading-relaxed">
              <span className="text-st-red">{'>'}</span> Hello! I'm a{' '}
              <span className="text-st-neon-pink font-bold">Frontend Engineer</span> with a passion
              for building exceptional web experiences.
            </p>

            <p className="text-lg leading-relaxed">
              <span className="text-st-red">{'>'}</span> Currently specializing in{' '}
              <span className="text-st-neon-cyan font-bold">TypeScript</span>,{' '}
              <span className="text-st-neon-cyan font-bold">React</span>, and{' '}
              <span className="text-st-neon-cyan font-bold">modern frontend architecture</span>.
            </p>

            <p className="text-lg leading-relaxed">
              <span className="text-st-red">{'>'}</span> Previously at{' '}
              <span className="text-st-red font-bold">Just Eat Takeaway</span>, where I built
              scalable solutions for millions of users across European markets.
            </p>

            <p className="text-lg leading-relaxed">
              <span className="text-st-red">{'>'}</span> Available for{' '}
              <span className="text-st-neon-pink font-bold blink">contract work</span> and remote
              opportunities.
            </p>

            {/* Blinking cursor */}
            <div className="inline-block w-2 h-5 bg-st-red ml-1 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
