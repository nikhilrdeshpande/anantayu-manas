import { Link, useParams } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

export function DeepAssessmentTeaser() {
  const { locale = 'en' } = useParams();

  return (
    <section className="py-16 md:py-20 px-6 bg-[#1A1A1A]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/10 text-[#d4a017] px-3 py-1 rounded-full text-xs font-medium mb-4">
            <Sparkles size={12} />
            Premium
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white font-[family-name:var(--font-heading)] mb-3">
            Go Deeper: 16 Sub-types,<br />One Personalized Plan
          </h2>
          <p className="text-white/50 text-sm max-w-lg mx-auto">
            The free assessment gives you your type. The deep assessment gives you a
            1,500-word personality mirror so accurate you'll wonder how we know you.
          </p>
        </div>

        {/* Sample report excerpt */}
        <div className="bg-white/5 rounded-2xl border border-white/10 p-5 mb-6">
          <p className="text-xs text-[#d4a017] font-semibold uppercase tracking-wider mb-2">
            Sample from a real report
          </p>
          <p className="text-white/70 text-sm italic leading-relaxed">
            "You're the person who walks into a room and automatically assesses the power dynamics
            - who's in charge, who's a threat, who's useful. You set goals that others call
            unrealistic, then hit them. You've been called 'too much' or 'too intense' - you
            wear it as a badge of honor..."
          </p>
          <p className="text-white/30 text-xs mt-2">From an Asura Kaya (The Titan) report</p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {['Personality mirror', 'Personalized diet', 'Daily routine', 'Yoga & meditation', '30-day plan'].map((f, i) => (
            <span key={i} className="bg-white/10 text-white/70 text-xs px-3 py-1.5 rounded-full">
              {f}
            </span>
          ))}
        </div>

        <div className="text-center">
          <Link
            to={`/${locale}/assessment/intro`}
            className="inline-flex items-center gap-2 text-[#d4a017] text-sm font-semibold hover:underline"
          >
            Start with the free assessment first
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
