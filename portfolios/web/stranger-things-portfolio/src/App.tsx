import { useState } from 'react';
import { Scanlines } from './components/Scanlines';
import { Vignette } from './components/Vignette';
import { Noise } from './components/Noise';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Experience } from './components/Experience';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { Contact } from './components/Contact';
import { LoadingSequence } from './components/LoadingSequence';
import { Particles } from './components/Particles';
import { CustomCursor } from './components/CustomCursor';
import { EasterEgg } from './components/EasterEgg';
import { useKonamiCode } from './hooks/useKonamiCode';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  // Konami code Easter egg
  useKonamiCode(() => {
    setShowEasterEgg(true);
  });

  if (isLoading) {
    return <LoadingSequence onComplete={() => setIsLoading(false)} />;
  }

  return (
    <div className="relative min-h-screen bg-st-deep-black cursor-none">
      {/* Custom cursor */}
      <CustomCursor />

      {/* Visual effects overlays */}
      <Scanlines />
      <Vignette />
      <Noise />
      <Particles />

      {/* Main content */}
      <main className="relative z-10">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </main>

      {/* Easter egg */}
      {showEasterEgg && <EasterEgg onClose={() => setShowEasterEgg(false)} />}
    </div>
  );
}

export default App;
