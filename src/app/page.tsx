import ScrollImageSequenceCanvas from '@/components/ScrollImageSequenceCanvas';
import ScrollProgressBar from '@/components/ScrollProgressBar';
import { generateImageSequence } from '@/utils/imageSequence';

export default function Home() {
  // Use your exact image names from /public/images/
  const imageSequence = [
    '/images/parallax test00102643.jpg',
    '/images/parallax test00102644.jpg',
    '/images/parallax test00102645.jpg',
    '/images/parallax test00102646.jpg',
    '/images/parallax test00102647.jpg',
    '/images/parallax test00102648.jpg',
    '/images/parallax test00102649.jpg',
    '/images/parallax test00102650.jpg',
    '/images/parallax test00102651.jpg',
    '/images/parallax test00102652.jpg',
    '/images/parallax test00102653.jpg',
    '/images/parallax test00102654.jpg',
    '/images/parallax test00102655.jpg',
    '/images/parallax test00102656.jpg',
    '/images/parallax test00102657.jpg',
    '/images/parallax test00102658.jpg',
    '/images/parallax test00102659.jpg',
    '/images/parallax test00102660.jpg',
    '/images/parallax test00102661.jpg',
    '/images/parallax test00102662.jpg',
    '/images/parallax test00102663.jpg',
    '/images/parallax test00102664.jpg',
    '/images/parallax test00102665.jpg',
    '/images/parallax test00102666.jpg',
    '/images/parallax test00102667.jpg',
    '/images/parallax test00102668.jpg',
    '/images/parallax test00102669.jpg',
    '/images/parallax test00102670.jpg',
    '/images/parallax test00102671.jpg',
    '/images/parallax test00102672.jpg'
  ];

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

      {/* Scroll-based image sequence with Canvas optimization */}
      <ScrollImageSequenceCanvas images={imageSequence} containerHeight={5000} />

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
