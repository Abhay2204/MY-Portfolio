import React, { useEffect, useRef, useState } from 'react';
import gsap from '../utils/gsap';
import RobotChat from './RobotChat';

const heroContent = [
  { top: 'Abhay', bottom: 'Mallick' },
  { top: 'Full Stack', bottom: 'Engineer' },
  { top: 'Native', bottom: 'Platforms' },
  { top: 'Enterprise', bottom: 'Software' },
  { top: 'System', bottom: 'Architecture' },
  { top: "Let's", bottom: 'Build' }
];

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const firstNameRef = useRef<HTMLHeadingElement>(null);
  const lastNameRef = useRef<HTMLHeadingElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showGyroButton, setShowGyroButton] = useState(false);
  const [gyroEnabled, setGyroEnabled] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Glitch transition effect
  const glitchTransition = (topText: string, bottomText: string) => {
    const tl = gsap.timeline();

    tl.to([firstNameRef.current, lastNameRef.current], {
      opacity: 0,
      filter: 'blur(8px)',
      x: -10,
      duration: 0.08,
      ease: "power2.in"
    })
    .to([firstNameRef.current, lastNameRef.current], {
      opacity: 0.3,
      filter: 'blur(4px)',
      x: 5,
      duration: 0.05,
    })
    .to([firstNameRef.current, lastNameRef.current], {
      opacity: 0,
      filter: 'blur(10px)',
      x: -5,
      duration: 0.05,
    })
    .call(() => {
      if (firstNameRef.current) firstNameRef.current.textContent = topText;
      if (lastNameRef.current) lastNameRef.current.textContent = bottomText;
    })
    .to([firstNameRef.current, lastNameRef.current], {
      opacity: 0.5,
      filter: 'blur(6px)',
      x: 8,
      duration: 0.05,
    })
    .to([firstNameRef.current, lastNameRef.current], {
      opacity: 0.2,
      filter: 'blur(3px)',
      x: -3,
      duration: 0.05,
    })
    .to([firstNameRef.current, lastNameRef.current], {
      opacity: 1,
      filter: 'blur(0px)',
      x: 0,
      duration: 0.1,
      ease: "power2.out"
    });

    return tl;
  };

  // Auto change text every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        const nextIndex = (prev + 1) % heroContent.length;
        const content = heroContent[nextIndex];
        glitchTransition(content.top, content.bottom);
        return nextIndex;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (mobile && typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        setShowGyroButton(true);
      } else if (mobile) {
        setGyroEnabled(true);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const ctx = gsap.context(() => {
      const introTl = gsap.timeline({ delay: 0.2 });

      // Glitch boxes animation
      introTl.fromTo(".glitch-box",
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.8, stagger: 0.2, ease: "power3.out" }
      );

      // Main text reveal
      introTl.fromTo([firstNameRef.current, lastNameRef.current],
        { yPercent: 110, rotateX: -20, opacity: 0 },
        {
          yPercent: 0,
          rotateX: 0,
          opacity: 1,
          duration: 1.4,
          stagger: 0.1,
          ease: "power4.out",
          force3D: true,
        },
        "-=0.5"
      );

      // Specs Fade In
      introTl.fromTo(".hero-spec",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" },
        "-=1"
      );

      // Mouse Move Parallax (Desktop only)
      if (window.innerWidth >= 768) {
        const handleMouseMove = (e: MouseEvent) => {
          if (!containerRef.current) return;

          const { innerWidth, innerHeight } = window;
          const x = (e.clientX / innerWidth - 0.5) * 2;
          const y = (e.clientY / innerHeight - 0.5) * 2;

          gsap.to([firstNameRef.current, lastNameRef.current], {
            rotateY: x * 10,
            rotateX: -y * 10,
            x: x * 20,
            y: y * 20,
            duration: 1,
            ease: "power2.out",
            force3D: true,
            transformPerspective: 1000,
            overwrite: 'auto'
          });

          gsap.to(".hero-spec", {
            x: -x * 15,
            y: -y * 15,
            duration: 1.2,
            ease: "power2.out",
            overwrite: 'auto'
          });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
          window.removeEventListener('mousemove', handleMouseMove);
        };
      }

    }, containerRef);

    return () => {
      ctx.revert();
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Gyroscope effect
  useEffect(() => {
    if (!isMobile || !gyroEnabled) return;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (!containerRef.current) return;

      const gamma = e.gamma || 0;
      const beta = e.beta || 0;

      const x = Math.max(-1, Math.min(1, gamma / 45));
      const y = Math.max(-1, Math.min(1, (beta - 90) / 45));

      gsap.to([firstNameRef.current, lastNameRef.current], {
        rotateY: x * 15,
        rotateX: -y * 15,
        x: x * 30,
        y: y * 30,
        duration: 0.5,
        ease: "power2.out",
        force3D: true,
        transformPerspective: 1000,
        overwrite: 'auto'
      });
    };

    window.addEventListener('deviceorientation', handleOrientation, true);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, [isMobile, gyroEnabled]);

  const requestGyroPermission = async () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permissionState = await (DeviceOrientationEvent as any).requestPermission();
        if (permissionState === 'granted') {
          setGyroEnabled(true);
          setShowGyroButton(false);
        }
      } catch (error) {
        console.error('Error requesting gyroscope permission:', error);
      }
    } else {
      setGyroEnabled(true);
      setShowGyroButton(false);
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen flex flex-col justify-center items-center overflow-hidden bg-bg-dark perspective-[1000px]"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] bg-accent/20 rounded-full blur-[150px] animate-pulse"></div>
      </div>

      {/* Glitch Text Box - Left Side (Desktop Only) */}
      <div className="glitch-box hidden md:block absolute left-8 lg:left-16 top-[40%] -translate-y-1/2 z-20">
        <div className="relative px-5 py-4 border border-accent/30 bg-bg-dark/50 backdrop-blur-sm overflow-hidden group">
          {/* Glitch lines */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-accent animate-pulse" />
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-accent animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
          {/* Scanline effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent animate-scan pointer-events-none" />
          {/* Text */}
          <p className="text-xs font-mono text-accent uppercase tracking-[0.2em] glitch-text relative">
            <span className="relative z-10">Hey, I am</span>
          </p>
          <p className="text-lg font-mono text-off-white mt-1 relative z-10 font-bold">Abhay Mallick</p>
          <p className="text-sm font-mono text-subtle mt-2 relative z-10">Welcome to my portfolio</p>
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent" />
        </div>
      </div>

      {/* Typing Text - Bottom Left (Desktop Only) */}
      <div className="hidden md:block absolute left-8 lg:left-20 bottom-36 z-20 max-w-[280px]">
        <p className="text-[11px] font-mono text-subtle leading-relaxed typing-text">
          Crafting scalable web & mobile solutions
        </p>
        <p className="text-[11px] font-mono text-subtle leading-relaxed typing-text-2 mt-1">
          with modern technologies and animations.
        </p>
      </div>

      {/* Glitch Text Box - Right Side (Desktop Only) - Lower */}
      <div className="glitch-box hidden md:block absolute right-8 lg:right-16 top-2/3 -translate-y-1/2 z-20">
        <div className="relative px-5 py-4 border border-accent/30 bg-bg-dark/50 backdrop-blur-sm overflow-hidden group">
          {/* Glitch lines */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-accent animate-pulse" style={{ animationDelay: '0.3s' }} />
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-accent animate-pulse" style={{ animationDelay: '0.8s' }} />
          </div>
          {/* Scanline effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent animate-scan pointer-events-none" style={{ animationDelay: '1s' }} />
          {/* Text */}
          <p className="text-xs font-mono text-accent uppercase tracking-[0.2em] glitch-text relative">
            <span className="relative z-10">Currently Freelancing</span>
          </p>
          <p className="text-lg font-mono text-off-white mt-1 relative z-10 font-bold">1+ Year</p>
          {/* Corner accents */}
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-accent" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-accent" />
        </div>
      </div>

      {/* Top Specs */}
      <div className="absolute top-20 md:top-24 w-full px-4 md:px-8 lg:px-20 flex justify-between items-start text-[9px] md:text-[10px] lg:text-xs font-mono tracking-[0.15em] md:tracking-[0.2em] text-subtle uppercase z-20">
        <div className="hero-spec flex flex-col gap-1 md:gap-2">
          <span className="text-accent">● Available</span>
          <span className="hidden sm:inline">Based in India</span>
        </div>

        {/* EST. 2002 Badge - Mobile Only */}
        <div className="md:hidden hero-spec bg-bg-dark px-3 py-1 border border-white/10 rounded-full">
          <span className="text-[9px] font-mono text-white tracking-widest whitespace-nowrap">
            EST. 2002
          </span>
        </div>

        <div className="hero-spec flex-col items-end gap-6 text-right hidden md:flex">
          <div>
            <span>System Architecture</span><br />
            <span>Interactive Design</span>
          </div>

          <a
            href="/documents/Abhay Mallick 8421822204.pdf"
            target="_blank"
            rel="noreferrer"
            className="group relative px-5 py-2 border border-white/20 rounded-full overflow-hidden hover:border-accent transition-colors duration-300"
          >
            <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out will-change-transform"></div>
            <span className="relative text-[10px] font-bold tracking-widest uppercase text-white group-hover:text-white transition-colors z-10 flex items-center gap-2">
              <span>Download Resume</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
            </span>
          </a>
        </div>
      </div>

      {/* MAIN CONTENT CENTER */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full overflow-visible">
        {/* Upper Half */}
        <div className="hero-text-wrapper overflow-visible pb-2 md:pb-4 lg:pb-8 px-8">
          <h1
            ref={firstNameRef}
            className="text-[14vw] sm:text-[13vw] md:text-[11vw] leading-[0.9] font-serif font-medium text-off-white tracking-tighter will-change-transform text-center"
            style={{ transform: 'translate3d(0,0,0)', transformStyle: 'preserve-3d' }}
          >
            Abhay
          </h1>
        </div>

        {/* The Horizon Line - Desktop Only */}
        <div className="hidden md:block w-[85vw] sm:w-[75vw] md:w-[60vw] h-[1px] md:h-[2px] bg-accent relative my-4 md:my-6 lg:my-12">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-bg-dark px-3 md:px-4 py-1 hero-spec border border-white/10 rounded-full">
            <span className="text-[9px] md:text-[10px] lg:text-xs font-mono text-white tracking-widest whitespace-nowrap">
              EST. 2002
            </span>
          </div>
        </div>

        {/* Lower Half */}
        <div className="hero-text-wrapper overflow-visible pt-2 md:pt-4 lg:pt-8 px-8">
          <h1
            ref={lastNameRef}
            className="text-[14vw] sm:text-[13vw] md:text-[11vw] leading-[0.9] font-serif italic font-medium text-off-white tracking-tighter will-change-transform text-center"
            style={{ transform: 'translate3d(0,0,0)', transformStyle: 'preserve-3d' }}
          >
            Mallick
          </h1>
        </div>

        {/* Role Description */}
        <div className="mt-8 md:mt-12 lg:mt-16 text-center hero-spec flex flex-col items-center gap-1 md:gap-2 px-4">
          <h2 className="text-xs sm:text-sm md:text-xl font-mono tracking-[0.2em] md:tracking-[0.3em] uppercase text-accent font-bold">
            Full Stack Developer
          </h2>
          <p className="text-[10px] sm:text-xs md:text-sm text-subtle tracking-widest font-mono max-w-md px-2">
            BUILDING SCALABLE DIGITAL SOLUTIONS & IMMERSIVE UI
          </p>
        </div>
      </div>

      {/* Bottom Specs */}
      <div className="absolute bottom-8 md:bottom-12 w-full px-4 md:px-8 lg:px-20 flex justify-between items-end z-20">
        <div className="hero-spec text-subtle text-xs font-mono tracking-widest max-w-[150px] md:max-w-xs leading-relaxed hidden md:block">
          ENGINEERING ROBUST DIGITAL EXPERIENCES THROUGH CODE & DESIGN.
        </div>

        {showGyroButton && (
          <button
            onClick={requestGyroPermission}
            className="md:hidden group relative px-4 py-2 border border-accent/50 rounded-full overflow-hidden hover:border-accent transition-colors duration-300 bg-bg-dark/80 backdrop-blur-sm animate-pulse"
          >
            <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
            <span className="relative text-[9px] font-bold tracking-widest uppercase text-accent group-hover:text-white transition-colors z-10 flex items-center gap-2">
              <span>Enable Tilt</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
            </span>
          </button>
        )}

        <div className="hero-spec flex flex-col items-center gap-2 w-full md:w-auto md:mx-0">
          <div className="w-[1px] h-8 md:h-12 bg-white/30"></div>
          <span className="text-[9px] md:text-[10px] font-mono tracking-widest text-white/50 uppercase">Scroll</span>
        </div>
      </div>

      {/* Interactive Robot Chat - Desktop Only */}
      {!isMobile && <RobotChat />}

      {/* CSS for glitch animation */}
      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scan {
          animation: scan 3s linear infinite;
        }
        .glitch-text {
          text-shadow: 
            0.05em 0 0 rgba(255, 51, 0, 0.75),
            -0.025em -0.05em 0 rgba(0, 255, 255, 0.75),
            0.025em 0.05em 0 rgba(255, 0, 255, 0.75);
          animation: glitch 2s infinite;
        }
        @keyframes glitch {
          0%, 100% { text-shadow: 0.05em 0 0 rgba(255, 51, 0, 0.75), -0.025em -0.05em 0 rgba(0, 255, 255, 0.75), 0.025em 0.05em 0 rgba(255, 0, 255, 0.75); }
          14% { text-shadow: 0.05em 0 0 rgba(255, 51, 0, 0.75), -0.025em -0.05em 0 rgba(0, 255, 255, 0.75), 0.025em 0.05em 0 rgba(255, 0, 255, 0.75); }
          15% { text-shadow: -0.05em -0.025em 0 rgba(255, 51, 0, 0.75), 0.025em 0.025em 0 rgba(0, 255, 255, 0.75), -0.05em -0.05em 0 rgba(255, 0, 255, 0.75); }
          49% { text-shadow: -0.05em -0.025em 0 rgba(255, 51, 0, 0.75), 0.025em 0.025em 0 rgba(0, 255, 255, 0.75), -0.05em -0.05em 0 rgba(255, 0, 255, 0.75); }
          50% { text-shadow: 0.025em 0.05em 0 rgba(255, 51, 0, 0.75), 0.05em 0 0 rgba(0, 255, 255, 0.75), 0 -0.05em 0 rgba(255, 0, 255, 0.75); }
          99% { text-shadow: 0.025em 0.05em 0 rgba(255, 51, 0, 0.75), 0.05em 0 0 rgba(0, 255, 255, 0.75), 0 -0.05em 0 rgba(255, 0, 255, 0.75); }
        }
        .typing-text {
          overflow: hidden;
          white-space: nowrap;
          border-right: 2px solid transparent;
          animation: typing 2s steps(40, end) forwards;
        }
        .typing-text-2 {
          overflow: hidden;
          border-right: 2px solid rgba(255, 51, 0, 0.75);
          white-space: nowrap;
          width: 0;
          animation: typing 2s steps(40, end) 2.2s forwards, blink 0.75s step-end 2.2s infinite;
        }
        @keyframes typing {
          from { width: 0; }
          to { width: 100%; }
        }
        @keyframes blink {
          from, to { border-color: transparent; }
          50% { border-color: rgba(255, 51, 0, 0.75); }
        }
      `}</style>
    </section>
  );
};

export default Hero;
