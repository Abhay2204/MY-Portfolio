import React, { useRef, useEffect } from 'react';
import gsap from '../utils/gsap';
import { ScrollTrigger } from '../utils/gsap';
import { FaDownload } from 'react-icons/fa';

interface Certificate {
  id: number;
  type: string;
  title: string;
  organization: string;
  duration: string;
  issued: string;
  description: string;
  skills: string[];
  downloadUrl?: string;
}

const certificates: Certificate[] = [
  {
    id: 1,
    type: "INTERNSHIP",
    title: "Full Stack Software Development",
    organization: "Inspire Engineering Services",
    duration: "July 2024 - Jan 2025",
    issued: "2025",
    description: "Comprehensive industrial internship training program covering full-stack software development.",
    skills: ["Full Stack Development",  "Industrial Training"],
    downloadUrl: "/documents/Inspire Engineering.pdf"
  },
  {
    id: 2,
    type: "INTERNSHIP",
    title: "Java Full Stack Development",
    organization: "The Kiran Academy, Pune",
    duration: "Jan 2024 - June 2024",
    issued: "2024",
    description: "Specialized internship program focusing on Java full-stack development with hands-on project experience.",
    skills: ["Java", "Full Stack", "Spring Boot", "Web Development"],
    downloadUrl: "/documents/TheKiranAcademy_Abhay_Mallick.pdf"
  },
  {
    id: 3,
    type: "CERTIFICATION",
    title: "Essentials in Java for Professionals",
    organization: "Cadd Centre",
    duration: "Oct 2023 - Nov 2023",
    issued: "2024",
    description: "Hands-on training in essential Java programming concepts for professional development.",
    skills: ["Java Core", "Professional Development", "OOP"],
    downloadUrl: "/documents/CADD Java.pdf"
  },
  {
    id: 4,
    type: "WORKSHOP",
    title: "Web Design & Development Workshop",
    organization: "Satguru Institute",
    duration: "May 2022 - June 2022",
    issued: "2023",
    description: "Seven days intensive workshop covering web design principles and development fundamentals.",
    skills: ["HTML", "CSS", "JavaScript", "Web Design"],
    downloadUrl: "/documents/Satguru Institude web.pdf"
  },
  {
    id: 5,
    type: "INTERNSHIP",
    title: "Java Programming Internship",
    organization: "Soft-Tech Solutions",
    duration: "July 2023 - Aug 2023",
    issued: "2023",
    description: "Industrial internship training program focusing on Java programming fundamentals and applications.",
    skills: ["Java Programming", "Industrial Training"],
    downloadUrl: "/documents/soft tech java.pdf"
  },
  {
    id: 6,
    type: "TRAINING",
    title: "Web Application Development",
    organization: "Code Infosystem",
    duration: "Mar 2022 - Apr 2022",
    issued: "2022",
    description: "4-week industrial training program in web application development using PHP and MySQL.",
    skills: [ "MySQL", "Web Applications", "Database Management"],
    downloadUrl: "/documents/code infosystem web.pdf"
  }
];

const Certificates: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const container = scrollContainerRef.current;
    if (!section || !container) return;

    const ctx = gsap.context(() => {
      // Calculate the exact scroll distance needed
      const getMaxScroll = () => {
        const containerWidth = container.scrollWidth;
        const viewportWidth = window.innerWidth;
        // Subtract viewport width and add some padding to ensure last card is fully visible
        return -(containerWidth - viewportWidth);
      };

      // Horizontal parallax scroll
      gsap.to(container, {
        x: getMaxScroll,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${container.scrollWidth - window.innerWidth + 200}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen bg-bg-dark overflow-hidden">
      {/* Fade Text Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="text-[15vw] md:text-[12vw] font-serif font-bold text-white/[0.015] whitespace-nowrap">
          CERTIFICATES
        </span>
      </div>

      {/* Fixed Header */}
      <div className="absolute top-8 left-6 md:left-20 z-20 pointer-events-none">
        <h3 className="text-xs font-mono tracking-widest text-subtle uppercase mb-1">Certifications</h3>
        <p className="text-xs font-mono text-gray-600">Scroll to explore →</p>
      </div>

      {/* Horizontal Scrolling Container */}
      <div className="absolute inset-0 flex items-center">
        <div 
          ref={scrollContainerRef}
          className="flex gap-8 md:gap-12 px-6 md:px-20"
          style={{ width: 'max-content' }}
        >
          {certificates.map((cert, index) => (
            <div 
              key={cert.id}
              className="cert-card group relative w-[75vw] md:w-[420px] flex-shrink-0"
            >
              {/* Main Card - Minimal Design with Unique Interactions */}
              <div className="relative h-[60vh] bg-bg-dark border border-white/10 overflow-hidden group-hover:border-accent/50 transition-all duration-700 flex flex-col">
                
                {/* Fade Number - Top Right */}
                <div className="absolute top-6 right-6 text-7xl md:text-8xl font-serif text-white/[0.03] leading-none group-hover:text-accent/[0.08] transition-all duration-700 select-none pointer-events-none">
                  {String(index + 1).padStart(2, '0')}
                </div>

                {/* Animated Background Gradient on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent/0 via-accent/0 to-accent/0 group-hover:from-accent/[0.03] group-hover:via-transparent group-hover:to-transparent transition-all duration-700 pointer-events-none"></div>

                {/* Content */}
                <div className="relative flex-1 flex flex-col p-8 md:p-10 z-10">
                  
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3 pb-3 border-b border-white/5 group-hover:border-white/10 transition-colors duration-500">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-mono tracking-[0.3em] text-subtle uppercase group-hover:text-accent transition-colors duration-300">
                        {cert.type}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono text-subtle group-hover:text-off-white transition-colors duration-300">
                        {cert.issued}
                      </span>
                    </div>
                  </div>

                  {/* Title with 3D Tilt Effect */}
                  <h4 className="text-2xl md:text-3xl font-serif text-off-white mb-4 leading-tight italic group-hover:text-white group-hover:translate-x-1 transition-all duration-500 transform-gpu">
                    {cert.title}
                  </h4>

                  {/* Organization */}
                  <div className="mb-6 transform group-hover:translate-x-0.5 transition-transform duration-500">
                    <p className="text-sm font-sans text-subtle group-hover:text-off-white transition-colors duration-300 mb-2">
                      {cert.organization}
                    </p>
                    <p className="text-[10px] font-mono text-gray-600 tracking-wider group-hover:text-gray-500 transition-colors duration-300">
                      {cert.duration}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-gray-500 leading-relaxed mb-6 flex-grow group-hover:text-gray-400 transition-colors duration-300">
                    {cert.description}
                  </p>

                  {/* Skills with Stagger Animation */}
                  <div className="mt-auto">
                    <div className="flex flex-wrap gap-2 mb-6">
                      {cert.skills.map((skill, i) => (
                        <span 
                          key={i}
                          className="text-[9px] font-mono px-3 py-1.5 border border-white/10 text-subtle group-hover:border-accent/30 group-hover:text-accent transition-all duration-300 transform group-hover:scale-105"
                          style={{ transitionDelay: `${i * 50}ms` }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Download Button with Magnetic Effect */}
                    <button
                      onClick={() => cert.downloadUrl && window.open(cert.downloadUrl, '_blank')}
                      className="relative w-full flex items-center justify-center gap-3 px-4 py-3 border border-white/20 text-off-white overflow-hidden group/btn pointer-events-auto transition-all duration-300 group-hover:border-accent"
                    >
                      {/* Button Background Slide */}
                      <div className="absolute inset-0 bg-accent translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out"></div>
                      
                      <span className="relative text-[10px] font-mono tracking-widest uppercase z-10 group-hover/btn:text-white transition-colors">View Certificate</span>
                      <svg className="relative w-3 h-3 z-10 group-hover/btn:translate-x-1 group-hover/btn:text-white transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Animated Corner Accent */}
                <div className="absolute top-0 left-0 w-0 h-[1px] bg-accent group-hover:w-20 transition-all duration-700 ease-out"></div>
                <div className="absolute top-0 left-0 w-[1px] h-0 bg-accent group-hover:h-20 transition-all duration-700 ease-out delay-100"></div>
                
                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-accent group-hover:w-full transition-all duration-700 ease-out"></div>
              </div>
            </div>
          ))}

          {/* End Spacer - ensures last card can scroll fully into view */}
          <div className="w-[10vw] flex-shrink-0"></div>
        </div>
      </div>

      {/* Scroll Progress Indicator */}
      <div className="absolute bottom-16 left-6 md:left-20 right-6 md:right-20 z-20 pointer-events-none">
        <div className="flex items-center gap-4">
          <div className="flex-grow h-[1px] bg-white/10 relative overflow-hidden">
            <div className="scroll-progress absolute left-0 top-0 h-full w-0 bg-accent"></div>
          </div>
          <span className="text-[10px] font-mono text-subtle tracking-widest">SCROLL</span>
        </div>
      </div>
    </section>
  );
};

export default Certificates;
