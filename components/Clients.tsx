import React, { useRef, useEffect, useState } from 'react';
import { FaReact, FaNodeJs, FaJava, FaDocker } from 'react-icons/fa';
import { SiSpringboot, SiKotlin, SiMongodb, SiSupabase, SiMysql, SiNextdotjs, SiFirebase, SiTailwindcss } from 'react-icons/si';

const techStack = [
    { name: "React.js", icon: <FaReact className="text-5xl text-[#61DAFB]" /> },
    { name: "Spring Boot", icon: <SiSpringboot className="text-5xl text-[#6DB33F]" /> },
    { name: "Node.js", icon: <FaNodeJs className="text-5xl text-[#339933]" /> },
    { name: "Kotlin", icon: <SiKotlin className="text-5xl text-[#7F52FF]" /> },
    { name: "MongoDB", icon: <SiMongodb className="text-5xl text-[#47A248]" /> },
    { name: "Supabase", icon: <SiSupabase className="text-5xl text-[#3ECF8E]" /> },
    { name: "MySQL", icon: <SiMysql className="text-5xl text-[#4479A1]" /> },
    { name: "Next.js", icon: <SiNextdotjs className="text-5xl text-white" /> },
    { name: "Firebase", icon: <SiFirebase className="text-5xl text-[#FFCA28]" /> },
    { name: "Tailwind", icon: <SiTailwindcss className="text-5xl text-[#06B6D4]" /> },
    { name: "Java", icon: <FaJava className="text-5xl text-[#007396]" /> },
    { name: "Docker", icon: <FaDocker className="text-5xl text-[#2496ED]" /> }
];

const Clients: React.FC = () => {
  const textContainerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!textContainerRef.current) return;
      const rect = textContainerRef.current.getBoundingClientRect();
      mousePos.current = { 
        x: e.clientX - rect.left, 
        y: e.clientY - rect.top 
      };
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    const textContainer = textContainerRef.current;
    if (textContainer) {
      textContainer.addEventListener('mousemove', handleMouseMove);
      textContainer.addEventListener('mouseenter', handleMouseEnter);
      textContainer.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (textContainer) {
        textContainer.removeEventListener('mousemove', handleMouseMove);
        textContainer.removeEventListener('mouseenter', handleMouseEnter);
        textContainer.removeEventListener('mouseleave', handleMouseLeave);
      }
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  useEffect(() => {
    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const animate = () => {
      // Smooth lerp animation
      cursorPos.current.x = lerp(cursorPos.current.x, mousePos.current.x, 0.12);
      cursorPos.current.y = lerp(cursorPos.current.y, mousePos.current.y, 0.12);

      if (cursorRef.current && revealRef.current) {
        // Move the glowing cursor
        cursorRef.current.style.transform = `translate(${cursorPos.current.x}px, ${cursorPos.current.y}px) translate(-50%, -50%)`;
        
        // Update the clip-path mask
        const radius = window.innerWidth > 768 ? 120 : 90;
        revealRef.current.style.clipPath = `circle(${radius}px at ${cursorPos.current.x}px ${cursorPos.current.y}px)`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  return (
    <section className="py-32 bg-bg-dark border-t border-white/5 relative overflow-hidden min-h-[80vh]">
      {/* Fade Text Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="text-[12vw] md:text-[10vw] font-serif font-bold text-white/[0.02] whitespace-nowrap">
          SKILLS
        </span>
      </div>
      
      <div className="px-6 md:px-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-20">
            <div className="md:col-span-2">
                <h3 className="text-xs font-mono tracking-widest text-subtle uppercase">Tech Stack</h3>
            </div>
            <div className="md:col-span-10">
                {/* Magnetic Cursor Reveal Text */}
                <div 
                  ref={textContainerRef}
                  className="relative py-8 hidden md:block"
                  style={{ cursor: 'none' }}
                >
                  {/* Base Text (Dark/Subtle) */}
                  <p className="text-xl md:text-3xl text-gray-700 font-sans font-light leading-relaxed max-w-4xl select-none">
                    I leverage a modern, robust set of <span className="italic font-serif">technologies</span> to build <span className="italic font-serif">high-performance</span> web and mobile applications.
                  </p>

                  {/* Revealed Text Layer with Circular Mask */}
                  <div 
                    ref={revealRef}
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      clipPath: 'circle(0px at 0px 0px)',
                    }}
                  >
                    <p className="text-xl md:text-3xl text-off-white font-sans font-light leading-relaxed max-w-4xl py-8">
                      I leverage a modern, robust set of <span className="text-accent italic font-serif">technologies</span> to build <span className="text-accent italic font-serif">high-performance</span> web and mobile applications.
                    </p>
                  </div>

                  {/* Glowing Red Cursor Circle */}
                  <div 
                    ref={cursorRef}
                    className={`absolute w-48 h-48 md:w-56 md:h-56 rounded-full pointer-events-none transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}
                    style={{
                      background: 'transparent',
                      left: 0,
                      top: 0,
                    }}
                  />
                </div>

                {/* Mobile Fallback - Normal Text */}
                <div className="block md:hidden">
                  <p className="text-xl text-off-white font-sans font-light leading-relaxed max-w-4xl">
                    I leverage a modern, robust set of <span className="text-accent italic font-serif">technologies</span> to build <span className="text-accent italic font-serif">high-performance</span> web and mobile applications.
                  </p>
                </div>
            </div>
        </div>

        {/* Minimal Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-t border-l border-white/10">
            {techStack.map((tech, i) => (
                <div 
                    key={i} 
                    className="aspect-[4/3] border-r border-b border-white/10 flex items-center justify-center relative hover:bg-white/[0.02] transition-colors duration-500 group overflow-hidden"
                >
                     {/* Text Name - Fades out and moves down on hover */}
                     <span className="text-lg md:text-xl font-sans text-subtle group-hover:opacity-0 group-hover:translate-y-4 transition-all duration-300 ease-out z-10">
                        {tech.name}
                     </span>
                     
                     {/* Icon - Fades in and scales up from small to normal */}
                     <div className="absolute inset-0 flex items-center justify-center opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 ease-out">
                        {tech.icon}
                     </div>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Clients;
