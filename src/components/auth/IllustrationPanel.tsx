import { Check } from 'lucide-react';
import { useState, useEffect } from 'react';

interface IllustrationPanelProps {
  imageSrc: string;
  imageAlt: string;
  tagline: string;
  features: string[];
}

export default function IllustrationPanel({
  imageSrc,
  imageAlt,
  tagline,
  features
}: IllustrationPanelProps) {
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeatureIndex((prev) => (prev + 1) % features.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className="lg:w-3/5 w-full bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100
      flex flex-col items-center justify-center p-8 lg:p-20 order-1 lg:order-2
      min-h-[40vh] lg:min-h-screen">

      {/* Illustration */}
      <div className="w-full max-w-lg mb-14">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-auto drop-shadow-sm"
        />
      </div>

      {/* Tagline */}
      <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-12 text-center max-w-xl leading-tight px-4">
        {tagline}
      </h2>

      {/* Animated Feature Highlight - One at a time */}
      <div className="relative h-14 max-w-md w-full overflow-hidden flex items-center justify-center">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 flex items-center justify-center gap-4 transition-all duration-700 ease-in-out ${
              idx === currentFeatureIndex
                ? 'opacity-100 translate-x-0'
                : idx < currentFeatureIndex
                ? 'opacity-0 -translate-x-full'
                : 'opacity-0 translate-x-full'
            }`}
          >
            <div className="flex-shrink-0 w-11 h-11 bg-indigo-500 rounded-full flex items-center justify-center shadow-md">
              <Check className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-lg text-slate-900 font-semibold">{feature}</span>
          </div>
        ))}
      </div>

      {/* Progress Indicators */}
      <div className="flex gap-2 mt-10">
        {features.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentFeatureIndex(idx)}
            className={`h-2 rounded-full transition-all duration-500 ${
              idx === currentFeatureIndex ? 'w-10 bg-indigo-600' : 'w-2 bg-slate-300 hover:bg-slate-400'
            }`}
            aria-label={`View feature ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
