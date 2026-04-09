import { useEffect, useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAssessmentStore } from '../stores/assessment-store';
import { useAuthStore } from '../stores/auth-store';
import { usePurchaseStore } from '../stores/purchase-store';
import { AssessmentTopBar } from '../components/assessment/AssessmentTopBar';
import { QuestionCard } from '../components/assessment/QuestionCard';
import { SectionTransition } from '../components/assessment/SectionTransition';
import { ProcessingScreen } from '../components/assessment/ProcessingScreen';
import { SECTION_ORDER, DEEP_SECTION_CONFIG } from '../lib/constants';
import type { AnswerValue, GunaType } from '../types';
import quickQuestionsData from '../data/questions_quick_en.json';
import fullQuestionsData from '../data/questions_full_en.json';

/**
 * Build a mapping from full question IDs to quick question IDs
 * based on matching question text. This lets us carry over answers
 * from the free assessment so users don't repeat questions.
 */
function buildQuickToFullMap(): Map<number, number> {
  const quickByText = new Map<string, number>();
  for (const q of quickQuestionsData) {
    quickByText.set(q.text_en, q.id);
  }
  // Map: full_question_id -> quick_question_id
  const fullToQuick = new Map<number, number>();
  for (const fq of fullQuestionsData) {
    const quickId = quickByText.get(fq.text_en);
    if (quickId !== undefined) {
      fullToQuick.set(fq.id, quickId);
    }
  }
  return fullToQuick;
}

export default function DeepAssessment() {
  const navigate = useNavigate();
  const { locale = 'en' } = useParams();
  const { user, isAuthenticated } = useAuthStore();
  const { phase, setPhase, loadQuestions, questions, currentQuestionIndex, reset, setAnswer } = useAssessmentStore();
  const { checkAccess } = usePurchaseStore();
  const [transitionSection, setTransitionSection] = useState<GunaType>('rajas');
  const [accessChecked, setAccessChecked] = useState(false);
  const [ready, setReady] = useState(false);

  // Verify purchase access
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate(`/${locale}/login`);
      return;
    }
    checkAccess(user.id).then((hasAccess) => {
      if (!hasAccess) {
        navigate(`/${locale}/pricing`);
      } else {
        setAccessChecked(true);
      }
    });
  }, [isAuthenticated, user]);

  // Load deep questions and carry over quick assessment answers
  useEffect(() => {
    if (!accessChecked) return;
    reset();
    loadQuestions('deep');

    // Carry over answers from the latest quick assessment (stored in localStorage)
    const carried = carryOverQuickAnswers();
    if (carried > 0) {
      // Find first unanswered question
      const store = useAssessmentStore.getState();
      const answers = store.answers;
      let firstUnanswered = 0;
      for (let i = 0; i < store.questions.length; i++) {
        if (!answers[store.questions[i].id]) {
          firstUnanswered = i;
          break;
        }
        firstUnanswered = i + 1;
      }
      // Clamp to valid range
      const jumpTo = Math.min(firstUnanswered, store.questions.length - 1);
      useAssessmentStore.setState({ currentQuestionIndex: jumpTo });
    }

    setPhase('quiz');
    setReady(true);
  }, [accessChecked]);

  function carryOverQuickAnswers(): number {
    // Try to load quick assessment answers from localStorage
    let quickAnswers: Record<number, AnswerValue> = {};
    try {
      const stored = localStorage.getItem('manas_assessment_answers');
      if (stored) quickAnswers = JSON.parse(stored) as Record<number, AnswerValue>;
    } catch { return 0; }

    if (Object.keys(quickAnswers).length === 0) return 0;

    const fullToQuick = buildQuickToFullMap();
    let carried = 0;

    for (const [fullId, quickId] of fullToQuick) {
      const answer = quickAnswers[quickId];
      if (answer) {
        setAnswer(fullId, answer);
        carried++;
      }
    }

    return carried;
  }

  const getCurrentSection = useCallback((): GunaType => {
    let cumulative = 0;
    for (const s of SECTION_ORDER) {
      cumulative += DEEP_SECTION_CONFIG[s].questions;
      if (currentQuestionIndex < cumulative) return s;
    }
    return 'tamas';
  }, [currentQuestionIndex]);

  const handleTransition = useCallback(() => {
    const section = getCurrentSection();
    setTransitionSection(section);
    setPhase('transition');
  }, [getCurrentSection, setPhase]);

  const handleTransitionContinue = useCallback(() => {
    setPhase('quiz');
  }, [setPhase]);

  const handleComplete = useCallback(() => {
    setPhase('processing');
  }, [setPhase]);

  const handleProcessingComplete = useCallback(async () => {
    const store = useAssessmentStore.getState();
    const result = await store.submitToBackend();
    const assessmentId = result?.assessment_id || store.assessmentId || 'local';
    navigate(`/${locale}/deep-results/${assessmentId}`);
  }, [navigate, locale]);

  if (!accessChecked || !ready || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF5]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#d4a017] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[#4f4634]">Preparing deep assessment...</p>
        </div>
      </div>
    );
  }

  if (phase === 'processing') {
    return <ProcessingScreen onComplete={handleProcessingComplete} />;
  }

  if (phase === 'transition') {
    return (
      <SectionTransition
        nextSection={transitionSection}
        onContinue={handleTransitionContinue}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF5]">
      <AssessmentTopBar />
      <div className="pt-14">
        <QuestionCard
          onTransition={handleTransition}
          onComplete={handleComplete}
        />
      </div>
    </div>
  );
}
