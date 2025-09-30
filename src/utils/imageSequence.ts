/**
 * Generate array of image paths for the parallax sequence
 * Supports both naming conventions:
 * - frame1.jpg to frameN.jpg (new format)
 * - parallax test00XXXXX.jpg (legacy format)
 */
export function generateImageSequence(frameCount: number = 20, useLegacyFormat: boolean = false): string[] {
  const images: string[] = [];
  
  if (useLegacyFormat) {
    // Legacy format: parallax test00102643.jpg to parallax test00102672.jpg
    const startNumber = 102643;
    const endNumber = startNumber + frameCount - 1;
    
    for (let i = startNumber; i <= endNumber; i++) {
      images.push(`/images/parallax test00${i}.jpg`);
    }
  } else {
    // New format: frame1.jpg to frameN.jpg
    for (let i = 1; i <= frameCount; i++) {
      images.push(`/frames/frame${i}.jpg`);
    }
  }
  
  return images;
}

/**
 * Preload images for smoother animation
 */
export function preloadImages(imagePaths: string[]): Promise<void[]> {
  return Promise.all(
    imagePaths.map((src) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = src;
      });
    })
  );
}
