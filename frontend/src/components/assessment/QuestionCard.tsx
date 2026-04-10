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
    <div className="w-full max-w-[520px] mx-auto px-4 py-6 flex flex-col min-h-[calc(100vh-56px)]">
      {/* Section label */}
      <div className="text-center mb-2">
        <span
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: colors.main }}
        >
          Part {partNumber} of 3 - {config.label}
        </span>
        <span className="block text-xs mt-1 italic text-[#9b8f7a]">
          {config.subtitle}
        </span>
      </div>

      {/* Question counter */}
      <div className="text-center mb-3">
        <span className="text-xs uppercase tracking-wider font-medium text-[#d3c5ae]">
          Question {currentQuestionIndex + 1} of {total}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-10">
        <SectionProgress
          currentGlobalIndex={currentQuestionIndex}
          sectionProgress={progress}
        />
      </div>

      {/* Guna icon */}
      <div className="flex justify-center mb-6">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center border"
          style={{ backgroundColor: `${colors.main}1a`, borderColor: `${colors.main}33` }}
        >
          <Icon className="w-8 h-8" style={{ color: colors.main }} />
        </div>
      </div>

      {/* Question text */}
      <h2 className="text-xl md:text-2xl font-bold text-center leading-snug mb-3 flex-shrink-0 text-[#e5e2e1] font-['Plus_Jakarta_Sans']">
        {question.text_en}
      </h2>

      {/* Bhava tag */}
      <p className="text-center text-xs italic mb-10 text-[#9b8f7a]">
        {question.bhava_tag} - {question.bhava_description_en}
      </p>

      {/* Answer buttons */}
      <div className="flex-1 flex flex-col justify-center">
        <AnswerSelector
          currentSection={section}
          selectedAnswer={selectedAnswer}
          onSelect={handleAnswer}
        />
      </div>

      {/* Quote */}
      <div className="mt-10 p-4 rounded-xl text-center bg-white/[0.03] border border-white/[0.06]">
        <p className="text-xs italic leading-relaxed text-[#9b8f7a]">
          {quote}
        </p>
      </div>
    </div>
  );
}
