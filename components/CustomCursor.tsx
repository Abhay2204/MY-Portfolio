import React, { useEffect, useRef, useState } from 'react';
import gsap from '../utils/gsap';

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;

    if (!cursor || !follower) return;

    gsap.set(cursor, { xPercent: -50, yPercent: -50 });
    gsap.set(follower, { xPercent: -50, yPercent: -50 });

    const xTo = gsap.quickSetter(cursor, "x", "px");
    const yTo = gsap.quickSetter(cursor, "y", "px");
    const xToFollower = gsap.quickSetter(follower, "x", "px");
    const yToFollower = gsap.quickSetter(follower, "y", "px");

    const onMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      
      gsap.to(follower, {
        duration: 0.6, // Snappier
        x: e.clientX,
        y: e.clientY,
        ease: "power2.out"
      });
    };

    const onHoverStart = () => setIsHovering(true);
    const onHoverEnd = () => setIsHovering(false);

    window.addEventListener('mousemove', onMouseMove);
    
    // Add event listeners to interactive elements
    const addListeners = () => {
        const hoverables = document.querySelectorAll('a, button, .hover-trigger, input');
        hoverables.forEach(el => {
          el.addEventListener('mouseenter', onHoverStart);
          el.addEventListener('mouseleave', onHoverEnd);
        });
    };

    addListeners();
    // Re-add listeners if DOM changes (simple observer for this demo)
    const observer = new MutationObserver(addListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (followerRef.current) {
      gsap.to(followerRef.current, {
        scale: isHovering ? 2 : 1, // Smaller scale on hover
        backgroundColor: isHovering ? '#FF3300' : 'transparent',
        borderWidth: isHovering ? '0px' : '1px',
        borderColor: '#FF3300',
        opacity: 0.8,
        duration: 0.3,
        ease: "power2.out"
      });
      
      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
            scale: isHovering ? 0 : 1, // Hide dot on hover
            duration: 0.2
        });
      }
    }
  }, [isHovering]);

  return (
    <>
      <div 
        ref={cursorRef} 
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-accent rounded-full pointer-events-none z-[9997] will-change-transform"
        style={{ transform: 'translate3d(0,0,0)' }}
      />
      <div 
        ref={followerRef}
        className="fixed top-0 left-0 w-8 h-8 border border-accent rounded-full pointer-events-none z-[9996] will-change-transform"
        style={{ transform: 'translate3d(0,0,0)' }}
      />
    </>
  );
};

export default CustomCursor;