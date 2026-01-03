import React, { useRef, useEffect } from 'react';
import gsap from '../utils/gsap';

interface VideoItem {
  id: number;
  src: string;
  title: string;
}

const videos: VideoItem[] = [
  { id: 1, src: 'tI-6n6nV5wA', title: "Project Demo" },
  { id: 2, src: 'ge9iTbVius0', title: "App Walkthrough" },
  { id: 3, src: 'c6ne47PqqDg', title: "Feature Preview" },
  { id: 4, src: 'nlnknNJGzMA', title: "UI Animation" },
  { id: 5, src: '9941SmHkeZ8', title: "Code Demo" },
  { id: 6, src: 'z7rcJV6-EEM', title: "Design Process" },
  { id: 7, src: 'iSFHLYX4F78', title: "Final Result" },
];

const Gallery: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.video-item').forEach((item: any) => {
        gsap.fromTo(item,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              end: "top 50%",
              scrub: 1,
            }
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-32 px-6 md:px-20 bg-bg-dark border-t border-white/5 relative overflow-hidden">
      {/* Background Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="text-[12vw] md:text-[10vw] font-serif font-bold text-white/[0.02] whitespace-nowrap">
          VIDEOS
        </span>
      </div>

      {/* Header */}
      <div className="relative z-10 mb-16">
        <h3 className="text-xs font-mono tracking-widest text-subtle uppercase mb-4">Video Showcase</h3>
        <h2 className="text-4xl md:text-6xl font-serif text-off-white italic">Gallery</h2>
      </div>

      {/* Video Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {videos.map((video, index) => (
          <div
            key={video.id}
            className={`video-item group relative overflow-hidden bg-surface ${
              index === 0 ? 'md:col-span-2' : ''
            }`}
          >
            <div className={`relative ${index === 0 ? 'aspect-video' : 'aspect-video'}`}>
              <iframe
                src={`https://www.youtube.com/embed/${video.src}?mute=1&loop=1&playlist=${video.src}&controls=1&modestbranding=1&rel=0`}
                title={video.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            
            {/* Title Bar */}
            <div className="p-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs font-mono text-subtle uppercase tracking-widest">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="text-sm font-mono text-off-white">{video.title}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Gallery;
