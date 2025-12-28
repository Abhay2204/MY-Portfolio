import React, { useEffect, useRef, useState } from 'react';
import gsap from '../utils/gsap';
import RobotChat from './RobotChat';

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const firstNameRef = useRef<HTMLHeadingElement>(null);
  const lastNameRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showGyroButton, setShowGyroButton] = useState(false);
  const [gyroEnabled, setGyroEnabled] = useState(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Check if we need to show gyro permission button (iOS 13+)
      if (mobile && typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        setShowGyroButton(true);
      } else if (mobile) {
        // Android - enable gyro automatically
        setGyroEnabled(true);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const ctx = gsap.context(() => {
        const tl = gsap.timeline({ delay: 0.2 });

        // 1. The Horizon Line expands
        tl.fromTo(lineRef.current, 
            { scaleX: 0, opacity: 0 },
            { scaleX: 1, opacity: 1, duration: 1.2, ease: "expo.inOut" }
        );

        // 2. Text Reveal (Rise up / Fall down from the line)
        tl.fromTo([firstNameRef.current, lastNameRef.current],
            { yPercent: 110, rotateX: -20, opacity: 0 },
            { 
                yPercent: 0, 
                rotateX: 0,
                opacity: 1, 
                duration: 1.4, 
                stagger: 0.1, 
                ease: "power4.out",
                force3D: true,
                willChange: "transform, opacity"
            },
            "-=0.5"
        )
        // FIX: Allow overflow after animation so 3D tilt doesn't cut off
        .set(".hero-text-wrapper", { overflow: "visible" })
        .set([firstNameRef.current, lastNameRef.current], { willChange: "auto" });

        // 3. Technical Specs & Title Fade In
        tl.fromTo(".hero-spec", 
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" },
            "-=1"
        );

        // 4. Mouse Move Parallax (Desktop only)
        if (window.innerWidth >= 768) {
            // Desktop: Mouse parallax
            const handleMouseMove = (e: MouseEvent) => {
                if(!containerRef.current) return;
                
                const { innerWidth, innerHeight } = window;
                const x = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
                const y = (e.clientY / innerHeight - 0.5) * 2; // -1 to 1

                gsap.to([firstNameRef.current, lastNameRef.current], {
                    rotateY: x * 10,
                    rotateX: -y * 10,
                    x: x * 20,
                    y: y * 20,
                    duration: 1,
                    ease: "power2.out",
                    force3D: true,
                    transformPerspective: 1000
                });
                
                gsap.to(".hero-spec", {
                    x: -x * 15,
                    y: -y * 15,
                    duration: 1.2,
                    ease: "power2.out"
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

  // Separate effect for gyroscope
  useEffect(() => {
    if (!isMobile || !gyroEnabled) return;

    console.log('Gyroscope enabled - setting up listener');

    const handleOrientation = (e: DeviceOrientationEvent) => {
        if (!containerRef.current) return;
        
        // Get device orientation values
        const gamma = e.gamma || 0; // Left to right tilt (-90 to 90)
        const beta = e.beta || 0;   // Front to back tilt (-180 to 180)
        
        console.log('Gyro values:', { gamma, beta });
        
        // Normalize values to -1 to 1 range
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
            transformPerspective: 1000
        });
        
        gsap.to(".hero-spec", {
            x: -x * 20,
            y: -y * 20,
            duration: 0.7,
            ease: "power2.out"
        });
    };

    window.addEventListener('deviceorientation', handleOrientation, true);
    console.log('Gyroscope listener added');
    
    return () => {
        window.removeEventListener('deviceorientation', handleOrientation, true);
        console.log('Gyroscope listener removed');
    };
  }, [isMobile, gyroEnabled]);

  const requestGyroPermission = async () => {
    console.log('Requesting gyroscope permission...');
    
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permissionState = await (DeviceOrientationEvent as any).requestPermission();
        console.log('Permission state:', permissionState);
        if (permissionState === 'granted') {
          setGyroEnabled(true);
          setShowGyroButton(false);
        }
      } catch (error) {
        console.error('Error requesting gyroscope permission:', error);
      }
    } else {
      // Non-iOS devices - enable directly
      console.log('Non-iOS device - enabling gyroscope directly');
      setGyroEnabled(true);
      setShowGyroButton(false);
    }
  };

  return (
    <section 
        ref={containerRef} 
        className="relative w-full h-screen flex flex-col justify-center items-center overflow-hidden bg-bg-dark perspective-[1000px]"
    >
        {/* Background Gradient Mesh */}
        <div className="absolute inset-0 z-0 opacity-20">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] bg-accent/20 rounded-full blur-[150px] animate-pulse"></div>
        </div>

        {/* Top Specs */}
        <div className="absolute top-20 md:top-24 w-full px-4 md:px-8 lg:px-20 flex justify-between items-start text-[9px] md:text-[10px] lg:text-xs font-mono tracking-[0.15em] md:tracking-[0.2em] text-subtle uppercase z-20">
            <div className="hero-spec flex flex-col gap-1 md:gap-2">
                <span className="text-accent">● Available</span>
                <span className="hidden sm:inline">Based in India</span>
            </div>
            
            {/* Right Side: Specs + Resume Button */}
            <div className="hero-spec flex flex-col items-end gap-6 text-right hidden md:flex">
                <div>
                    <span>System Architecture</span><br/>
                    <span>Interactive Design</span>
                </div>
                
                <a 
                    href="/resume.pdf" 
                    target="_blank"
                    rel="noreferrer" 
                    className="group relative px-5 py-2 border border-white/20 rounded-full overflow-hidden hover:border-accent transition-colors duration-300"
                >
                    <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out will-change-transform"></div>
                    <span className="relative text-[10px] font-bold tracking-widest uppercase text-white group-hover:text-white transition-colors z-10 flex items-center gap-2">
                        <span>Download Resume</span>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    </span>
                </a>
            </div>
        </div>

        {/* MAIN CONTENT CENTER */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full">
            
            {/* Upper Half */}
            <div className="hero-text-wrapper overflow-hidden pb-2 md:pb-4 lg:pb-8">
                <h1 
                    ref={firstNameRef}
                    className="text-[18vw] sm:text-[16vw] md:text-[14vw] leading-[0.8] font-serif font-medium text-off-white tracking-tighter origin-bottom will-change-transform"
                    style={{ transform: 'translate3d(0,0,0)' }}
                >
                    Abhay
                </h1>
            </div>

            {/* The Horizon Line */}
            <div className="w-[85vw] sm:w-[75vw] md:w-[60vw] h-[1px] md:h-[2px] bg-accent relative my-4 md:my-6 lg:my-12">
                <div ref={lineRef} className="absolute inset-0 bg-accent w-full h-full origin-center"></div>
                
                {/* Floating Badge on Line */}
                <div className="absolute left-1/2 md:top-1/2 -top-3 md:-translate-y-1/2 -translate-x-1/2 bg-bg-dark px-3 md:px-4 py-1 hero-spec border border-white/10 rounded-full">
                    <span className="text-[9px] md:text-[10px] lg:text-xs font-mono text-white tracking-widest whitespace-nowrap">
                        EST. 2002
                    </span>
                </div>
            </div>

            {/* Lower Half */}
            <div className="hero-text-wrapper overflow-hidden pt-2 md:pt-4 lg:pt-8">
                 <h1 
                    ref={lastNameRef}
                    className="text-[18vw] sm:text-[16vw] md:text-[14vw] leading-[0.8] font-serif italic font-medium text-off-white tracking-tighter origin-top will-change-transform"
                    style={{ transform: 'translate3d(0,0,0)' }}
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
            
            {/* Gyroscope Enable Button - Mobile Only (iOS) */}
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
            
            {/* Gyroscope Active Indicator - Mobile Only */}
            {isMobile && gyroEnabled && !showGyroButton && (
                <div className="md:hidden flex items-center gap-2 px-3 py-1.5 border border-accent/30 rounded-full bg-bg-dark/80 backdrop-blur-sm">
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                    <span className="text-[9px] font-mono text-accent uppercase tracking-widest">Tilt Active</span>
                </div>
            )}
            
            <div className="hero-spec flex flex-col items-center gap-2 mx-auto md:mx-0">
                <div className="w-[1px] h-8 md:h-12 bg-white/30"></div>
                <span className="text-[9px] md:text-[10px] font-mono tracking-widest text-white/50 uppercase">Scroll</span>
            </div>
        </div>
        
        {/* Interactive Robot Chat - Desktop Only */}
        {!isMobile && <RobotChat />}
    </section>
  );
};

export default Hero;