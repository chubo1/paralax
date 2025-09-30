import ScrollImageSequence from '@/components/ScrollImageSequence';
import ScrollProgressBar from '@/components/ScrollProgressBar';
import { generateImageSequence } from '@/utils/imageSequence';

export default function Home() {
  const imageSequence = generateImageSequence();

  return (
    <div className="min-h-screen">
      {/* Scroll progress bar */}
      <ScrollProgressBar />
      {/* Hero section */}
      <section className="h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4">Parallax Animation</h1>
          <p className="text-xl text-gray-300 mb-8">Scroll down to see the magic happen</p>
          <div className="animate-bounce">
            <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Scroll-based image sequence */}
      <ScrollImageSequence images={imageSequence} containerHeight={5000} />

      {/* Footer section */}
      <section className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">Animation Complete!</h2>
          <p className="text-gray-600">Scroll up to see the reverse effect</p>
        </div>
      </section>
    </div>
  );
}
