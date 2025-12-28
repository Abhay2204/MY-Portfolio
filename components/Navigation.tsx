import React, { useState, useRef, useEffect } from 'react';
import { NavItem } from '../types';
import { FaLinkedinIn, FaGithub, FaTwitter, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

const navItems: NavItem[] = [
  { label: 'ABOUT', href: '#about' },
  { label: 'WORK', href: '#work' },
  { label: 'CONTACT', href: '#contact' },
];

const Navigation: React.FC = () => {
  const [soundOn, setSoundOn] = useState(true); // Start as true since it will auto-play
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio('/assets/audio/background.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3; // Set volume to 30%

    // Listen for custom event to start audio
    const handleStartAudio = () => {
      if (audioRef.current) {
        audioRef.current.play().catch(error => {
          console.log('Audio playback failed:', error);
          setSoundOn(false);
        });
      }
    };

    window.addEventListener('startAudio', handleStartAudio);

    return () => {
      // Cleanup
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      window.removeEventListener('startAudio', handleStartAudio);
    };
  }, []);

  const toggleSound = () => {
    if (audioRef.current) {
      if (soundOn) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.log('Audio playback failed:', error);
        });
      }
      setSoundOn(!soundOn);
    }
  };

  return (
    <>
      {/* Top Right Menu - Clean line */}
      <nav className="fixed top-0 right-0 z-50 p-8 hidden md:block mix-blend-difference">
        <ul className="flex items-center gap-12">
          {navItems.map((item, index) => (
            <li key={item.label} className="group relative overflow-hidden">
               <span className="text-[10px] absolute -left-4 top-0 text-accent opacity-0 group-hover:opacity-100 transition-opacity">0{index + 1}</span>
              <a 
                href={item.href} 
                className="text-xs font-bold tracking-[0.2em] text-gray-300 hover:text-white transition-colors duration-300 hover-trigger"
              >
                {item.label}
              </a>
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-accent -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
            </li>
          ))}
        </ul>
      </nav>

      {/* Left Sidebar - Socials (Minimal dots) */}
      <aside className="fixed left-8 bottom-12 z-40 hidden md:flex flex-col gap-8 mix-blend-difference text-gray-400 items-center">
        <div className="w-[1px] h-20 bg-gray-600 mb-4"></div>
        <a href="https://linkedin.com/in/abhaymallick2002/" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors hover-trigger hover:scale-125 transform duration-300"><FaLinkedinIn size={16} /></a>
        <a href="https://github.com/Abhay2204" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors hover-trigger hover:scale-125 transform duration-300"><FaGithub size={16} /></a>
        <a href="#" className="hover:text-accent transition-colors hover-trigger hover:scale-125 transform duration-300"><FaTwitter size={16} /></a>
      </aside>

      {/* Right Sidebar - Sound Toggle */}
      <aside className="fixed right-8 bottom-12 z-40 hidden md:block mix-blend-difference">
        <div className="flex flex-col items-center gap-6">
          <span 
            className="vertical-text text-[9px] font-bold tracking-[0.3em] text-gray-500 uppercase transform rotate-180" 
            style={{ writingMode: 'vertical-rl' }}
          >
            {soundOn ? 'Sound On' : 'Muted'}
          </span>
          <button 
            onClick={toggleSound}
            className="w-10 h-10 border border-gray-700 rounded-full flex items-center justify-center hover:border-accent hover:text-accent transition-all duration-300 hover-trigger"
          >
            {soundOn ? <FaVolumeUp size={12} /> : <FaVolumeMute size={12} />}
          </button>
        </div>
      </aside>

      {/* Logo Top Left - Monogram */}
      <div className="fixed top-6 md:top-8 left-4 md:left-8 z-40 mix-blend-difference">
         <a href="#" className="block w-10 h-10 md:w-12 md:h-12 flex items-center justify-center hover-trigger group">
            <div className="relative font-serif font-black text-xl md:text-2xl text-white">
                A
                <span className="absolute -top-1 -right-2 w-2 h-2 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </div>
         </a>
      </div>

      {/* Mobile Menu Button - Bottom Right */}
      <button 
        className="fixed bottom-6 right-4 z-50 md:hidden w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-bg-dark/80 backdrop-blur-sm"
        onClick={() => {/* Add mobile menu toggle logic if needed */}}
      >
        <div className="flex flex-col gap-1">
          <span className="w-4 h-[1px] bg-white"></span>
          <span className="w-4 h-[1px] bg-white"></span>
        </div>
      </button>
    </>
  );
};

export default Navigation;