import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export function Hero() {
  const { locale = 'en' } = useParams<{ locale: string }>();

  return (
    <header className="relative min-h-screen flex items-center pt-24 overflow-hidden bg-[#131313]">
      {/* Radial gold glow */}
      <div className="absolute inset-0 glow-gold pointer-events-none" />

      <div className="container mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10 max-w-7xl">
        {/* Left content */}
        <div className="space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f6be39]/10 border border-[#f6be39]/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f6be39] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f6be39]" />
            </span>
            <span className="text-[#f6be39] text-xs uppercase tracking-widest font-bold">
              Based on a PhD thesis - not a BuzzFeed quiz
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight text-[#e5e2e1] font-['Plus_Jakarta_Sans']">
            The Personality Test That{' '}
            <span className="text-[#f6be39]">Ayurveda Built</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg lg:text-xl text-[#d3c5ae] max-w-xl leading-relaxed">
            You've done MBTI. You've done 16Personalities. Now discover your Manas Prakriti -
            your mental constitution according to Ayurvedic psychology. 25 questions. 3 minutes.
            Research-backed results.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center pt-2">
            <Link
              to={`/${locale}/assessment/intro`}
              className="metallic-gold px-8 py-4 rounded-xl text-[#402d00] font-bold text-lg flex items-center justify-center gap-2 shadow-xl hover:shadow-[#f6be39]/20 hover:shadow-2xl transition-all active:scale-95 group"
            >
              Take the Free Assessment
              <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
            </Link>
            <Link
              to={`/${locale}/science`}
              className="text-sm text-white/50 hover:text-[#f6be39] transition-colors flex items-center gap-1.5 px-4"
            >
              See the science behind it <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Right side - hero images */}
        <div className="relative hidden lg:block">
          <div className="relative w-full aspect-square">
            {/* Main image - top right */}
            <div className="absolute top-0 right-0 w-2/3 h-2/3 rounded-xl overflow-hidden shadow-2xl rotate-3 z-20 border-4 border-[#131313]">
              <img
                src="/images/hero-meditation.jpg"
                alt="Ayurvedic meditation"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Secondary image - bottom left */}
            <div className="absolute bottom-0 left-0 w-2/3 h-2/3 rounded-xl overflow-hidden shadow-2xl -rotate-6 z-10 border-4 border-[#131313]">
              <img
                src="/images/hero-herbs.jpg"
                alt="Ayurvedic herbs and spices"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
