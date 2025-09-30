/**
 * Generate array of image paths for the parallax sequence
 * Images are numbered from 00102643 to 00102672
 */
export function generateImageSequence(): string[] {
  const images: string[] = [];
  const startNumber = 102643;
  const endNumber = 102672;
  
  for (let i = startNumber; i <= endNumber; i++) {
    images.push(`/images/parallax test00${i}.jpg`);
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
