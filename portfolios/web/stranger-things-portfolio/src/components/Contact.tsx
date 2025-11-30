export const Contact = () => {
  return (
    <section id="contact" className="min-h-screen flex items-center justify-center px-4 py-20 relative">
      {/* Background accent */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <div className="w-[1200px] h-[1200px] bg-st-red blur-[250px] animate-pulse"></div>
      </div>

      <div className="max-w-5xl mx-auto w-full relative z-10">
        {/* Section header */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-st-red text-2xl animate-pulse">◆</div>
            <h2 className="text-4xl md:text-6xl font-bold neon-red-subtle tracking-wider">
              {'[ TRANSMISSION ]'}
            </h2>
          </div>
          <div className="h-0.5 w-full bg-gradient-to-r from-st-red via-st-red to-transparent shadow-[0_0_10px_#FF0000]"></div>
        </div>

        <div className="neon-border-red bg-st-deep-black bg-opacity-80 backdrop-blur-md relative group">
          {/* Hover glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-st-red via-transparent to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>

          {/* Terminal header */}
          <div className="border-b-2 border-st-red px-8 py-4 bg-st-red bg-opacity-5">
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-st-red shadow-[0_0_10px_#FF0000] animate-pulse"></div>
                <div className="w-3 h-3 rounded-full bg-st-neon-cyan shadow-[0_0_10px_#00F0FF]"></div>
                <div className="w-3 h-3 rounded-full bg-st-neon-pink shadow-[0_0_10px_#FF006E]"></div>
              </div>
              <span className="text-st-gray-light font-mono text-xs tracking-wider">
                COMMUNICATION_CHANNEL_OPEN
              </span>
            </div>
          </div>

          <div className="p-8 md:p-12 relative z-10">
            <div className="text-center space-y-8">
              {/* Main CTA */}
              <div>
                <h3 className="text-3xl md:text-5xl font-bold neon-red mb-6 tracking-wide">
                  LET'S BUILD SOMETHING EXTRAORDINARY
                </h3>
                <div className="h-px w-48 mx-auto bg-gradient-to-r from-transparent via-st-red to-transparent shadow-[0_0_10px_#FF0000] mb-8"></div>
              </div>

              <p className="text-lg md:text-xl text-st-gray-light font-mono leading-relaxed max-w-2xl mx-auto">
                <span className="text-st-red font-bold">{'>> '}</span>
                Currently{' '}
                <span className="text-st-neon-pink font-bold animate-pulse">AVAILABLE FOR HIRE</span>
                {' '}- Open to contract work, remote positions, and exciting collaborations
              </p>

              <div className="flex flex-wrap justify-center gap-4 text-st-neon-cyan font-mono text-sm">
                <span className="px-4 py-2 border border-st-neon-cyan shadow-[0_0_10px_#00F0FF]">
                  TypeScript Expert
                </span>
                <span className="px-4 py-2 border border-st-neon-cyan shadow-[0_0_10px_#00F0FF]">
                  React Specialist
                </span>
                <span className="px-4 py-2 border border-st-neon-cyan shadow-[0_0_10px_#00F0FF]">
                  Architecture & Scale
                </span>
              </div>

              {/* Contact methods */}
              <div className="pt-8">
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <a
                    href="mailto:rafael.murad@example.com"
                    className="group neon-border-red px-10 py-5 text-st-red font-bold uppercase tracking-wider bg-st-deep-black backdrop-blur-sm relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      <span>📧</span>
                      <span>Send Transmission</span>
                    </span>
                    <div className="absolute inset-0 bg-st-red opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  </a>
                  <a
                    href="https://linkedin.com/in/rafaelmurad"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-2 border-st-neon-cyan px-10 py-5 text-st-neon-cyan font-bold uppercase tracking-wider hover:bg-st-neon-cyan hover:text-st-deep-black transition-all duration-300 backdrop-blur-sm flex items-center gap-3 justify-center"
                  >
                    <span>💼</span>
                    <span>LinkedIn</span>
                  </a>
                  <a
                    href="https://github.com/rafaelmurad"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-2 border-st-neon-pink px-10 py-5 text-st-neon-pink font-bold uppercase tracking-wider hover:bg-st-neon-pink hover:text-st-deep-black transition-all duration-300 backdrop-blur-sm flex items-center gap-3 justify-center"
                  >
                    <span>💻</span>
                    <span>GitHub</span>
                  </a>
                </div>
              </div>

              {/* System info */}
              <div className="pt-10 border-t-2 border-st-gray-dark mt-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  <div className="space-y-2">
                    <p className="text-st-neon-cyan font-mono text-sm font-bold tracking-wider">
                      {'>> RESPONSE_TIME'}
                    </p>
                    <p className="text-st-gray-light font-mono text-sm pl-4">
                      Within 24 hours
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-st-neon-cyan font-mono text-sm font-bold tracking-wider">
                      {'>> LOCATION'}
                    </p>
                    <p className="text-st-gray-light font-mono text-sm pl-4">
                      Remote • Worldwide
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-st-neon-cyan font-mono text-sm font-bold tracking-wider">
                      {'>> STATUS'}
                    </p>
                    <p className="text-st-neon-pink font-mono text-sm pl-4 font-bold animate-pulse">
                      ● ONLINE
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Corner accents */}
          <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-st-red opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-st-red opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center space-y-4">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-st-red to-transparent shadow-[0_0_10px_#FF0000] mb-8"></div>
          <p className="text-st-gray-mid font-mono text-sm">
            <span className="text-st-red">{'> '}</span>
            Built with React • TypeScript • Tailwind CSS
          </p>
          <p className="text-st-gray-mid font-mono text-sm">
            <span className="text-st-red">{'> '}</span>
            Powered by the{' '}
            <span className="text-st-neon-pink animate-pulse">Upside Down</span>
          </p>
          <p className="text-st-gray-dark font-mono text-xs mt-4">
            © 2024 RAFAEL MURAD • ALL RIGHTS RESERVED
          </p>
        </div>
      </div>
    </section>
  );
};
