import { useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessmentStore } from '../stores/assessment-store';
import { AssessmentTopBar } from '../components/assessment/AssessmentTopBar';
import { QuestionCard } from '../components/assessment/QuestionCard';
import { SectionTransition } from '../components/assessment/SectionTransition';
import { ProcessingScreen } from '../components/assessment/ProcessingScreen';
import { SECTION_ORDER, SECTION_CONFIG } from '../lib/constants';
import type { GunaType } from '../types';

export default function Assessment() {
  const navigate = useNavigate();
  const { phase, setPhase, loadQuestions, questions, currentQuestionIndex } = useAssessmentStore();
  const [transitionSection, setTransitionSection] = useState<GunaType>('rajas');

  // Load questions on mount if not loaded
  useEffect(() => {
    if (questions.length === 0) {
      loadQuestions();
    }
    // If phase is idle, set to quiz (in case they navigate directly)
    if (phase === 'idle' || phase === 'intro') {
      setPhase('quiz');
    }
  }, []);

  // Determine the current section from the global index
  const getCurrentSection = useCallback((): GunaType => {
    let cumulative = 0;
    for (const s of SECTION_ORDER) {
      cumulative += SECTION_CONFIG[s].questions;
      if (currentQuestionIndex < cumulative) return s;
    }
    return 'tamas';
  }, [currentQuestionIndex]);

  const handleTransition = useCallback(() => {
    // Figure out which section we just entered
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
    await store.submitToBackend();
    navigate('/en/results/local');
  }, [navigate]);

  // If no questions loaded yet, show nothing
  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAFAF5' }}>
        <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>Loading...</p>
      </div>
    );
  }

  // Processing screen (full-screen overlay)
  if (phase === 'processing') {
    return <ProcessingScreen onComplete={handleProcessingComplete} />;
  }

  // Section transition (full-screen overlay)
  if (phase === 'transition') {
    return (
      <SectionTransition
        nextSection={transitionSection}
        onContinue={handleTransitionContinue}
      />
    );
  }

  // Quiz phase
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF5' }}>
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
