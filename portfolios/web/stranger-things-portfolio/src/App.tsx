import { Scanlines } from './components/Scanlines';
import { Vignette } from './components/Vignette';
import { Noise } from './components/Noise';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Experience } from './components/Experience';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { Contact } from './components/Contact';

function App() {
  return (
    <div className="relative min-h-screen bg-st-deep-black">
      {/* Visual effects overlays */}
      <Scanlines />
      <Vignette />
      <Noise />

      {/* Main content */}
      <main className="relative z-10">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </main>
    </div>
  );
}

export default App;
