import React, { useState } from 'react';
import CustomCursor from './components/CustomCursor';
import SplashScreen from './components/SplashScreen';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import History from './components/History';
import Clients from './components/Clients';
import Certificates from './components/Certificates';
import Projects from './components/Projects';
import Gallery from './components/Gallery';
import Footer from './components/Footer';

function App() {
  const [isStarted, setIsStarted] = useState(false);

  return (
    <div className="bg-bg-dark min-h-screen text-off-white selection:bg-accent selection:text-white">
      {/* 
         Custom Cursor is always rendered, but interacts differently based on z-index 
         and mix-blend-mode.
      */}
      <div className="hidden md:block">
        <CustomCursor />
      </div>

      {!isStarted && (
        <SplashScreen 
          onComplete={() => setIsStarted(true)}
        />
      )}

      <div className={`transition-opacity duration-1000 ${isStarted ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
        <Navigation />
        
        <main>
            <Hero />
            <About />
            <Services />
            <History />
            <Clients />
            <Certificates />
            <Projects />
            <Gallery />
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default App;