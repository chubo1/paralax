'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';

interface ScrollImageSequenceProps {
  images: string[];
  containerHeight?: number;
}

export default function ScrollImageSequence({ 
  images, 
  containerHeight = 4000 
}: ScrollImageSequenceProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);

  // Video-like frame interpolation function
  const updateFrame = useCallback((progress: number) => {
    // Calculate exact frame position with sub-frame precision
    const exactFrame = progress * (images.length - 1);
    const frameIndex = Math.round(exactFrame);
    
    // Only update if frame actually changed to avoid unnecessary re-renders
    if (frameIndex !== currentFrame) {
      setIsTransitioning(true);
      setCurrentFrame(frameIndex);
      
      // Show text when 4th image from last is reached (frame 26 out of 30 total)
      const triggerFrame = images.length - 4; // 4th from last
      setShowText(frameIndex >= triggerFrame);
      
      // Show description with a delay after the main text appears
      if (frameIndex >= triggerFrame) {
        setTimeout(() => {
          setShowDescription(true);
        }, 800); // Delay description by 800ms after main text
      } else {
        setShowDescription(false);
      }
      
      // Brief transition state to ensure smooth visual feedback
      setTimeout(() => setIsTransitioning(false), 50);
    }
  }, [images.length, currentFrame]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const scrollProgress = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)));
      
      // Cancel any pending animation frame
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      // Use requestAnimationFrame for smooth 60fps updates
      animationRef.current = requestAnimationFrame(() => {
        updateFrame(scrollProgress);
      });
    };

    // Initial calculation
    handleScroll();

    // Add scroll listener with passive for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [updateFrame]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full"
      style={{ height: `${containerHeight}px` }}
    >
      {/* Sticky container for the image */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center">
        <div className="relative w-full h-full overflow-hidden">
          <Image
            src={images[currentFrame]}
            alt={`Frame ${currentFrame + 1}`}
            fill
            className={`object-cover ${
              isTransitioning 
                ? 'transition-all duration-100 ease-out' 
                : 'transition-none'
            }`}
            style={{
              transform: 'translateZ(0)', // Hardware acceleration
              willChange: 'transform, opacity'
            }}
            priority={currentFrame === 0}
            quality={95} // High quality for video-like effect
          />
          
          {/* Frame counter overlay */}
          <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
            Frame {currentFrame + 1} / {images.length}
          </div>
          
          
          
          {/* Georgian text with fade-in from bottom animation - centered */}
          <div 
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-out w-full pl-[150px] ${
              showText 
                ? 'opacity-100' 
                : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="">
              <div className="text-white px-8 py-6 rounded-xl text-3xl font-bold mb-4">
                ჩოგბურთის კორტი
              </div>
              
              {/* Description text with delayed animation */}
              <div 
                className={`transition-all duration-1000 ease-out ${
                  showDescription 
                    ? 'opacity-100' 
                    : 'opacity-0 translate-y-4'
                }`}
              >
                <div className="text-white px-6 py-3 rounded-lg text-lg font-medium">
                  <p>8,000 კვ.მ. ზონა ცენტრალური პარკით,</p>
                  <p>ველობილიკითა და ITF სტანდარტის ჩოგბურთის კორტით.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
