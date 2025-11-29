export const EasterEgg = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-[10003] flex items-center justify-center bg-black bg-opacity-90 animate-fadeIn">
      <div className="max-w-2xl p-8 neon-border-red bg-st-deep-black relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-st-red hover:text-shadow-[0_0_10px_#FF0000]"
        >
          ✕
        </button>

        <div className="text-center space-y-6">
          <h2 className="text-4xl font-bold neon-red flicker">
            {'<CLASSIFIED>'}
          </h2>

          <div className="space-y-4 text-st-gray-light font-mono">
            <p className="text-lg">
              <span className="text-st-red">{'>'}</span> You've discovered the Upside Down
            </p>

            <p>
              <span className="text-st-red">{'>'}</span> This portfolio was built with passion
              using:
            </p>

            <div className="grid grid-cols-2 gap-2 my-4">
              {['React 18', 'TypeScript', 'Vite', 'Tailwind CSS', 'Canvas API', 'Pure CSS Effects'].map(
                (tech) => (
                  <div
                    key={tech}
                    className="px-3 py-2 border border-st-red text-st-neon-pink text-sm"
                  >
                    {tech}
                  </div>
                )
              )}
            </div>

            <p>
              <span className="text-st-red">{'>'}</span> Easter Egg Unlocked: "The Upside Down"
            </p>

            <p className="text-xs text-st-gray-mid mt-6">
              // Fun fact: The flicker animation simulates the electrical interference from the
              Upside Down
            </p>
          </div>

          <div className="pt-6 border-t border-st-gray-dark">
            <p className="text-st-neon-cyan text-sm font-mono">
              May your code be stranger than things 🔦
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
