import React, { useState, useRef, useEffect } from 'react';
import { NavItem } from '../types';
import { FaLinkedinIn, FaGithub, FaTwitter, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import gsap from '../utils/gsap';

const navItems: NavItem[] = [
  { label: 'ABOUT', href: '#about' },
  { label: 'WORK', href: '#work' },
  { label: 'CONTACT', href: '#contact' },
];

const Navigation: React.FC = () => {
  const [soundOn, setSoundOn] = useState(true); // Start as true since it will auto-play
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<HTMLLIElement[]>([]);

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

    // Handle visibility change - pause when tab is hidden
    const handleVisibilityChange = () => {
      if (audioRef.current) {
        if (document.hidden) {
          // Tab is hidden - pause audio
          audioRef.current.pause();
        } else {
          // Tab is visible - resume audio if sound is on
          if (soundOn) {
            audioRef.current.play().catch(error => {
              console.log('Audio playback failed:', error);
            });
          }
        }
      }
    };

    window.addEventListener('startAudio', handleStartAudio);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      // Cleanup
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      window.removeEventListener('startAudio', handleStartAudio);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [soundOn]);

  // Mobile menu animation
  useEffect(() => {
    if (!mobileMenuRef.current) return;

    if (mobileMenuOpen) {
      // Open animation
      gsap.to(mobileMenuRef.current, {
        x: 0,
        duration: 0.5,
        ease: "power3.out"
      });

      // Stagger menu items
      gsap.fromTo(menuItemsRef.current,
        { x: 50, opacity: 0 },
        { 
          x: 0, 
          opacity: 1, 
          duration: 0.4, 
          stagger: 0.1, 
          ease: "power2.out",
          delay: 0.2
        }
      );
    } else {
      // Close animation
      gsap.to(mobileMenuRef.current, {
        x: '100%',
        duration: 0.4,
        ease: "power3.in"
      });
    }
  }, [mobileMenuOpen]);

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

  const handleMobileNavClick = (href: string) => {
    setMobileMenuOpen(false);
    // Smooth scroll to section
    setTimeout(() => {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 400);
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
        className="fixed bottom-6 right-4 z-50 md:hidden w-12 h-12 rounded-full border border-white/20 flex flex-col items-center justify-center bg-bg-dark/80 backdrop-blur-sm gap-1 transition-all duration-300 hover:border-accent"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <span className={`w-4 h-[1.5px] bg-white transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-[3px]' : ''}`}></span>
        <span className={`w-4 h-[1.5px] bg-white transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-[3px]' : ''}`}></span>
      </button>

      {/* Mobile Menu Overlay */}
      <div 
        ref={mobileMenuRef}
        className="fixed top-0 right-0 w-full h-screen bg-bg-dark z-40 md:hidden translate-x-full"
        style={{ willChange: 'transform' }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-accent/20 rounded-full blur-[150px]"></div>
        </div>

        {/* Menu Content */}
        <div className="relative h-full flex flex-col justify-between p-8 pt-20">
          
          {/* Navigation Links */}
          <nav className="flex-1 flex flex-col justify-center gap-8">
            {navItems.map((item, index) => (
              <li 
                key={item.label}
                ref={el => { if (el) menuItemsRef.current[index] = el; }}
                className="list-none group"
              >
                <div className="flex items-baseline gap-4">
                  <span className="text-xs font-mono text-accent opacity-60">
                    0{index + 1}
                  </span>
                  <a 
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleMobileNavClick(item.href);
                    }}
                    className="text-5xl font-serif italic text-off-white hover:text-accent transition-colors duration-300"
                  >
                    {item.label}
                  </a>
                </div>
                <div className="w-full h-[1px] bg-white/10 mt-4 group-hover:bg-accent/30 transition-colors duration-300"></div>
              </li>
            ))}
          </nav>

          {/* Bottom Section - Social Links & Sound Toggle */}
          <div className="space-y-6">
            {/* Social Links */}
            <div className="flex gap-6 justify-center">
              <a 
                href="https://linkedin.com/in/abhaymallick2002/" 
                target="_blank" 
                rel="noreferrer" 
                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:border-accent hover:text-accent transition-all duration-300"
              >
                <FaLinkedinIn size={18} />
              </a>
              <a 
                href="https://github.com/Abhay2204" 
                target="_blank" 
                rel="noreferrer" 
                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:border-accent hover:text-accent transition-all duration-300"
              >
                <FaGithub size={18} />
              </a>
              <a 
                href="#" 
                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:border-accent hover:text-accent transition-all duration-300"
              >
                <FaTwitter size={18} />
              </a>
            </div>

            {/* Sound Toggle */}
            <div className="flex items-center justify-center gap-4">
              <span className="text-xs font-mono text-subtle uppercase tracking-widest">
                {soundOn ? 'Sound On' : 'Muted'}
              </span>
              <button 
                onClick={toggleSound}
                className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center hover:border-accent hover:text-accent transition-all duration-300"
              >
                {soundOn ? <FaVolumeUp size={16} /> : <FaVolumeMute size={16} />}
              </button>
            </div>

            {/* Email */}
            <div className="text-center">
              <a 
                href="mailto:abhaymallick.dev@gmail.com" 
                className="text-xs font-mono text-subtle hover:text-accent transition-colors"
              >
                abhaymallick.dev@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default Navigation;