import React, { useRef, useState, useEffect } from 'react';
import gsap from '../utils/gsap';

interface ServiceItem {
  id: number;
  title: string;
  description: string;
  image: string;
  projects: string[];
}

const services: ServiceItem[] = [
  { 
    id: 1, 
    title: 'Full Stack Dev', 
    description: 'React, Node.js, Spring Boot',
    image: '/assets/images/cosmic ide.png',
    projects: ['Resume Builder', 'Cosmic IDE', 'CRM', 'DSA Guru']
  },
  { 
    id: 2, 
    title: 'Mobile Apps', 
    description: 'Kotlin & Jetpack Compose',
    image: '/assets/images/dsa guru.png',
    projects: ['Bit Campus Navigator', 'SLRS Student Learning Recommendation System', 'Health Tracker', 'Beyond Bark']
  },
  { 
    id: 3, 
    title: 'AI Solutions', 
    description: 'Gemini API & Analytics',
    image: '/assets/images/insightflow.png',
    projects: ['Pox Type Detector', 'House Price Prediction', 'Dog Mood Detection', 'Fake News Detector']
  },
  { 
    id: 4, 
    title: 'System Design', 
    description: 'Microservices & SQL',
    image: '/assets/images/ne crm.png',
    projects: ['Dev OS', 'NE CRM', 'Student Fees and Attendance Management System', 'Medical Store Inventory Management System']
  },
];

const Services: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const onMove = (e: MouseEvent) => {
        if (!imageRef.current || !containerRef.current) return;
        
        const rect = containerRef.current.getBoundingClientRect();
        const isInSection = e.clientY >= rect.top && e.clientY <= rect.bottom;
        
        if (!isInSection) {
            setActiveIndex(null);
            return;
        }
        
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
  }, [isMobile]);

  useEffect(() => {
    if (imageRef.current && !isMobile) {
        gsap.to(imageRef.current, {
            scale: activeIndex !== null ? 1 : 0,
            opacity: activeIndex !== null ? 1 : 0,
            duration: 0.4,
            ease: "power2.out"
        });
    }
  }, [activeIndex, isMobile]);

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
                    onMouseEnter={() => !isMobile && setActiveIndex(index)}
                    onMouseLeave={() => !isMobile && setActiveIndex(null)}
                    className="group relative border-b border-white/10 py-12 md:py-16 px-6 md:px-20 flex justify-between items-center md:cursor-none hover:bg-white/5 transition-colors duration-500"
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

        {/* Floating Image with Projects - Desktop Only */}
        {!isMobile && (
          <div 
              ref={imageRef}
              className="fixed top-0 left-0 pointer-events-none z-[60] -translate-x-1/2 -translate-y-1/2 will-change-transform flex gap-4"
              style={{ opacity: 0, transform: 'scale(0) translate(-50%, -50%)' }}
          >
              {/* Image */}
              <div className="w-[280px] h-[350px] overflow-hidden rounded-lg bg-surface">
                  {activeIndex !== null && (
                    <img 
                      src={services[activeIndex].image}
                      alt={services[activeIndex].title}
                      className="w-full h-full object-cover"
                      style={{ filter: 'grayscale(50%) contrast(110%)' }}
                    />
                  )}
              </div>
              
              {/* Projects List */}
              <div className="flex flex-col justify-center gap-3 py-4">
                {activeIndex !== null && services[activeIndex].projects.map((project, i) => (
                  <div 
                    key={i}
                    className="flex items-center gap-3"
                  >
                    <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                    <span className="text-sm font-mono text-off-white whitespace-nowrap">
                      {project}
                    </span>
                  </div>
                ))}
              </div>
          </div>
        )}
    </section>
  );
};

export default Services;
