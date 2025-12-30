import React, { useEffect, useRef, useState } from 'react';
import gsap from '../utils/gsap';
import { ScrollTrigger } from '../utils/gsap';
import RobotChat from './RobotChat';

// Hero content sequences for text morphing
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
    const currentIndexRef = useRef(0);

    // Glitch transition effect
    const glitchTransition = (topText: string, bottomText: string) => {
        const tl = gsap.timeline();

        // Glitch out
        tl.to([firstNameRef.current, lastNameRef.current], {
            opacity: 0,
            filter: 'blur(8px)',
            duration: 0.08,
            ease: "power2.in"
        })
            .to([firstNameRef.current, lastNameRef.current], {
                opacity: 0.3,
                filter: 'blur(4px)',
                duration: 0.05,
            })
            .to([firstNameRef.current, lastNameRef.current], {
                opacity: 0,
                filter: 'blur(10px)',
                duration: 0.05,
            })
            // Change text
            .call(() => {
                if (firstNameRef.current) firstNameRef.current.textContent = topText;
                if (lastNameRef.current) lastNameRef.current.textContent = bottomText;
            })
            // Glitch in
            .to([firstNameRef.current, lastNameRef.current], {
                opacity: 0.5,
                filter: 'blur(6px)',
                duration: 0.05,
            })
            .to([firstNameRef.current, lastNameRef.current], {
                opacity: 0.2,
                filter: 'blur(3px)',
                duration: 0.05,
            })
            .to([firstNameRef.current, lastNameRef.current], {
                opacity: 1,
                filter: 'blur(0px)',
                duration: 0.1,
                ease: "power2.out"
            });

        return tl;
    };

    useEffect(() => {
        // Check if mobile
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
            // Initial animation timeline
            const introTl = gsap.timeline({ delay: 0.2 });

            // 1. Fixed labels fade in
            introTl.fromTo(".hero-fixed-label",
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out" }
            );

            // 2. Main text reveal
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

            // 3. Specs Fade In
            introTl.fromTo(".hero-spec",
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" },
                "-=1"
            );

            // 4. Scroll-triggered text morphing with pin
            const scrollTl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "+=200%",
                    scrub: 0.5,
                    pin: true,
                    anticipatePin: 1,
                    onUpdate: (self) => {
                        const progress = self.progress;
                        const newIndex = Math.min(
                            Math.floor(progress * heroContent.length),
                            heroContent.length - 1
                        );

                        if (newIndex !== currentIndexRef.current) {
                            currentIndexRef.current = newIndex;
                            setCurrentIndex(newIndex);

                            const content = heroContent[newIndex];
                            glitchTransition(content.top, content.bottom);
                        }
                    }
                }
            });

            scrollTl.to({}, { duration: 1 });

            // 5. Mouse Move Parallax (Desktop only)
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

    // Gyroscope effect - Additive layer
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

            gsap.to(".hero-spec", {
                x: -x * 20,
                y: -y * 20,
                duration: 0.7,
                ease: "power2.out",
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
            {/* Background Gradient Mesh */}
            <div className="absolute inset-0 z-0 opacity-20">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] bg-accent/20 rounded-full blur-[150px] animate-pulse"></div>
            </div>

            {/* Fixed Label - "Hello, I am" - Top Left */}
            <div className="hero-fixed-label absolute top-32 md:top-40 left-6 md:left-20 z-20">
                <p className="text-lg md:text-2xl font-mono text-subtle tracking-wide">
                    Hello, I am
                </p>
            </div>

            {/* Fixed Label - "Developer" - Bottom Right */}
            <div className="hero-fixed-label absolute bottom-32 md:bottom-40 right-6 md:right-20 z-20">
                <p className="text-lg md:text-2xl font-mono text-accent tracking-wide text-right">
                    Developer
                </p>
            </div>

            {/* Progress Indicator */}
            <div className="absolute top-20 md:top-24 left-1/2 -translate-x-1/2 z-30">
                <div className="flex gap-1">
                    {heroContent.map((_, i) => (
                        <div
                            key={i}
                            className={`w-1 h-1 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-accent w-4' : 'bg-white/20'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Top Specs */}
            <div className="absolute top-20 md:top-24 w-full px-4 md:px-8 lg:px-20 flex justify-between items-start text-[9px] md:text-[10px] lg:text-xs font-mono tracking-[0.15em] md:tracking-[0.2em] text-subtle uppercase z-20">
                <div className="hero-spec flex flex-col gap-1 md:gap-2">
                    <span className="text-accent">● Available</span>
                    <span className="hidden sm:inline">Based in India</span>
                </div>

                <div className="hero-spec flex flex-col items-end gap-6 text-right hidden md:flex">
                    <div>
                        <span>System Architecture</span><br />
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

                {isMobile && gyroEnabled && !showGyroButton && (
                    <div className="md:hidden flex items-center gap-2 px-3 py-1.5 border border-accent/30 rounded-full bg-bg-dark/80 backdrop-blur-sm">
                        <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                        <span className="text-[9px] font-mono text-accent uppercase tracking-widest">Tilt Active</span>
                    </div>
                )}

                <div className="hero-spec flex flex-col items-center gap-2 mx-auto md:mx-0">
                    <div className="w-[1px] h-8 md:h-12 bg-white/30 animate-bounce"></div>
                    <span className="text-[9px] md:text-[10px] font-mono tracking-widest text-white/50 uppercase">Scroll</span>
                </div>
            </div>

            {/* Interactive Robot Chat - Desktop Only */}
            {!isMobile && <RobotChat />}
        </section>
    );
};

export default Hero;
