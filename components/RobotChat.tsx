import React, { useState, useRef, useEffect } from 'react';
import gsap from '../utils/gsap';
import Robot3D from './Robot3D';

interface ChatOption {
  id: string;
  label: string;
  response: string;
  scrollTo?: string; // Section ID to scroll to
}

const RobotChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResponse, setShowResponse] = useState(false);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);

  const chatOptions: ChatOption[] = [
    {
      id: 'about',
      label: 'About Me',
      response: 'I am a Computer Science Engineer and Full Stack Developer passionate about building robust web and mobile applications. B.Tech in CSE (2024), specializing in React.js, Node.js, Spring Boot, and Cloud Solutions.',
      scrollTo: 'about'
    },
    {
      id: 'skills',
      label: 'Tech Stack',
      response: 'I work with React.js, Node.js, Spring Boot, Kotlin, MongoDB, Supabase, MySQL, Next.js, Firebase, Tailwind CSS, Docker, and more. I specialize in building scalable digital solutions with modern technologies.',
      scrollTo: 'work'
    },
    {
      id: 'experience',
      label: 'Experience',
      response: 'Currently freelancing (Jan 2025 - Present). Previously: Software Dev Intern at Inspire Engineering Service (Jul-Dec 2024), Java Full Stack Trainee at The Kiran Academy (Jan-Jun 2024).',
      scrollTo: 'experience'
    },
    {
      id: 'projects',
      label: 'Projects',
      response: 'Key projects include: Cosmic IDE (React, Django, Electron), NE CRM (React, Node.js, Supabase), InsightFlow (AI Analytics), Bit Campus (Kotlin), DSA Guru (React Native), and Health Track (MERN Stack).',
      scrollTo: 'work'
    },
    {
      id: 'education',
      label: 'Education',
      response: 'B.Tech in Computer Science Engineering (2024). Certified in Java Full Stack Development, Web Development, and various technologies from institutions like The Kiran Academy and Inspire Engineering.',
      scrollTo: 'experience'
    },
    {
      id: 'contact',
      label: 'Contact',
      response: 'Email: abhaymallick.dev@gmail.com | LinkedIn: linkedin.com/in/abhaymallick2002 | GitHub: github.com/Abhay2204 | Based in India, available for work.',
      scrollTo: 'contact'
    }
  ];

  useEffect(() => {
    if (isOpen && chatBoxRef.current) {
      gsap.fromTo(chatBoxRef.current,
        { scale: 0, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }
      );
    }
  }, [isOpen]);

  useEffect(() => {
    if (bubbleRef.current) {
      gsap.fromTo(bubbleRef.current,
        { scale: 0, opacity: 0 },
        { 
          scale: 1, 
          opacity: 1, 
          duration: 0.5, 
          ease: "back.out(1.7)",
          delay: 1
        }
      );
    }
  }, []);

  const handleOptionClick = (option: ChatOption) => {
    setSelectedOption(option.id);
    setShowResponse(true);
    
    // Scroll to section if specified
    if (option.scrollTo) {
      const element = document.getElementById(option.scrollTo);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    
    // Reset after 8 seconds
    setTimeout(() => {
      setShowResponse(false);
      setSelectedOption(null);
    }, 8000);
  };

  const handleRobotClick = () => {
    setIsOpen(!isOpen);
    setShowResponse(false);
    setSelectedOption(null);
  };

  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50">
      {/* Robot */}
      <div 
        onClick={handleRobotClick}
        className="cursor-pointer hover:scale-110 transition-transform duration-300"
      >
        <Robot3D size={100} />
      </div>

      {/* "Hi" Bubble - shows when chat is closed */}
      {false && !isOpen && (
        <div
          ref={bubbleRef}
          className="absolute -left-24 top-8 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-2xl"
          style={{
            border: '2px solid rgba(255,51,0,0.2)',
          }}
        >
          <p className="text-xs font-sans text-bg-dark font-medium">
            Hi
          </p>
          {/* Tail */}
          <div className="absolute -right-2 top-1/2 -translate-y-1/2">
            <div className="w-3 h-3 bg-white/95 rounded-full border-2 border-accent/20" />
          </div>
        </div>
      )}

      {/* Chat Box - Opens to the LEFT of robot, closer */}
      {isOpen && (
        <div
          ref={chatBoxRef}
          className="absolute right-28 top-1/2 -translate-y-1/2 w-80 bg-bg-dark border border-white/20 rounded-2xl shadow-2xl overflow-hidden"
          style={{
            maxHeight: '70vh',
          }}
        >
          {/* Header */}
          <div className="bg-surface border-b border-white/10 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <h3 className="text-sm font-mono tracking-wider text-off-white uppercase">
                Ask About Me
              </h3>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(70vh - 120px)' }}>
            {!showResponse ? (
              <>
                <p className="text-xs text-subtle mb-4 font-mono">
                  Select a topic to learn more:
                </p>
                <div className="space-y-2">
                  {chatOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleOptionClick(option)}
                      className="w-full text-left px-4 py-3 bg-surface border border-white/10 rounded-lg hover:border-accent hover:bg-white/5 transition-all duration-300 group"
                    >
                      <span className="text-sm text-off-white group-hover:text-accent transition-colors font-sans">
                        {option.label}
                      </span>
                      <svg 
                        className="w-3 h-3 inline-block ml-2 opacity-0 group-hover:opacity-100 transition-opacity" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                  <h4 className="text-xs font-mono tracking-wider text-accent uppercase">
                    {chatOptions.find(o => o.id === selectedOption)?.label}
                  </h4>
                </div>
                <p className="text-sm text-off-white leading-relaxed font-sans">
                  {chatOptions.find(o => o.id === selectedOption)?.response}
                </p>
                <button
                  onClick={() => {
                    setShowResponse(false);
                    setSelectedOption(null);
                  }}
                  className="text-xs text-accent hover:text-white transition-colors font-mono mt-4 flex items-center gap-2"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to topics
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-surface border-t border-white/10 px-6 py-3">
            <p className="text-[10px] text-subtle font-mono text-center">
              Click robot to close
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RobotChat;
