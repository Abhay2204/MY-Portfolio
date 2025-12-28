import React, { useRef, useEffect } from 'react';
import gsap from '../utils/gsap';
import { ScrollTrigger } from '../utils/gsap';
import { FaLinkedinIn, FaGithub } from 'react-icons/fa';

const Footer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const linksContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
        // Parallax entrance for the footer content
        gsap.fromTo(linksContainerRef.current, 
            { y: 50, opacity: 0 },
            { 
                y: 0, 
                opacity: 1, 
                duration: 1, 
                ease: "power3.out",
                scrollTrigger: {
                    trigger: "#contact",
                    start: "top 75%"
                }
            }
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer id="contact" ref={containerRef} className="relative pt-32 pb-12 bg-bg-dark text-white border-t border-gray-900 overflow-hidden min-h-[80vh]">
      <div className="max-w-[95vw] mx-auto px-4 md:px-0">
        
        {/* Contact Info Header */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-12 px-4 md:px-8">
            <div className="flex flex-col gap-4">
                 <h4 className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase">Say Hello</h4>
            </div>
            <div className="text-right">
                <a href="mailto:abhaymallick.dev@gmail.com" className="text-sm md:text-base font-serif italic text-gray-400 hover:text-white transition-colors">
                    abhaymallick.dev@gmail.com
                </a>
            </div>
        </div>

        {/* MAIN INTERACTIVE AREA */}
        <div ref={linksContainerRef} className="w-full flex flex-col items-center">
            
            {/* LET'S TALK - Main CTA */}
            <div className="relative w-full border-t border-b border-gray-800 flex justify-center group cursor-pointer hover:bg-white/5 transition-colors duration-500 overflow-hidden">
                 <a 
                    href="mailto:abhaymallick.dev@gmail.com" 
                    className="relative block w-full text-center hover-trigger py-10 md:py-24"
                 >
                    <div className="relative inline-block origin-center">
                        {/* Outline Layer */}
                        <h1 
                            className="text-[13vw] md:text-[16vw] leading-[0.8] font-serif font-black uppercase whitespace-nowrap tracking-tighter select-none text-transparent transition-all duration-500"
                            style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)' }}
                        >
                            LET'S TALK
                        </h1>
                        
                        {/* Filled Layer */}
                        <div className="absolute top-0 left-0 w-full overflow-hidden h-0 group-hover:h-full transition-[height] duration-500 ease-in-out">
                             <h1 
                                className="text-[13vw] md:text-[16vw] leading-[0.8] font-serif font-black text-accent uppercase whitespace-nowrap tracking-tighter select-none"
                            >
                                LET'S TALK
                            </h1>
                        </div>
                    </div>
                 </a>
            </div>

            {/* Social Buttons */}
            <div className="flex flex-wrap justify-center gap-6 mt-12 md:mt-16">
                 <a 
                    href="https://linkedin.com/in/abhaymallick2002/" 
                    target="_blank" 
                    rel="noreferrer"
                    className="group relative px-8 py-3 border border-white/20 rounded-full overflow-hidden hover:border-accent transition-colors duration-300"
                 >
                    <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out will-change-transform"></div>
                    <span className="relative text-xs font-bold tracking-[0.2em] uppercase text-white z-10 flex items-center gap-3">
                        <FaLinkedinIn className="text-lg" />
                        LinkedIn
                    </span>
                 </a>

                 <a 
                    href="https://github.com/Abhay2204" 
                    target="_blank" 
                    rel="noreferrer"
                    className="group relative px-8 py-3 border border-white/20 rounded-full overflow-hidden hover:border-accent transition-colors duration-300"
                 >
                    <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out will-change-transform"></div>
                    <span className="relative text-xs font-bold tracking-[0.2em] uppercase text-white z-10 flex items-center gap-3">
                        <FaGithub className="text-lg" />
                        GitHub
                    </span>
                 </a>
            </div>

        </div>
        
        <div className="mt-20 flex flex-col md:flex-row justify-between items-center text-[10px] tracking-widest uppercase text-gray-600 font-mono px-4">
            <p>© 2025 ABHAY MALLICK</p>
            <p>BUILT WITH REACT, GSAP & TAILWIND</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;