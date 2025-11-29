export const Contact = () => {
  return (
    <section id="contact" className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-4xl mx-auto w-full">
        {/* Section header */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-6xl font-bold neon-red-subtle mb-4">
            {'<CONTACT>'}
          </h2>
          <div className="h-1 w-32 bg-st-red shadow-[0_0_10px_#FF0000]"></div>
        </div>

        <div className="neon-border-red bg-st-deep-black bg-opacity-50 p-8 md:p-12">
          <div className="text-center space-y-6">
            {/* Main CTA */}
            <h3 className="text-3xl md:text-4xl font-bold text-st-red mb-4">
              Ready to Build Something Amazing?
            </h3>

            <p className="text-xl text-st-gray-light font-mono leading-relaxed">
              I'm currently{' '}
              <span className="text-st-neon-pink font-bold">available for contract work</span> and
              remote opportunities.
            </p>

            <p className="text-lg text-st-gray-light font-mono leading-relaxed">
              Specializing in <span className="text-st-neon-cyan">TypeScript</span>,{' '}
              <span className="text-st-neon-cyan">React</span>, and{' '}
              <span className="text-st-neon-cyan">modern frontend architecture</span>.
            </p>

            {/* Contact methods */}
            <div className="pt-8 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:your.email@example.com"
                  className="neon-border-red px-8 py-4 text-st-red font-bold uppercase tracking-wider hover:bg-st-red hover:bg-opacity-10 transition-all duration-300 inline-block"
                >
                  Send Email
                </a>
                <a
                  href="https://linkedin.com/in/yourprofile"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-st-gray-mid px-8 py-4 text-st-gray-light font-bold uppercase tracking-wider hover:border-st-red hover:text-st-red transition-all duration-300 inline-block"
                >
                  LinkedIn
                </a>
                <a
                  href="https://github.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-st-gray-mid px-8 py-4 text-st-gray-light font-bold uppercase tracking-wider hover:border-st-red hover:text-st-red transition-all duration-300 inline-block"
                >
                  GitHub
                </a>
              </div>
            </div>

            {/* Additional info */}
            <div className="pt-8 border-t border-st-gray-dark mt-8">
              <p className="text-st-gray-mid font-mono text-sm">
                <span className="text-st-red">{'>'}</span> Response time: Within 24 hours
              </p>
              <p className="text-st-gray-mid font-mono text-sm">
                <span className="text-st-red">{'>'}</span> Location: Available for remote work
                worldwide
              </p>
              <p className="text-st-gray-mid font-mono text-sm">
                <span className="text-st-red">{'>'}</span> Currently: Open to new opportunities
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-st-gray-mid font-mono text-sm">
            Built with React, TypeScript, and a touch of the Upside Down
          </p>
          <p className="text-st-gray-dark font-mono text-xs mt-2">
            © 2024 - All rights reserved
          </p>
        </div>
      </div>
    </section>
  );
};
