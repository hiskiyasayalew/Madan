import React from 'react';

interface SlicedTextProps {
  text: string;
}

// Renders the text with a clean diagonal slice effect
const SlicedText: React.FC<SlicedTextProps> = ({ text }) => {
  return (
   <div className="relative select-none text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-montserrat font-light tracking-tighter leading-[0.85] text-center w-full">
  {/* Top Half of the Slice */}
  <div 
    className="absolute inset-0 text-[#F79520] -translate-x-[2px] -translate-y-[1px]"
    style={{ clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 65%)' }}
  >
    {text}
  </div>
  
  {/* Bottom Half of the Slice */}
  <div 
    className="text-[#F79520] translate-x-[2px] translate-y-[1px]"
    style={{ clipPath: 'polygon(0 65%, 100% 45%, 100% 100%, 0 100%)' }}
  >
    {text}
  </div>
</div>
  );
};

export default function ComingSoon() {
  return (
    <div className="relative w-full min-h-screen bg-black flex flex-col items-center justify-center overflow-hidden px-4 py-12">
      
      {/* Embedded Styles for Font Import and Custom Keyframe Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700&display=swap');
        
        .font-montserrat {
          font-family: 'Montserrat', sans-serif;
        }

        .text-outline {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.07);
          color: transparent;
        }

        /* Moving Gradient Background Animation */
        @keyframes smoothDrift {
          0% {
            transform: translate(-10%, -10%) scale(1) rotate(0deg);
          }
          50% {
            transform: translate(15%, 10%) scale(1.15) rotate(180deg);
          }
          100% {
            transform: translate(-10%, -10%) scale(1) rotate(360deg);
          }
        }

        .animate-gradient-drift {
          animation: smoothDrift 16s infinite alternate ease-in-out;
        }

        /* Foreground Slide & Fade Reveal Animation */
        @keyframes revealUp {
          0% {
            opacity: 0;
            transform: translateY(40px);
            filter: blur(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }

        .reveal-word-1 {
          opacity: 0;
          animation: revealUp 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .reveal-word-2 {
          opacity: 0;
          animation: revealUp 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: 200ms;
        }
      `}} />

      {/* 1. BACKGROUND GLOW: Smoothly moving orange/amber radial gradient */}
      <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden pointer-events-none">
        <div className="absolute w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] md:w-[700px] md:h-[700px] rounded-full bg-gradient-to-r from-orange-600/30 via-amber-500/15 to-transparent blur-[80px] md:blur-[130px] animate-gradient-drift" />
        <div className="absolute w-[200px] h-[200px] sm:w-[350px] sm:h-[350px] rounded-full bg-orange-500/15 blur-[100px] translate-x-12 -translate-y-12" />
      </div>

      {/* 2. BACKGROUND TEXT LAYER: Repeated "STAY TUNED" outlines */}
      <div className="absolute inset-0 z-20 flex flex-col justify-between py-6 opacity-30 pointer-events-none select-none overflow-hidden">
        {Array.from({ length: 9 }).map((_, i) => (
          <div 
            key={i} 
            className="text-outline font-montserrat font-light text-6xl sm:text-7xl md:text-8xl lg:text-[9rem] tracking-tighter text-center whitespace-nowrap leading-none"
          >
            STAY TUNED
          </div>
        ))}
      </div>

      {/* 3. FOREGROUND CONTENT LAYER */}
      <div className="relative z-30 flex flex-col items-center justify-center w-full max-w-4xl">
        {/* Main "COMING SOON" Sliced Text with Staggered Reveal Animations */}
        <div className="flex flex-col items-center justify-center space-y-1 md:space-y-4 w-full">
          <div className="reveal-word-1 w-full font-light">
            <SlicedText text="COMING" />
          </div>
          <div className="reveal-word-2 w-full font-light">
            <SlicedText text="SOON" />
          </div>
        </div>
      </div>
      <div className="text-center text-white font-normal text-[1.2rem] my-8">
        <p>STAY TUNED</p>
        <p className='text-center text-gray font-normal text-[0.6rem] uppercase my-2'>Guest house services will avaialable soon</p>
      </div>
      
    </div>
  );
}