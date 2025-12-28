import React, { useState } from 'react';
import { TestimonialItem } from '../types';

const testimonials: TestimonialItem[] = [
  {
    id: 1,
    text: "Minh brings a rare combination of visual excellence and technical understanding.",
    author: "Michael Glass",
    role: "Group Design Director",
    image: "https://picsum.photos/id/1005/200/200"
  },
  {
    id: 2,
    text: "The attention to detail is simply unmatched in the industry right now.",
    author: "Peter Smart",
    role: "Head of Product",
    image: "https://picsum.photos/id/1012/200/200"
  },
  {
    id: 3,
    text: "Clean, efficient, and aesthetically stunning. A pleasure to work with.",
    author: "Dieter Rams",
    role: "Legend",
    image: "https://picsum.photos/id/1025/200/200"
  }
];

const Testimonials: React.FC = () => {
  const [activeId, setActiveId] = useState(1);

  return (
    <section className="py-40 px-6 md:px-20 bg-bg-dark relative overflow-hidden min-h-[80vh]">
       {/* Fade Text Background */}
       <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
         <span className="text-[12vw] md:text-[10vw] font-serif font-bold text-white/[0.02] whitespace-nowrap">
           FEEDBACK
         </span>
       </div>
       
       <div className="grid grid-cols-1 md:grid-cols-12 gap-10 relative z-10">
        <div className="md:col-span-2">
             <h3 className="text-xs font-mono tracking-widest text-subtle uppercase">Feedback</h3>
        </div>
        
        <div className="md:col-span-10 relative min-h-[300px]">
            {testimonials.map((item) => (
                <div 
                    key={item.id}
                    className={`transition-all duration-700 absolute top-0 left-0 w-full flex flex-col md:flex-row justify-between gap-10 ${activeId === item.id ? 'opacity-100 translate-y-0 z-10' : 'opacity-0 translate-y-8 z-0 pointer-events-none'}`}
                >
                    <div className="max-w-3xl">
                        <div className="text-3xl md:text-5xl font-serif leading-tight text-off-white mb-8">
                            “{item.text}”
                        </div>
                        <div>
                            <h4 className="text-white font-sans text-sm tracking-wide">{item.author}</h4>
                            <p className="text-subtle text-xs font-mono mt-1 uppercase">{item.role}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Simplified Pagination */}
      <div className="mt-20 pl-0 md:pl-[16.666%] flex gap-4">
           {testimonials.map((item) => (
               <button 
                  key={item.id}
                  onClick={() => setActiveId(item.id)}
                  className={`h-1 transition-all duration-300 ${activeId === item.id ? 'w-12 bg-accent' : 'w-4 bg-white/20 hover:bg-white/40'}`}
               />
           ))}
      </div>
    </section>
  );
};

export default Testimonials;