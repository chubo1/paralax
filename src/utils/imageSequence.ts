/**
 * Generate array of image paths for the parallax sequence
 * Images are numbered from 1 to 30
 */
export function generateImageSequence(): string[] {
  const images: string[] = [];
  const startNumber = 1;
  const endNumber = 30;

  for (let i = startNumber; i <= endNumber; i++) {
    images.push(`/images/${i}.jpg`);
  }

  return images;
}

/**
 * Preload images for smoother animation
 */
export function preloadImages(imagePaths: string[]): Promise<void[]> {
  return Promise.all(
    imagePaths.map(
      (src) =>
        new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => reject(new Error(`Failed to load ${src}`));
          img.src = src;
        })
    )
  );
}
