import { Component } from 'solid-js';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import GridBackground from './components/GridBackground';
import Scanlines from './components/Scanlines';

const App: Component = () => {
  return (
    <>
      <Scanlines />
      <GridBackground />
      <Header />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  );
};

export default App;
