import React, { useRef, useEffect } from 'react';
import gsap from '../utils/gsap';
import Robot3D from './Robot3D';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Entrance animation for the text
    gsap.fromTo(textRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, delay: 0.5, ease: "power2.out" }
    );
  }, []);

  const handleStart = () => {
    // Trigger audio start event
    window.dispatchEvent(new Event('startAudio'));
    
    const ctx = gsap.context(() => {
        const tl = gsap.timeline({
            onComplete: onComplete
        });

        // Text fade out
        tl.to(textRef.current, {
            opacity: 0,
            y: -20,
            duration: 0.3
        });

        // Button exit
        tl.to(buttonRef.current, {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in"
        }, "<");

        // Screen wipe
        tl.to(containerRef.current, {
            yPercent: -100,
            duration: 1.2,
            ease: "power4.inOut"
        });
    }, containerRef);
  };

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-[100] bg-bg-dark flex flex-col items-center justify-center"
    >
      <div className="mb-10 text-center">
        {/* 3D Robot */}
        <div className="flex items-center justify-center mb-8 mx-auto">
            <Robot3D size={100} />
        </div>
        
        {/* Welcome Message */}
        <h2 
            ref={textRef}
            className="text-2xl md:text-4xl font-serif italic text-off-white tracking-wide opacity-0"
        >
            Welcome to my world
        </h2>
      </div>
      
      <button
        ref={buttonRef}
        onClick={handleStart}
        className="px-8 py-3 border border-gray-600 rounded-full text-sm tracking-[0.2em] hover:bg-white hover:text-black transition-colors duration-300 uppercase hover-trigger"
      >
        Start Experience
      </button>
      
      {/* Audio hint */}
      <p className="absolute bottom-12 text-xs text-gray-600 font-mono flex items-center gap-2">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
        </svg>
        Sound will play
      </p>
    </div>
  );
};

export default SplashScreen;