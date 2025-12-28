import React, { useEffect, useRef } from 'react';
import gsap from '../utils/gsap';

const About: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = textRef.current?.innerText.split(' ');
      if (textRef.current && words) {
        textRef.current.innerHTML = words.map(word => `<span class="inline-block opacity-20 blur-[2px] translate-y-2 transition-all duration-500 word-span will-change-transform">${word}</span>`).join(' ');
        
        gsap.to('.word-span', {
            opacity: 1,
            blur: 0,
            y: 0,
            filter: 'blur(0px)',
            stagger: 0.02,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
                trigger: textRef.current,
                start: "top 85%",
                end: "bottom 60%",
                scrub: 1
            }
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={containerRef} className="py-32 md:py-48 px-6 md:px-0 max-w-[90vw] mx-auto border-l border-gray-900 pl-4 md:pl-10 ml-4 md:ml-auto mr-auto md:mr-auto relative overflow-hidden min-h-[80vh]">
      {/* Fade Text Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="text-[12vw] md:text-[10vw] font-serif font-bold text-white/[0.02] whitespace-nowrap">
          PROFILE
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20 relative z-10">
        <div className="md:col-span-3 pt-2">
             <h3 className="text-xs font-bold tracking-[0.2em] text-accent uppercase mb-4 sticky top-32">Profile</h3>
        </div>
        <div className="md:col-span-9">
            <p ref={textRef} className="text-2xl md:text-5xl font-sans font-light leading-[1.3] text-[#F0F0F0] tracking-tight">
                I am a Computer Science Engineer and Full Stack Developer passionate about building robust web and mobile applications. From Spring Boot microservices to interactive React interfaces, I turn complex problems into efficient, scalable software.
            </p>
            <div className="mt-12 flex gap-4">
                 <div className="h-[1px] w-20 bg-gray-700 mt-3"></div>
                 <p className="text-sm text-gray-500 max-w-sm">
                    B.Tech in CSE (2024). Specializing in React.js, Node.js, Spring Boot, and Cloud Solutions.
                 </p>
            </div>
        </div>
      </div>
    </section>
  );
};

export default About;