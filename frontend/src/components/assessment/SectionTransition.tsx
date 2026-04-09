import { useEffect, useCallback } from 'react';
import { Leaf, Zap, Mountain } from 'lucide-react';
import { SECTION_ORDER, SECTION_CONFIG, DEEP_SECTION_CONFIG } from '../../lib/constants';
import { useAssessmentStore } from '../../stores/assessment-store';
import type { GunaType } from '../../types';

const SECTION_META: Record<GunaType, {
  color: string;
  darkColor: string;
  gradient: string;
  Icon: typeof Leaf;
  headline: string;
}> = {
  sattva: {
    color: '#7BA05B',
    darkColor: '#466729',
    gradient: 'linear-gradient(160deg, #466729 0%, #7BA05B 50%, #A3C287 100%)',
    Icon: Leaf,
    headline: "Let's begin with your calm nature...",
  },
  rajas: {
    color: '#D4A017',
    darkColor: '#8B6914',
    gradient: 'linear-gradient(160deg, #8B6914 0%, #D4A017 50%, #E8C04A 100%)',
    Icon: Zap,
    headline: "Now, let's explore your active nature...",
  },
  tamas: {
    color: '#5B6B7A',
    darkColor: '#3A4A58',
    gradient: 'linear-gradient(160deg, #3A4A58 0%, #5B6B7A 50%, #7E8D9A 100%)',
    Icon: Mountain,
    headline: "Finally, let's understand your steady nature...",
  },
};

interface SectionTransitionProps {
  nextSection: GunaType;
  onContinue: () => void;
}

export function SectionTransition({ nextSection, onContinue }: SectionTransitionProps) {
  const assessmentType = useAssessmentStore((s) => s.assessmentType);
  const config = assessmentType === 'deep' ? DEEP_SECTION_CONFIG : SECTION_CONFIG;
  const meta = SECTION_META[nextSection];
  const Icon = meta.Icon;
  const partNumber = SECTION_ORDER.indexOf(nextSection) + 1;
  const remainingQuestions = SECTION_ORDER.slice(SECTION_ORDER.indexOf(nextSection)).reduce(
    (sum, s) => sum + config[s].questions, 0
  );

  const handleContinue = useCallback(() => {
    onContinue();
  }, [onContinue]);

  // Auto-advance after 2.5s
  useEffect(() => {
    const timer = setTimeout(handleContinue, 2500);
    return () => clearTimeout(timer);
  }, [handleContinue]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer"
      style={{ background: meta.gradient }}
      onClick={handleContinue}
    >
      {/* Phase indicator pill */}
      <div
        className="absolute top-8 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
        style={{
          backgroundColor: 'rgba(255,255,255,0.15)',
          color: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(8px)',
        }}
      >
        Phase {String(partNumber).padStart(2, '0')} / 03
      </div>

      {/* Breathing circle with icon */}
      <div className="relative mb-10">
        {/* Outer pulse ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            width: 140,
            height: 140,
            margin: 'auto',
            top: -22,
            left: -22,
            backgroundColor: 'rgba(255,255,255,0.08)',
            animation: 'breathe 3s ease-in-out infinite',
          }}
        />
        {/* Inner circle */}
        <div
          className="relative w-24 h-24 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <Icon className="w-10 h-10 text-white" />
        </div>
      </div>

      {/* Headline */}
      <h2
        className="text-2xl md:text-3xl font-bold text-white text-center px-8 mb-3 leading-snug"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {meta.headline}
      </h2>

      {/* Subtitle */}
      <p className="text-sm text-white/70 text-center">
        {remainingQuestions} questions remaining
      </p>

      {/* Tap hint */}
      <p className="absolute bottom-10 text-xs text-white/40 text-center">
        Tap to continue
      </p>

      {/* Breathing animation keyframes */}
      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.3); opacity: 0.08; }
        }
      `}</style>
    </div>
  );
}
