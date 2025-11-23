import { Component, createSignal, onMount } from 'solid-js';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';

const App: Component = () => {
  const [isLoaded, setIsLoaded] = createSignal(false);

  onMount(() => {
    // Simulate loading sequence
    setTimeout(() => setIsLoaded(true), 500);
  });

  return (
    <div class="relative min-h-screen overflow-hidden">
      {/* Floating particles background */}
      <div class="fixed inset-0 pointer-events-none overflow-hidden">
        <div class="particle top-1/4 left-1/4 animate-delay-100" style={{ "animation-duration": "4s" }} />
        <div class="particle top-1/3 right-1/4 animate-delay-300" style={{ "animation-duration": "5s" }} />
        <div class="particle top-1/2 left-1/3 animate-delay-500" style={{ "animation-duration": "3.5s" }} />
        <div class="particle top-2/3 right-1/3 animate-delay-700" style={{ "animation-duration": "4.5s" }} />
        <div class="particle bottom-1/4 left-1/2 animate-delay-200" style={{ "animation-duration": "3s" }} />
        <div class="particle top-1/5 right-1/5 animate-delay-1000 bg-alien-purple" style={{ "animation-duration": "5.5s" }} />
        <div class="particle bottom-1/3 left-1/5 animate-delay-500 bg-alien-teal" style={{ "animation-duration": "4.2s" }} />
      </div>

      {/* Star field overlay */}
      <div
        class="fixed inset-0 pointer-events-none opacity-30"
        style={{
          "background-image": "radial-gradient(2px 2px at 20px 30px, #39ff14, transparent), radial-gradient(2px 2px at 40px 70px, #9d4edd, transparent), radial-gradient(1px 1px at 90px 40px, #2ec4b6, transparent), radial-gradient(2px 2px at 130px 80px, #39ff14, transparent), radial-gradient(1px 1px at 160px 20px, #9d4edd, transparent), radial-gradient(1px 1px at 200px 50px, #2ec4b6, transparent)",
          "background-size": "200px 100px"
        }}
      />

      {/* Main content */}
      <div
        class={`transition-opacity duration-1000 ${isLoaded() ? 'opacity-100' : 'opacity-0'}`}
      >
        <Header />
        <main>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </div>

      {/* Loading screen */}
      <div
        class={`fixed inset-0 bg-alien-void flex items-center justify-center z-50 transition-opacity duration-500 ${
          isLoaded() ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div class="text-center">
          <div class="w-16 h-16 border-4 border-alien-glow/30 border-t-alien-glow rounded-full animate-spin mx-auto mb-4" />
          <p class="text-alien-glow font-mono text-sm animate-pulse">ESTABLISHING CONNECTION...</p>
        </div>
      </div>
    </div>
  );
};

export default App;
