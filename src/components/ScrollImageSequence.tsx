"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface ScrollImageSequenceProps {
  images: string[];
  containerHeight?: number;
}

export default function ScrollImageSequence({
  images,
  containerHeight = 4000,
}: ScrollImageSequenceProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [showText, setShowText] = useState(false);
  const [showDescription, setShowDescription] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const descriptionTimeout = useRef<number | null>(null);

  // Preload all images for smooth scrolling
  useEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [images]);

  const updateFrame = useCallback(
    (progress: number) => {
      const exactFrame = progress * (images.length - 1);
      const frameIndex = Math.round(exactFrame);

      if (frameIndex !== currentFrame) {
        setCurrentFrame(frameIndex);

        // Show main text 4 frames from last
        const triggerFrame = images.length - 4;
        setShowText(frameIndex >= triggerFrame);
        setShowDescription(frameIndex >= triggerFrame);
        // Show description with 800ms delay
        if (frameIndex >= triggerFrame) {
          if (!showDescription) {
            if (descriptionTimeout.current)
              clearTimeout(descriptionTimeout.current);
            descriptionTimeout.current = window.setTimeout(() => {
              setShowDescription(true);
            }, 800);
          }
        } else {
          if (descriptionTimeout.current)
            clearTimeout(descriptionTimeout.current);
          setShowDescription(false);
        }
      }
    },
    [currentFrame, images.length, showDescription]
  );

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const scrollProgress = Math.max(
        0,
        Math.min(1, -rect.top / (rect.height - window.innerHeight))
      );

      if (!ticking) {
        ticking = true;
        animationRef.current = requestAnimationFrame(() => {
          updateFrame(scrollProgress);
          ticking = false;
        });
      }
    };

    // Initial call
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (descriptionTimeout.current) clearTimeout(descriptionTimeout.current);
    };
  }, [updateFrame]);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: `${containerHeight}px` }}
    >
      {/* Sticky image container */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center">
        <div className="relative w-full h-full overflow-hidden">
          <img
            src={images[currentFrame]}
            alt={`Frame ${currentFrame + 1}`}
            className="w-full h-full object-cover transition-all duration-100 ease-out"
            style={{
              transform: "translateZ(0)", // hardware acceleration
              willChange: "transform, opacity",
            }}
          />

          {/* Frame counter overlay */}
          <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
            Frame {currentFrame + 1} / {images.length}
          </div>

          {/* Main text */}
          <div
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-out w-full pl-[150px] ${
              showText ? "opacity-100" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="text-white px-8 py-6 rounded-xl text-3xl font-bold mb-4">
              ჩოგბურთის კორტი
            </div>

            {/* Description */}
            <div
              className={`transition-all duration-1000 ease-out ${
                showDescription ? "opacity-100" : "opacity-0 translate-y-4"
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
  );
}
