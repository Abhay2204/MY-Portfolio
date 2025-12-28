import React, { useRef, useState, useEffect } from 'react';
import gsap from '../utils/gsap';
import { ServiceItem } from '../types';

const services: ServiceItem[] = [
  { id: 1, title: 'Full Stack Dev', description: 'React, Node.js, Spring Boot' },
  { id: 2, title: 'Mobile Apps', description: 'Kotlin & Jetpack Compose' },
  { id: 3, title: 'AI Solutions', description: 'Gemini API & Analytics' },
  { id: 4, title: 'System Design', description: 'Microservices & SQL' },
];

// Abstract/Tech-themed images
const images = [
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop", // Coding
  "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1000&auto=format&fit=crop", // Mobile
  "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop", // AI
  "https://images.unsplash.com/photo-1558494949-ef526b0042a0?q=80&w=1000&auto=format&fit=crop"  // Server
];

const Services: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
        if (!imageRef.current || !containerRef.current) return;
        
        // Check if mouse is within the section
        const rect = containerRef.current.getBoundingClientRect();
        const isInSection = e.clientY >= rect.top && e.clientY <= rect.bottom;
        
        if (!isInSection) {
            setActiveIndex(null);
            return;
        }
        
        // Move image with cursor
        const { clientX, clientY } = e;
        
        gsap.to(imageRef.current, {
            x: clientX,
            y: clientY,
            duration: 0.8,
            ease: "power3.out"
        });
    };

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useEffect(() => {
    // Show/Hide image based on activeIndex
    if (imageRef.current) {
        gsap.to(imageRef.current, {
            scale: activeIndex !== null ? 1 : 0,
            opacity: activeIndex !== null ? 1 : 0,
            duration: 0.4,
            ease: "power2.out"
        });
    }
  }, [activeIndex]);

  return (
    <section id="work" ref={containerRef} className="py-32 w-full bg-bg-dark relative z-20 overflow-hidden min-h-screen">
        {/* Fade Text Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="text-[12vw] md:text-[10vw] font-serif font-bold text-white/[0.02] whitespace-nowrap">
            EXPERTISE
          </span>
        </div>
        
        <div className="px-6 md:px-20 mb-10 flex justify-between items-end relative z-10">
             <h3 className="text-xs font-mono tracking-widest text-subtle uppercase">Core Expertise</h3>
        </div>
        
        <div className="flex flex-col w-full border-t border-white/10 relative z-10">
            {services.map((service, index) => (
                <div 
                    key={service.id} 
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                    className="group relative border-b border-white/10 py-12 md:py-16 px-6 md:px-20 flex justify-between items-center cursor-none hover:bg-white/5 transition-colors duration-500"
                >
                    <h2 className="text-4xl md:text-7xl font-serif text-off-white group-hover:text-accent transition-colors duration-300 italic">
                        {service.title}
                    </h2>
                    <span className="hidden md:block text-xs font-mono text-subtle uppercase tracking-widest group-hover:text-white transition-colors">
                        {service.description}
                    </span>
                </div>
            ))}
        </div>

        {/* Floating Image Reveal */}
        <div 
            ref={imageRef}
            className="fixed top-0 left-0 w-[300px] h-[400px] pointer-events-none z-[60] overflow-hidden mix-blend-normal rounded-lg -translate-x-1/2 -translate-y-1/2 will-change-transform"
            style={{ opacity: 0, transform: 'scale(0) translate(-50%, -50%)' }}
        >
            <div 
                className="w-full h-full bg-cover bg-center transition-all duration-500"
                style={{ 
                    backgroundImage: activeIndex !== null ? `url(${images[activeIndex]})` : 'none',
                    filter: 'grayscale(100%) contrast(120%)'
                }}
            />
        </div>
    </section>
  );
};

export default Services;