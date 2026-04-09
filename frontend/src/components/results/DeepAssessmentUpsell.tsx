import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, BookOpen, Brain } from 'lucide-react';

export function DeepAssessmentUpsell() {
  const { locale = 'en' } = useParams();

  return (
    <div className="bg-[#1A1A1A] rounded-2xl p-6 text-center">
      <div className="inline-flex items-center gap-2 bg-white/10 text-[#d4a017] px-3 py-1 rounded-full text-xs font-medium mb-4">
        <Sparkles size={12} />
        UNLOCK YOUR FULL PROFILE
      </div>

      <h3 className="text-xl font-bold text-white font-[family-name:var(--font-heading)] mb-2">
        This is just the surface. Want to go deeper?
      </h3>

      <p className="text-white/60 text-sm leading-relaxed mb-5 max-w-md mx-auto">
        The deep assessment (80 questions) unlocks your specific sub-type out of 16,
        a behavioral personality mirror, personalized diet, daily routine, yoga and meditation
        prescriptions, and a 30-day transformation plan.
      </p>

      <div className="flex items-baseline justify-center gap-1 mb-5">
        <span className="text-3xl font-bold text-white">&#x20B9;399</span>
        <span className="text-white/40 text-sm">one-time</span>
      </div>

      <Link
        to={`/${locale}/pricing`}
        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-white font-semibold
          bg-gradient-to-r from-[#8B6914] to-[#d4a017] hover:opacity-90 transition-opacity
          shadow-[0_4px_14px_rgba(212,160,23,0.35)]"
      >
        Unlock Deep Assessment
        <ArrowRight size={18} />
      </Link>

      <div className="flex items-center justify-center gap-4 mt-4 text-xs text-white/30">
        <div className="flex items-center gap-1"><Shield size={10} /> Secure payment</div>
        <div className="flex items-center gap-1"><BookOpen size={10} /> Research-backed</div>
        <div className="flex items-center gap-1"><Brain size={10} /> AI-powered report</div>
      </div>
    </div>
  );
}
