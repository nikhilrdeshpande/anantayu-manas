import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export function Hero() {
  const { locale = 'en' } = useParams<{ locale: string }>();

  return (
    <section className="relative bg-[#1A1A1A] overflow-hidden min-h-[85vh] flex items-center">
      {/* Radial gradient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 70% 30%, rgba(212,160,23,0.08) 0%, rgba(26,26,26,1) 70%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28 lg:py-32 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left space-y-8 relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 rounded-full bg-white/[0.06] border border-[#d4a017]/30 px-4 py-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4a017] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d4a017]" />
              </span>
              <span className="text-[#d4a017] text-sm font-medium tracking-wide">
                Based on a PhD thesis - not a BuzzFeed quiz
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold font-['Plus_Jakarta_Sans'] text-white leading-[1.08] tracking-tight">
              The Personality Test That{' '}
              <span className="text-[#d4a017]">Ayurveda Built</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-stone-400 leading-relaxed max-w-lg mx-auto lg:mx-0">
              You've done MBTI. You've done 16Personalities. Now discover your Manas Prakriti -
              your mental constitution according to Ayurvedic psychology.
              25 questions. 3 minutes. Research-backed results.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-2 items-center">
              <Link
                to={`/${locale}/assessment/intro`}
                className="group inline-flex items-center gap-3 rounded-full px-10 py-5 text-lg font-bold text-white transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-xl"
                style={{
                  background: 'linear-gradient(135deg, #795900 0%, #d4a017 100%)',
                }}
              >
                <Sparkles size={20} />
                Take the Free Assessment
                <ArrowRight
                  size={20}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
              <Link
                to={`/${locale}/science`}
                className="text-sm text-white/50 hover:text-[#d4a017] transition-colors flex items-center gap-1"
              >
                See the science behind it <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Right side: hero images */}
          <div className="relative flex justify-center lg:justify-end">
            {/* Main image */}
            <div className="w-[280px] h-[400px] md:w-[380px] md:h-[520px] rounded-2xl overflow-hidden shadow-2xl rotate-3 bg-stone-900 border border-white/5 p-3">
              <img
                src="/images/hero-meditation.jpg"
                alt="Ayurvedic meditation"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            {/* Secondary image */}
            <div className="absolute -bottom-8 -left-8 w-[200px] h-[270px] rounded-2xl overflow-hidden shadow-2xl -rotate-6 hidden md:block bg-stone-900 border border-white/5 p-3">
              <img
                src="/images/hero-herbs.jpg"
                alt="Ayurvedic herbs and spices"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
