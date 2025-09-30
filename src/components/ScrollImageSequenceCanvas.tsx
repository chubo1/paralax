'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface ScrollImageSequenceCanvasProps {
  images: string[];
  containerHeight?: number;
  className?: string;
}

export default function ScrollImageSequenceCanvas({ 
  images, 
  containerHeight = 4000,
  className = ''
}: ScrollImageSequenceCanvasProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const loadedImagesRef = useRef<HTMLImageElement[]>([]);
  const isPreloadingRef = useRef(false);

  // Preload all images for smooth animation
  const preloadImages = useCallback(async () => {
    if (isPreloadingRef.current) return;
    isPreloadingRef.current = true;

    const imagePromises = images.map((src, index) => {
      return new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous'; // Handle CORS if needed
        img.onload = () => {
          setLoadingProgress((prev) => prev + (100 / images.length));
          resolve(img);
        };
        img.onerror = () => {
          console.warn(`Failed to load image: ${src}`);
          // Create a placeholder image for failed loads
          const placeholder = new Image();
          placeholder.width = 1920;
          placeholder.height = 1080;
          resolve(placeholder);
        };
        img.src = src;
      });
    });

    try {
      loadedImagesRef.current = await Promise.all(imagePromises);
      setIsLoaded(true);
      setLoadingProgress(100);
    } catch (error) {
      console.error('Error preloading images:', error);
      setIsLoaded(true); // Continue even if some images fail
    }
  }, [images]);

  // Draw current frame to canvas
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !loadedImagesRef.current[frameIndex]) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = loadedImagesRef.current[frameIndex];
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate aspect ratio and positioning
    const canvasAspect = canvas.width / canvas.height;
    const imgAspect = img.width / img.height;
    
    let drawWidth = canvas.width;
    let drawHeight = canvas.height;
    let offsetX = 0;
    let offsetY = 0;
    
    if (imgAspect > canvasAspect) {
      // Image is wider than canvas
      drawHeight = canvas.height;
      drawWidth = drawHeight * imgAspect;
      offsetX = (canvas.width - drawWidth) / 2;
    } else {
      // Image is taller than canvas
      drawWidth = canvas.width;
      drawHeight = drawWidth / imgAspect;
      offsetY = (canvas.height - drawHeight) / 2;
    }
    
    // Draw image with proper scaling and centering
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }, []);

  // Update frame based on scroll progress
  const updateFrame = useCallback((progress: number) => {
    if (!isLoaded) return;
    
    const exactFrame = progress * (images.length - 1);
    const frameIndex = Math.floor(exactFrame);
    const clampedIndex = Math.max(0, Math.min(frameIndex, images.length - 1));
    
    if (clampedIndex !== currentFrame) {
      setCurrentFrame(clampedIndex);
      drawFrame(clampedIndex);
    }
  }, [images.length, currentFrame, isLoaded, drawFrame]);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !isLoaded) return;

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
  }, [updateFrame, isLoaded]);

  // Handle canvas resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      // Set display size
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      
      // Set actual size in memory (scaled to account for extra pixel density)
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      // Scale the drawing context so everything will work at the higher ratio
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
      
      // Redraw current frame after resize
      if (isLoaded) {
        drawFrame(currentFrame);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [isLoaded, currentFrame, drawFrame]);

  // Start preloading on mount
  useEffect(() => {
    preloadImages();
  }, [preloadImages]);

  // Draw initial frame when loaded
  useEffect(() => {
    if (isLoaded && loadedImagesRef.current.length > 0) {
      drawFrame(0);
    }
  }, [isLoaded, drawFrame]);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full ${className}`}
      style={{ height: `${containerHeight}px` }}
    >
      {/* Sticky container for the canvas */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center">
        <div className="relative w-full h-full">
          {/* Loading overlay */}
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white z-10">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-lg">Loading frames...</p>
                <p className="text-sm text-gray-300 mt-2">{Math.round(loadingProgress)}%</p>
              </div>
            </div>
          )}
          
          {/* Canvas element */}
          <canvas
            ref={canvasRef}
            className="w-full h-full object-cover"
            style={{
              transform: 'translateZ(0)', // Hardware acceleration
              willChange: 'transform'
            }}
          />
          
          {/* Frame counter overlay */}
          {isLoaded && (
            <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
              Frame {currentFrame + 1} / {images.length}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
