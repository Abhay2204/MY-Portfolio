import React, { useRef, useState, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useReducedMotion,
  AnimatePresence
} from 'framer-motion';

interface Project {
  id: string;
  title: string;
  category: string;
  platform: 'Web' | 'Mobile' | 'Desktop';
  tech: string[];
  year: string;
  image: string;
  description: string;
  features: string[];
}

const projects: Project[] = [
  {
    id: "01",
    title: "Cosmic IDE",
    category: "Development Tool",
    platform: "Desktop",
    tech: ["React", "Django", "Electron"],
    year: "2024",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
    description: "AI-powered code editor with real-time collaboration, intelligent suggestions, and seamless git integration for modern development workflows.",
    features: ["AI Code Suggestions", "Live Collaboration", "Git Integration", "Custom Themes"]
  },
  {
    id: "02",
    title: "NE CRM",
    category: "Enterprise Software",
    platform: "Web",
    tech: ["React", "Node.js", "Supabase"],
    year: "2024",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
    description: "Enterprise-grade CRM with automated workflows, predictive analytics, and team collaboration tools for scaling businesses.",
    features: ["Pipeline Management", "Email Automation", "Analytics Dashboard", "Team Collaboration"]
  },
  {
    id: "03",
    title: "InsightFlow",
    category: "AI Analytics",
    platform: "Web",
    tech: ["React", "Gemini API", "Recharts"],
    year: "2023",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop",
    description: "Transform raw data into actionable insights with AI-driven dashboards, custom reports, and predictive analytics.",
    features: ["Predictive Analytics", "Custom Reports", "Data Visualization", "Export Tools"]
  },
  {
    id: "04",
    title: "Bit Campus",
    category: "Mobile Application",
    platform: "Mobile",
    tech: ["Kotlin", "Jetpack Compose"],
    year: "2023",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200&auto=format&fit=crop",
    description: "Smart campus companion app with scheduling, navigation, event updates, and social features for students.",
    features: ["Class Scheduling", "Campus Navigation", "Event Updates", "Social Feed"]
  },
  {
    id: "05",
    title: "DSA Guru",
    category: "Education Platform",
    platform: "Mobile",
    tech: ["React Native", "Vue.js"],
    year: "2023",
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=1200&auto=format&fit=crop",
    description: "Interactive DSA learning platform with visual algorithms, practice problems, and progress tracking.",
    features: ["Visual Algorithms", "Practice Problems", "Progress Tracking", "Code Playground"]
  },
  {
    id: "06",
    title: "Health Track",
    category: "Lifestyle App",
    platform: "Mobile",
    tech: ["MERN Stack"],
    year: "2022",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop",
    description: "Personal health companion with activity tracking, meal planning, sleep analysis, and AI wellness recommendations.",
    features: ["Activity Tracking", "Meal Planning", "Sleep Analysis", "Health Reports"]
  }
];

const springConfig = { stiffness: 150, damping: 25 };

const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case 'Web':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      );
    case 'Mobile':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    case 'Desktop':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
  }
};


interface ProjectRowProps {
  project: Project;
  index: number;
  onHover: (index: number | null) => void;
  isActive: boolean;
  onClick: () => void;
  isMobile: boolean;
}

const ProjectRow: React.FC<ProjectRowProps> = ({ project, index, onHover, isActive, onClick, isMobile }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isEven = index % 2 === 0;

  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, springConfig);
  const numberY = useTransform(smoothProgress, [0, 1], [80, -80]);

  return (
    <motion.div
      ref={rowRef}
      className="relative border-b border-white/5 group cursor-pointer"
      onMouseEnter={() => !isMobile && onHover(index)}
      onMouseLeave={() => !isMobile && onHover(null)}
      onClick={onClick}
    >
      <div className="relative z-10 py-16 md:py-24 px-6 md:px-20">
        <div className="grid grid-cols-12 gap-4 md:gap-8 items-center">

          {/* Number - opposite side of content */}
          <motion.div
            className={`col-span-2 md:col-span-2 ${isEven ? 'order-1 md:order-3' : 'order-1 md:order-1'}`}
            style={{ y: prefersReducedMotion ? 0 : numberY }}
          >
            <span
              className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold leading-none transition-all duration-500 block"
              style={{
                WebkitTextStroke: isActive ? '1.5px rgba(255,51,0,0.7)' : '1px rgba(255,255,255,0.15)',
                color: 'transparent'
              }}
            >
              {project.id}
            </span>
          </motion.div>

          {/* Main content - alternates left/right */}
          <div className={`col-span-10 md:col-span-6 ${isEven ? 'order-2 md:order-1' : 'order-2 md:order-3 md:text-right'}`}>
            {/* Platform badge */}
            <motion.div
              className={`flex items-center gap-2 text-accent mb-3 ${!isEven ? 'md:justify-end' : ''}`}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              {getPlatformIcon(project.platform)}
              <span className="text-xs font-mono tracking-widest uppercase">
                {project.platform}
              </span>
            </motion.div>

            <motion.span
              className="text-xs font-mono tracking-widest uppercase text-white/40 block mb-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {project.category}
            </motion.span>

            <div className="overflow-hidden">
              <motion.h3
                className="text-3xl md:text-5xl lg:text-6xl font-serif text-off-white tracking-tight leading-[0.95] transition-colors duration-300 group-hover:text-accent"
                initial={{ y: '100%' }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                {project.title}
              </motion.h3>
            </div>

            <motion.p
              className={`text-white/40 text-sm md:text-base mt-4 max-w-md line-clamp-2 ${!isEven ? 'md:ml-auto' : ''}`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {project.description}
            </motion.p>
          </div>

          {/* Meta - between number and content */}
          <div className={`col-span-12 md:col-span-4 mt-6 md:mt-0 order-3 md:order-2`}>
            <div className={`flex flex-row md:flex-col gap-4 md:gap-5 ${isEven ? 'md:items-end md:text-right' : 'md:items-start'}`}>
              <span className="text-sm font-mono text-white/30">{project.year}</span>

              <div className={`flex flex-wrap gap-2 ${isEven ? 'md:justify-end' : ''}`}>
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-mono px-2.5 py-1 rounded-full border border-white/10 text-white/40"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};


// Project Detail Modal
interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-bg-dark/95 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Modal */}
      <motion.div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-surface border border-white/10 rounded-2xl"
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
            style={{ filter: 'grayscale(30%)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/50 to-transparent" />

          {/* Number overlay */}
          <span className="absolute bottom-4 right-6 text-8xl md:text-9xl font-serif font-bold text-white/5">
            {project.id}
          </span>
        </div>

        {/* Content */}
        <div className="p-6 md:p-10 -mt-20 relative z-10">
          {/* Platform & Category */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2 text-accent">
              {getPlatformIcon(project.platform)}
              <span className="text-xs font-mono tracking-widest uppercase">{project.platform}</span>
            </div>
            <span className="w-px h-4 bg-white/20" />
            <span className="text-xs font-mono tracking-widest uppercase text-white/40">{project.category}</span>
            <span className="w-px h-4 bg-white/20" />
            <span className="text-xs font-mono text-white/40">{project.year}</span>
          </div>

          {/* Title */}
          <h2 className="text-4xl md:text-5xl font-serif text-off-white tracking-tight mb-6">
            {project.title}
          </h2>

          {/* Description */}
          <p className="text-white/60 text-base md:text-lg leading-relaxed mb-8 max-w-2xl">
            {project.description}
          </p>

          {/* Tech Stack */}
          <div className="mb-8">
            <h4 className="text-xs font-mono tracking-widest uppercase text-white/30 mb-3">Tech Stack</h4>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="text-sm font-mono px-4 py-2 rounded-full border border-white/10 text-white/60"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-xs font-mono tracking-widest uppercase text-white/30 mb-4">Key Features</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {project.features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg border border-accent/30 bg-accent/5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span className="text-sm text-white/70">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};


const Projects: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 100, damping: 20 });

  // Check for mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Cursor-following image (desktop only)
  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, isMobile]);

  return (
    <section
      id="work"
      ref={containerRef}
      className="relative bg-bg-dark overflow-hidden"
    >
      {/* Background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="text-[15vw] md:text-[12vw] font-serif font-bold text-white/[0.015] whitespace-nowrap">
          PROJECTS
        </span>
      </div>

      {/* Header */}
      <div className="relative z-10 pt-32 pb-16 px-6 md:px-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-xs font-mono text-accent tracking-widest uppercase block mb-6">
            Selected Work
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif text-off-white max-w-3xl leading-[1.1]">
            Crafting digital experiences that matter
          </h2>
        </motion.div>
      </div>

      {/* Projects list */}
      <div className="relative z-10 border-t border-white/5">
        {projects.map((project, index) => (
          <ProjectRow
            key={project.id}
            project={project}
            index={index}
            onHover={setActiveIndex}
            isActive={activeIndex === index}
            onClick={() => setSelectedProject(project)}
            isMobile={isMobile}
          />
        ))}
      </div>

      {/* Floating image - desktop only */}
      {!isMobile && (
        <motion.div
          className="fixed pointer-events-none z-50 overflow-hidden rounded-lg"
          style={{
            width: 280,
            height: 180,
            left: smoothX,
            top: smoothY,
            x: '-50%',
            y: '-50%'
          }}
        >
          <AnimatePresence mode="wait">
            {activeIndex !== null && (
              <motion.div
                key={activeIndex}
                className="w-full h-full"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={projects[activeIndex].image}
                  alt={projects[activeIndex].title}
                  className="w-full h-full object-cover"
                  style={{ filter: 'grayscale(100%) contrast(110%)' }}
                />
                <div className="absolute inset-0 bg-accent/10 mix-blend-multiply" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Features panel - desktop only */}
      {!isMobile && (
        <AnimatePresence>
          {activeIndex !== null && (
            <motion.div
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 max-w-[90vw]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-wrap items-center justify-center gap-3 px-6 py-3 bg-surface/90 backdrop-blur-md rounded-2xl border border-accent/30">
                {projects[activeIndex].features.map((feature, i) => (
                  <motion.div
                    key={feature}
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <span className="w-1 h-1 rounded-full bg-accent" />
                    <span className="text-xs font-mono text-white/70 whitespace-nowrap">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>

      {/* Footer */}
      <motion.div
        className="relative z-10 py-24 text-center border-t border-white/5"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <p className="text-white/30 text-sm font-mono mb-5">Want to collaborate?</p>
        <a
          href="#contact"
          className="inline-flex items-center gap-3 text-base font-medium text-off-white hover:text-accent transition-colors group"
        >
          <span>Get in touch</span>
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </motion.div>
    </section>
  );
};

export default Projects;
