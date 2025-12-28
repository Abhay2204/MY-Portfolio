import React from 'react';
import { ExperienceItem } from '../types';

const experiences: ExperienceItem[] = [
  { year: 'Jan 2025 — Present', role: 'Freelancer', company: 'Remote' },
  { year: 'Jul 2024 — Dec 2024', role: 'Software Dev Intern', company: 'Inspire Engineering Service' },
  { year: 'Jan 2024 — Jun 2024', role: 'Java Full Stack Trainee', company: 'The Kiran Academy' },
];

const History: React.FC = () => {
  return (
    <section id="experience" className="py-32 px-6 md:px-20 bg-bg-dark relative overflow-hidden min-h-[80vh]">
      {/* Fade Text Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="text-[12vw] md:text-[10vw] font-serif font-bold text-white/[0.02] whitespace-nowrap">
          EXPERIENCE
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 relative z-10">
        <div className="md:col-span-2">
             <h3 className="text-xs font-mono tracking-widest text-subtle uppercase sticky top-32">Experience</h3>
        </div>
        <div className="md:col-span-10 flex flex-col border-t border-white/10">
            {experiences.map((exp, index) => (
                <div 
                    key={index} 
                    className="group flex flex-col md:flex-row md:items-baseline justify-between py-10 border-b border-white/10 hover:px-6 transition-all duration-500 hover:bg-white/5"
                >
                    <div className="md:w-1/3 text-sm font-mono text-subtle mb-2 md:mb-0">
                        {exp.year}
                    </div>
                    <div className="md:w-1/3 text-2xl font-serif text-off-white group-hover:text-accent transition-colors italic">
                        {exp.role}
                    </div>
                    <div className="md:w-1/3 text-right text-sm font-sans text-subtle">
                        {exp.company}
                    </div>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default History;