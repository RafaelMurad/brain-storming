import { useState } from 'react';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Experience } from './components/Experience';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { Contact } from './components/Contact';
import { LoadingSequence } from './components/LoadingSequence';
import { DataStream } from './components/DataStream';
import { LightBeam } from './components/LightBeam';
import { Noise } from './components/Noise';
import { Particles } from './components/Particles';
import { ParallaxBackground } from './components/ParallaxBackground';
import { Scanlines } from './components/Scanlines';
import { Vignette } from './components/Vignette';
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
    <div className="relative min-h-screen bg-bg-primary overflow-hidden">
      {/* Skip to main content for accessibility */}
      <a href="#main" className="skip-to-main">
        SKIP TO MAIN CONTENT
      </a>

      {/* Layered atmospheric background */}
      <ParallaxBackground />
      <div className="hidden md:block fixed inset-0 pointer-events-none z-0">
        <DataStream />
        <LightBeam />
      </div>
      <Noise />
      <Scanlines />
      <Vignette />
      <Particles />

      {/* Main content */}
      <main id="main" role="main" className="relative z-10">
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
