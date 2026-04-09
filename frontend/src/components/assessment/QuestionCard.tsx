import { Leaf, Zap, Mountain } from 'lucide-react';
import { useAssessmentStore } from '../../stores/assessment-store';
import { SECTION_CONFIG, DEEP_SECTION_CONFIG, SECTION_ORDER } from '../../lib/constants';
import { SectionProgress } from './SectionProgress';
import { AnswerSelector } from './AnswerSelector';
import type { AnswerValue, GunaType } from '../../types';

const SECTION_COLORS: Record<GunaType, { main: string; dark: string; tint: string }> = {
  sattva: { main: '#7BA05B', dark: '#466729', tint: '#eff5eb' },
  rajas: { main: '#D4A017', dark: '#8B6914', tint: '#fdf6e3' },
  tamas: { main: '#5B6B7A', dark: '#50606f', tint: '#f0f2f4' },
};

const SECTION_ICONS: Record<GunaType, typeof Leaf> = {
  sattva: Leaf,
  rajas: Zap,
  tamas: Mountain,
};

const AYURVEDIC_QUOTES = [
  '"The mind is the root of all actions."  - Charaka Samhita',
  '"When the mind is balanced, the body follows."  - Sushruta',
  '"Self-knowledge is the beginning of wisdom."  - Vagbhata',
];

interface QuestionCardProps {
  onTransition: () => void;
  onComplete: () => void;
}

export function QuestionCard({ onTransition, onComplete }: QuestionCardProps) {
  const {
    questions,
    currentQuestionIndex,
    answers,
    assessmentType,
    currentSection,
    currentSectionIndex,
    sectionProgress,
    setAnswer,
    nextQuestion,
  } = useAssessmentStore();

  const sectionConfig = assessmentType === 'deep' ? DEEP_SECTION_CONFIG : SECTION_CONFIG;
  const section = currentSection();
  currentSectionIndex(); // keep reactive
  const progress = sectionProgress();
  const total = SECTION_ORDER.reduce((sum, s) => sum + sectionConfig[s].questions, 0);
  const question = questions[currentQuestionIndex];

  if (!question) return null;

  const colors = SECTION_COLORS[section];
  const Icon = SECTION_ICONS[section];
  const partNumber = SECTION_ORDER.indexOf(section) + 1;
  const config = sectionConfig[section];
  const selectedAnswer = answers[question.id] as AnswerValue | undefined;

  // Pick a quote based on question index
  const quote = AYURVEDIC_QUOTES[currentQuestionIndex % AYURVEDIC_QUOTES.length];

  const handleAnswer = (answer: AnswerValue) => {
    setAnswer(question.id, answer);

    // Auto-advance after 300ms
    setTimeout(() => {
      const result = nextQuestion();
      if (result === 'transition') {
        onTransition();
      } else if (result === 'complete') {
        onComplete();
      }
    }, 300);
  };

  return (
    <div className="w-full max-w-[480px] mx-auto px-4 py-6 flex flex-col min-h-[calc(100vh-64px)]">
      {/* Section label */}
      <div className="text-center mb-2">
        <span
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: colors.main }}
        >
          Part {partNumber} of 3: {config.label}
        </span>
        <span
          className="block text-xs mt-0.5 italic"
          style={{ color: colors.dark }}
        >
          {config.subtitle}
        </span>
      </div>

      {/* Question counter */}
      <div className="text-center mb-3">
        <span className="text-sm font-medium" style={{ color: 'var(--on-surface-variant)' }}>
          {currentQuestionIndex + 1} of {total}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <SectionProgress
          currentGlobalIndex={currentQuestionIndex}
          sectionProgress={progress}
        />
      </div>

      {/* Guna icon */}
      <div className="flex justify-center mb-6">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{ backgroundColor: colors.tint }}
        >
          <Icon className="w-7 h-7" style={{ color: colors.main }} />
        </div>
      </div>

      {/* Question text */}
      <h2
        className="text-xl md:text-2xl font-bold text-center leading-snug mb-3 flex-shrink-0"
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          color: 'var(--on-surface)',
        }}
      >
        {question.text_en}
      </h2>

      {/* Bhava tag */}
      <p className="text-center text-sm italic mb-8" style={{ color: 'var(--on-surface-variant)' }}>
        {question.bhava_tag}  - {question.bhava_description_en}
      </p>

      {/* Answer buttons */}
      <div className="flex-1 flex flex-col justify-center">
        <AnswerSelector
          currentSection={section}
          selectedAnswer={selectedAnswer}
          onSelect={handleAnswer}
        />
      </div>

      {/* Context hint */}
      <div
        className="mt-8 p-4 rounded-xl text-center"
        style={{ backgroundColor: '#F5F0EB' }}
      >
        <p className="text-xs italic leading-relaxed" style={{ color: 'var(--on-surface-variant)' }}>
          {quote}
        </p>
      </div>
    </div>
  );
}
