import React, { useRef, useEffect, useState } from 'react';
import gsap from '../utils/gsap';
import { ScrollTrigger } from '../utils/gsap';
import { FaArrowRight } from 'react-icons/fa';

interface Project {
  id: string;
  title: string;
  category: string;
  tech: string;
  description: string[];
  year: string;
  link?: string;
  image: string;
}

const projects: Project[] = [
  {
    id: "01",
    title: "Cosmic IDE",
    category: "Development Tool",
    tech: "React, Django, Electron",
    year: "2024",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop",
    description: [
      "A fully functional 'light vibe' coding IDE.",
      "Build, create, and solve issues with 20+ AI models.",
      "Supports custom extensions and 10+ languages."
    ]
  },
  {
    id: "02",
    title: "NE CRM",
    category: "Enterprise Software",
    tech: "React, Node.js, Supabase",
    year: "2024",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop",
    description: [
      "Inventory and workforce management platform.",
      "Automated stock tracking and real-time insights.",
      "Complex analytics dashboards with Chart.js."
    ]
  },
  {
    id: "03",
    title: "InsightFlow",
    category: "AI Analytics",
    tech: "React, Gemini API, Recharts",
    year: "2023",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop",
    description: [
      "AI assistant delivering business insights via chat.",
      "Real-time charts and exportable dashboards.",
      "Instant data visualization from natural language."
    ]
  },
  {
    id: "04",
    title: "Bit Campus",
    category: "Mobile App",
    tech: "Kotlin, Jetpack Compose",
    year: "2023",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1000&auto=format&fit=crop",
    description: [
      "Indoor navigation Android app with searchable maps.",
      "Reduced average navigation time by 40%.",
      "Optimized pathfinding algorithms."
    ]
  },
  {
    id: "05",
    title: "DSA Guru",
    category: "Education Platform",
    tech: "React Native, Vue.js",
    year: "2023",
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=1000&auto=format&fit=crop",
    description: [
      "Learn DSA from scratch to advanced levels.",
      "Visual representation of code execution.",
      "200+ practice questions and modules."
    ]
  },
  {
    id: "06",
    title: "Health Track",
    category: "Lifestyle",
    tech: "MERN Stack",
    year: "2022",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1000&auto=format&fit=crop",
    description: [
      "Comprehensive health and lifestyle tracking.",
      "Calorie tracking and daily routine planning.",
      "Progress monitoring with detailed reports."
    ]
  }
];

const Projects: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const mousePos = useRef({ x: 0, y: 0 });
  const cardPos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>();
  const [isInSection, setIsInSection] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
        const rows = gsap.utils.toArray('.project-row');
        
        rows.forEach((row: any) => {
            gsap.fromTo(row, 
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: row,
                        start: "top 85%",
                        end: "top 50%",
                        scrub: 1,
                        once: false
                    }
                }
            );
        });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Track if mouse is in the projects section (desktop only)
  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const inSection = e.clientY >= rect.top && e.clientY <= rect.bottom && 
                        e.clientX >= rect.left && e.clientX <= rect.right;
      
      setIsInSection(inSection);
      
      if (!inSection) {
        setHoveredProject(null);
      }
    };

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // Hide card if section is out of view
      if (rect.bottom < 0 || rect.top > window.innerHeight) {
        setHoveredProject(null);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile]);

  // Mouse tracking (desktop only)
  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile]);

  // Lerp animation for smooth following (desktop only)
  useEffect(() => {
    if (isMobile) return;

    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const animate = () => {
      cardPos.current.x = lerp(cardPos.current.x, mousePos.current.x, 0.1);
      cardPos.current.y = lerp(cardPos.current.y, mousePos.current.y, 0.1);

      if (cardRef.current) {
        cardRef.current.style.transform = `translate(${cardPos.current.x}px, ${cardPos.current.y}px) translate(-50%, -50%)`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [isMobile]);

  // Morph animation when hovering (desktop only)
  useEffect(() => {
    if (isMobile || !cardRef.current) return;

    if (hoveredProject) {
      // Expand to card
      gsap.to(cardRef.current, {
        width: 400,
        height: 500,
        borderRadius: 12,
        opacity: 1,
        duration: 0.6,
        ease: "power3.out"
      });
    } else {
      // Shrink to dot
      gsap.to(cardRef.current, {
        width: 20,
        height: 20,
        borderRadius: '50%',
        opacity: 0,
        duration: 0.4,
        ease: "power2.in"
      });
    }
  }, [hoveredProject, isMobile]);

  return (
    <section id="work" ref={containerRef} className="py-32 px-6 md:px-20 bg-bg-dark border-t border-white/5 relative overflow-hidden min-h-screen">
        {/* Fade Text Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="text-[12vw] md:text-[10vw] font-serif font-bold text-white/[0.02] whitespace-nowrap">
            PROJECTS
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 relative z-10">
            
            {/* Sticky Header */}
            <div className="md:col-span-2 hidden md:block">
                 <div className="sticky top-32">
                    <h3 className="text-xs font-mono tracking-widest text-subtle uppercase mb-4">Selected Works</h3>
                    <span className="text-[10px] text-accent font-mono">({projects.length})</span>
                 </div>
            </div>

            {/* Mobile Header */}
            <div className="md:col-span-12 block md:hidden mb-8">
                <h3 className="text-xs font-mono tracking-widest text-subtle uppercase">Selected Works</h3>
            </div>

            {/* Project List */}
            <div className="md:col-span-10 flex flex-col">
                {projects.map((project, index) => (
                    <div 
                        key={index} 
                        className="project-row group relative border-t border-white/10 py-12 transition-all duration-500 hover:bg-white/[0.02]"
                        onMouseEnter={() => !isMobile && isInSection && setHoveredProject(project)}
                        onMouseLeave={() => !isMobile && setHoveredProject(null)}
                        onClick={() => isMobile && setSelectedProject(project)}
                    >
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 md:gap-0 relative z-10">
                            
                            {/* Left: Title & ID */}
                            <div className="md:w-5/12 flex flex-col gap-2">
                                <div className="flex items-baseline gap-4">
                                    <span className="text-xs font-mono text-accent opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                        {project.id}
                                    </span>
                                    <h3 className="text-4xl md:text-5xl font-serif text-off-white group-hover:text-accent transition-colors duration-300 cursor-pointer">
                                        {project.title}
                                    </h3>
                                </div>
                                <span className="text-xs font-mono text-subtle uppercase tracking-widest ml-0 md:ml-8 group-hover:text-white transition-colors delay-75">
                                    {project.category}
                                </span>
                            </div>

                            {/* Middle: Description */}
                            <div className="md:w-4/12 flex flex-col gap-4">
                                <p className="text-sm text-gray-400 font-sans leading-relaxed group-hover:text-gray-300 transition-colors">
                                    {project.description[0]}
                                </p>
                                <ul className="flex flex-wrap gap-2">
                                    {project.tech.split(',').map((t, i) => (
                                        <li key={i} className="text-[10px] font-mono border border-white/10 px-2 py-1 rounded-full text-subtle group-hover:border-white/30 transition-colors">
                                            {t.trim()}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Right: Year & Arrow */}
                            <div className="md:w-2/12 flex flex-row md:flex-col justify-between md:items-end items-center mt-4 md:mt-0">
                                <span className="text-xs font-mono text-subtle">{project.year}</span>
                                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-accent group-hover:bg-accent group-hover:text-white transition-all duration-300 transform group-hover:-rotate-45 cursor-pointer">
                                    <FaArrowRight size={12} />
                                </div>
                            </div>

                        </div>
                    </div>
                ))}
                {/* Closing Border */}
                <div className="w-full h-[1px] bg-white/10"></div>
            </div>
        </div>

        {/* Floating Project Card - Desktop Only - Morphs from dot to card */}
        {!isMobile && (
          <div 
            ref={cardRef}
            className="fixed top-0 left-0 pointer-events-none z-[60] overflow-hidden bg-surface border border-accent/30"
            style={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              opacity: 0,
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            }}
          >
            {hoveredProject && (
              <div className="w-full h-full flex flex-col">
                {/* Project Image */}
                <div className="relative w-full h-48 overflow-hidden">
                  <img 
                    src={hoveredProject.image} 
                    alt={hoveredProject.title}
                    className="w-full h-full object-cover"
                    style={{ filter: 'grayscale(100%) contrast(120%)' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>
                </div>

                {/* Project Details */}
                <div className="p-6 flex-1 flex flex-col">
                  {/* Header */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-[10px] font-mono text-accent">{hoveredProject.id}</span>
                      <h3 className="text-2xl font-serif text-off-white italic">
                        {hoveredProject.title}
                      </h3>
                    </div>
                    <p className="text-[10px] font-mono text-subtle uppercase tracking-widest">
                      {hoveredProject.category}
                    </p>
                  </div>

                  {/* Tech Stack */}
                  <div className="mb-4">
                    <h4 className="text-[9px] font-mono tracking-widest text-subtle uppercase mb-2">Tech Stack</h4>
                    <div className="flex flex-wrap gap-1">
                      {hoveredProject.tech.split(',').map((t, i) => (
                        <span 
                          key={i} 
                          className="text-[9px] font-mono border border-accent/30 px-2 py-1 rounded-full text-accent"
                        >
                          {t.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex-1">
                    <h4 className="text-[9px] font-mono tracking-widest text-subtle uppercase mb-2">Features</h4>
                    <ul className="space-y-1">
                      {hoveredProject.description.slice(0, 3).map((desc, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-400">
                          <span className="text-accent text-[10px] mt-0.5">●</span>
                          <span className="text-[11px] leading-relaxed">{desc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Year */}
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <span className="text-[10px] font-mono text-subtle">{hoveredProject.year}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mobile Project Modal */}
        {isMobile && selectedProject && (
          <div 
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <div 
              className="relative w-full max-w-md bg-surface border border-accent/30 rounded-lg overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-bg-dark/80 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:border-accent transition-colors"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>

              {/* Project Image */}
              <div className="relative w-full h-48 overflow-hidden">
                <img 
                  src={selectedProject.image} 
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                  style={{ filter: 'grayscale(100%) contrast(120%)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>
              </div>

              {/* Project Details */}
              <div className="p-6 flex flex-col">
                {/* Header */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-[10px] font-mono text-accent">{selectedProject.id}</span>
                    <h3 className="text-2xl font-serif text-off-white italic">
                      {selectedProject.title}
                    </h3>
                  </div>
                  <p className="text-[10px] font-mono text-subtle uppercase tracking-widest">
                    {selectedProject.category}
                  </p>
                </div>

                {/* Tech Stack */}
                <div className="mb-4">
                  <h4 className="text-[9px] font-mono tracking-widest text-subtle uppercase mb-2">Tech Stack</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedProject.tech.split(',').map((t, i) => (
                      <span 
                        key={i} 
                        className="text-[9px] font-mono border border-accent/30 px-2 py-1 rounded-full text-accent"
                      >
                        {t.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="mb-4">
                  <h4 className="text-[9px] font-mono tracking-widest text-subtle uppercase mb-2">Features</h4>
                  <ul className="space-y-2">
                    {selectedProject.description.map((desc, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-400">
                        <span className="text-accent text-[10px] mt-0.5">●</span>
                        <span className="text-[11px] leading-relaxed">{desc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Year */}
                <div className="pt-4 border-t border-white/10">
                  <span className="text-[10px] font-mono text-subtle">{selectedProject.year}</span>
                </div>
              </div>
            </div>
          </div>
        )}
    </section>
  );
};

export default Projects;
