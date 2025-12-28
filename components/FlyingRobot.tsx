import React, { useEffect, useRef, useState } from 'react';
import gsap from '../utils/gsap';
import Robot3D from './Robot3D';

const FlyingRobot: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cloudRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLParagraphElement>(null);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isVisible, setIsVisible] = useState(true); // Start as true to always show

  const messages = [
    "Hello visitor!",
    "Welcome to my portfolio",
    "Thanks for stopping by!"
  ];

  useEffect(() => {
    if (!containerRef.current || !cloudRef.current) return;

    console.log('FlyingRobot mounted!');
    console.log('Container:', containerRef.current);
    
    const ctx = gsap.context(() => {
      // Initial position - completely off screen right
      gsap.set(containerRef.current, {
        x: 400, // Far off screen
        opacity: 1
      });

      console.log('Initial position set - robot off screen');

      gsap.set(cloudRef.current, {
        scale: 0,
        opacity: 0
      });

      // Main animation sequence
      const tl = gsap.timeline({ 
        delay: 1,
        onStart: () => console.log('Timeline started!')
      });

      // 1. Robot flies in from right
      tl.to(containerRef.current, {
        x: -220, // Keep it more to the right
        duration: 1.5,
        ease: "power2.out",
        onStart: () => console.log('Robot flying in...'),
        onComplete: () => console.log('Robot arrived!')
      });

      // 2. Show first message
      tl.call(() => showMessage(0));
      tl.to(cloudRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: "back.out(1.7)"
      });
      tl.to({}, { duration: 2 });

      // 3. Hide cloud
      tl.to(cloudRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: "back.in(1.7)"
      });
      tl.to({}, { duration: 0.5 });

      // 4. Show second message
      tl.call(() => showMessage(1));
      tl.to(cloudRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: "back.out(1.7)"
      });
      tl.to({}, { duration: 2 });

      // 5. Hide cloud
      tl.to(cloudRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: "back.in(1.7)"
      });
      tl.to({}, { duration: 0.5 });

      // 6. Show third message
      tl.call(() => showMessage(2));
      tl.to(cloudRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: "back.out(1.7)"
      });
      tl.to({}, { duration: 2 });

      // 7. Hide cloud
      tl.to(cloudRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: "back.in(1.7)"
      });

      // 8. Robot flies back to right corner
      tl.to(containerRef.current, {
        x: 400, // Fly far off screen
        duration: 1.5,
        ease: "power2.in",
        onComplete: () => {
          console.log('Robot flew away');
          setIsVisible(false);
        }
      });

      // Floating animation while visible
      gsap.to(containerRef.current, {
        y: "+=20",
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const showMessage = (index: number) => {
    setCurrentMessage(messages[index]);
    
    if (messageRef.current) {
      const text = messages[index];
      let currentText = '';
      let charIndex = 0;
      
      const typeInterval = setInterval(() => {
        if (charIndex < text.length) {
          currentText += text[charIndex];
          if (messageRef.current) {
            messageRef.current.textContent = currentText;
          }
          charIndex++;
        } else {
          clearInterval(typeInterval);
        }
      }, 40);
    }
  };

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed bottom-20 right-0 z-50 pointer-events-none hidden md:block"
      style={{ width: '200px' }}
    >
      {/* Thought Cloud - moved to left side of robot */}
      <div
        ref={cloudRef}
        className="absolute -top-32 right-36 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-2xl"
        style={{
          maxWidth: '160px',
          border: '2px solid rgba(255,51,0,0.2)',
          transformOrigin: 'bottom left'
        }}
      >
        <p
          ref={messageRef}
          className="text-xs font-sans text-bg-dark font-medium leading-relaxed"
        >
          {currentMessage}
        </p>

        {/* Cloud tail - on left side now */}
        <div className="absolute -bottom-6 left-6">
          <div className="absolute bottom-0 left-0 w-4 h-4 bg-white/95 rounded-full border-2 border-accent/20" />
          <div className="absolute bottom-1 left-2 w-3 h-3 bg-white/95 rounded-full border border-accent/20" />
          <div className="absolute bottom-2 left-4 w-2 h-2 bg-white/95 rounded-full border border-accent/20" />
        </div>
      </div>

      {/* 3D Robot - larger */}
      <Robot3D size={140} />
    </div>
  );
};

export default FlyingRobot;
