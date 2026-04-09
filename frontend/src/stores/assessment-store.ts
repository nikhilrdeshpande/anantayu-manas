import { create } from 'zustand';
import type { AnswerValue, AssessmentPhase, AssessmentType, GunaType, Question, ScoringResult, SattvaBalaGrade } from '../types';
import { SECTION_ORDER, SECTION_CONFIG, DEEP_SECTION_CONFIG } from '../lib/constants';
import { manas, type ApiDemographics, type ApiResult } from '../lib/api';
import quickQuestionsData from '../data/questions_quick_en.json';
import fullQuestionsData from '../data/questions_full_en.json';

// ── Storage helpers ──
const STORAGE_KEY = 'manas_assessment_answers';

function loadAnswers(): Record<number, AnswerValue> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as Record<number, AnswerValue>;
  } catch { /* ignore */ }
  return {};
}

function saveAnswers(answers: Record<number, AnswerValue>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  } catch { /* ignore */ }
}

function clearAnswers() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch { /* ignore */ }
}

// ── Section boundary helpers ──
function getConfig(type: AssessmentType) {
  return type === 'deep' ? DEEP_SECTION_CONFIG : SECTION_CONFIG;
}

function getSectionStartIndex(section: GunaType, type: AssessmentType = 'quick'): number {
  const config = getConfig(type);
  let start = 0;
  for (const s of SECTION_ORDER) {
    if (s === section) return start;
    start += config[s].questions;
  }
  return start;
}

function getSectionForGlobalIndex(index: number, type: AssessmentType = 'quick'): GunaType {
  const config = getConfig(type);
  let cumulative = 0;
  for (const s of SECTION_ORDER) {
    cumulative += config[s].questions;
    if (index < cumulative) return s;
  }
  return 'tamas';
}

function getIndexWithinSection(globalIndex: number, type: AssessmentType = 'quick'): number {
  const section = getSectionForGlobalIndex(globalIndex, type);
  return globalIndex - getSectionStartIndex(section, type);
}

function getTotalQuestions(type: AssessmentType = 'quick'): number {
  const config = getConfig(type);
  return SECTION_ORDER.reduce((sum, s) => sum + config[s].questions, 0);
}

// ── Scoring ──
const DUAL_TYPE_THRESHOLD = 10;

const SINGLE_TYPES: Record<string, { prakritiType: string; archetypeTitle: string }> = {
  sattva: { prakritiType: 'Sattvika', archetypeTitle: 'The Harmoniser' },
  rajas: { prakritiType: 'Rajasika', archetypeTitle: 'The Dynamo' },
  tamas: { prakritiType: 'Tamasika', archetypeTitle: 'The Anchor' },
};

const DUAL_TYPES: Record<string, { prakritiType: string; archetypeTitle: string }> = {
  'sattva-rajas': { prakritiType: 'Sattva-Rajasika', archetypeTitle: 'The Enlightened Leader' },
  'sattva-tamas': { prakritiType: 'Sattva-Tamasika', archetypeTitle: 'The Reflective Sage' },
  'rajas-sattva': { prakritiType: 'Rajo-Sattvika', archetypeTitle: 'The Passionate Visionary' },
  'rajas-tamas': { prakritiType: 'Rajo-Tamasika', archetypeTitle: 'The Restless Warrior' },
};

function computeScoringResult(answers: Record<number, AnswerValue>, questions: Question[], type: AssessmentType = 'quick'): ScoringResult {
  const config = getConfig(type);
  const totals = { sattva: config.sattva.questions, rajas: config.rajas.questions, tamas: config.tamas.questions };

  // Step 1: Count raw answers per section
  const counts: Record<GunaType, Record<string, number>> = {
    sattva: { yes: 0, no: 0, sometimes: 0 },
    rajas: { yes: 0, no: 0, sometimes: 0 },
    tamas: { yes: 0, no: 0, sometimes: 0 },
  };

  for (const q of questions) {
    const answer = answers[q.id];
    if (answer && counts[q.section]) {
      counts[q.section][answer]++;
    }
  }

  const sattvaYes = counts.sattva.yes;
  const sattvaNo = counts.sattva.no;
  const sattvaSometimes = counts.sattva.sometimes;
  const rajasYes = counts.rajas.yes;
  const rajasNo = counts.rajas.no;
  const rajasSometimes = counts.rajas.sometimes;
  const tamasYes = counts.tamas.yes;
  const tamasNo = counts.tamas.no;
  const tamasSometimes = counts.tamas.sometimes;

  // Step 2: Primary percentages (YES / total * 100)
  const pct = (count: number, total: number) => total === 0 ? 0 : Math.round((count / total) * 10000) / 100;

  const sattvaPrimaryPct = pct(sattvaYes, totals.sattva);
  const rajasPrimaryPct = pct(rajasYes, totals.rajas);
  const tamasPrimaryPct = pct(tamasYes, totals.tamas);

  // Step 3: Convert SOMETIMES
  // Sattva & Tamas (dormant): 33% -> YES, 67% -> NO
  // Rajas (active): 67% -> YES, 33% -> NO
  const sattvaAdjYes = sattvaYes + sattvaSometimes * 0.33;
  const rajasAdjYes = rajasYes + rajasSometimes * 0.67;
  const tamasAdjYes = tamasYes + tamasSometimes * 0.33;

  // Step 4: Secondary percentages
  const sattvaSecondaryPct = pct(sattvaAdjYes, totals.sattva);
  const rajasSecondaryPct = pct(rajasAdjYes, totals.rajas);
  const tamasSecondaryPct = pct(tamasAdjYes, totals.tamas);

  // Step 5: Find dominant gunas
  const gunaScores: [GunaType, number][] = [
    ['sattva', sattvaSecondaryPct],
    ['rajas', rajasSecondaryPct],
    ['tamas', tamasSecondaryPct],
  ];
  gunaScores.sort((a, b) => b[1] - a[1]);

  const primaryDominantGuna = gunaScores[0][0];
  let secondaryDominantGuna: GunaType | null = null;
  if (gunaScores[1][1] > 0) {
    secondaryDominantGuna = gunaScores[1][0];
  }

  // Step 6: Classify prakriti type
  let prakritiType: string;
  let prakritiSubtype: string | null = null;
  let archetypeTitle: string | null = null;

  const top = gunaScores[0];
  const runnerUp = gunaScores[1];
  const gap = top[1] - runnerUp[1];
  const isDual = runnerUp[1] > 0 && gap <= DUAL_TYPE_THRESHOLD;

  if (isDual) {
    const key = `${top[0]}-${runnerUp[0]}`;
    const dualInfo = DUAL_TYPES[key];
    if (dualInfo) {
      prakritiType = dualInfo.prakritiType;
      archetypeTitle = dualInfo.archetypeTitle;
    } else {
      prakritiType = `${top[0].charAt(0).toUpperCase() + top[0].slice(1)}-${runnerUp[0].charAt(0).toUpperCase() + runnerUp[0].slice(1)}`;
    }
  } else {
    const singleInfo = SINGLE_TYPES[primaryDominantGuna];
    if (singleInfo) {
      prakritiType = singleInfo.prakritiType;
      archetypeTitle = singleInfo.archetypeTitle;
    } else {
      prakritiType = primaryDominantGuna.charAt(0).toUpperCase() + primaryDominantGuna.slice(1);
    }
  }

  // Step 7: Sattva bala
  let sattvaBalaGrade: SattvaBalaGrade;
  if (sattvaSecondaryPct >= 66) {
    sattvaBalaGrade = 'pravara';
  } else if (sattvaSecondaryPct >= 33) {
    sattvaBalaGrade = 'madhya';
  } else {
    sattvaBalaGrade = 'avara';
  }

  return {
    sattvaYes, sattvaNo, sattvaSometimes,
    rajasYes, rajasNo, rajasSometimes,
    tamasYes, tamasNo, tamasSometimes,
    sattvaPrimaryPct, rajasPrimaryPct, tamasPrimaryPct,
    sattvaSecondaryPct, rajasSecondaryPct, tamasSecondaryPct,
    primaryDominantGuna,
    secondaryDominantGuna,
    prakritiType,
    prakritiSubtype,
    archetypeTitle,
    sattvaBalaGrade,
  };
}

// ── Store ──
interface AssessmentState {
  assessmentId: string | null;
  assessmentType: AssessmentType;
  questions: Question[];
  currentQuestionIndex: number; // global 0-24 index
  answers: Record<number, AnswerValue>;
  phase: AssessmentPhase;
  scoringResult: ScoringResult | null;
  serverResult: ApiResult | null;
  demographics: ApiDemographics | null;

  // Computed getters
  currentSection: () => GunaType;
  currentSectionIndex: () => number;
  totalAnswered: () => number;
  sectionProgress: () => { sattva: number; rajas: number; tamas: number };

  // Actions
  loadQuestions: (type?: AssessmentType) => void;
  setAnswer: (questionId: number, answer: AnswerValue) => void;
  nextQuestion: () => 'next' | 'transition' | 'complete';
  previousQuestion: () => void;
  setPhase: (phase: AssessmentPhase) => void;
  computeResults: () => ScoringResult;
  submitToBackend: () => Promise<ApiResult | null>;
  reset: () => void;
  saveProgress: () => Promise<void>;
  loadSavedProgress: () => Promise<boolean>;
  setDemographics: (demographics: ApiDemographics) => void;
}

export const useAssessmentStore = create<AssessmentState>((set, get) => {
  const savedAnswers = loadAnswers();

  return {
    assessmentId: null,
    assessmentType: 'quick',
    questions: [],
    currentQuestionIndex: 0,
    answers: savedAnswers,
    phase: 'idle',
    scoringResult: null,
    serverResult: null,
    demographics: null,

    currentSection: () => getSectionForGlobalIndex(get().currentQuestionIndex, get().assessmentType),
    currentSectionIndex: () => getIndexWithinSection(get().currentQuestionIndex, get().assessmentType),

    totalAnswered: () => Object.keys(get().answers).length,

    sectionProgress: () => {
      const { answers, questions } = get();
      const progress = { sattva: 0, rajas: 0, tamas: 0 };
      for (const q of questions) {
        if (answers[q.id]) {
          progress[q.section]++;
        }
      }
      return progress;
    },

    loadQuestions: (type?: AssessmentType) => {
      const assessmentType = type || get().assessmentType;
      const data = assessmentType === 'deep' ? fullQuestionsData : quickQuestionsData;
      const questions = data as Question[];
      set({ questions, assessmentType });
    },

    setAnswer: (questionId, answer) => {
      const newAnswers = { ...get().answers, [questionId]: answer };
      saveAnswers(newAnswers);
      set({ answers: newAnswers });

      // Auto-save progress every 5 answers if logged in
      const answeredCount = Object.keys(newAnswers).length;
      if (answeredCount % 5 === 0) {
        get().saveProgress();
      }
    },

    nextQuestion: () => {
      const { currentQuestionIndex, assessmentType } = get();
      const total = getTotalQuestions(assessmentType);
      const currentSection = getSectionForGlobalIndex(currentQuestionIndex, assessmentType);

      if (currentQuestionIndex >= total - 1) {
        return 'complete';
      }

      const nextIndex = currentQuestionIndex + 1;
      const nextSection = getSectionForGlobalIndex(nextIndex, assessmentType);

      set({ currentQuestionIndex: nextIndex });

      if (nextSection !== currentSection) {
        return 'transition';
      }

      return 'next';
    },

    previousQuestion: () => {
      const { currentQuestionIndex } = get();
      if (currentQuestionIndex > 0) {
        set({ currentQuestionIndex: currentQuestionIndex - 1 });
      }
    },

    setPhase: (phase) => set({ phase }),

    computeResults: () => {
      const { answers, questions, assessmentType } = get();
      const result = computeScoringResult(answers, questions, assessmentType);
      set({ scoringResult: result, phase: 'complete' });

      // Persist result to localStorage for Results page
      try {
        localStorage.setItem('manas_scoring_result', JSON.stringify(result));
      } catch { /* ignore */ }

      return result;
    },

    submitToBackend: async () => {
      const state = get();
      const { useAuthStore } = await import('./auth-store');
      const user = useAuthStore.getState().user;

      const answerItems = state.questions.map((q) => ({
        question_id: q.id,
        answer: (state.answers[q.id] || 'no').toUpperCase(),
      }));

      try {
        const result = await manas.submitAssessment({
          assessment_type: state.assessmentType,
          locale: 'en',
          answers: answerItems,
          user_id: user?.id || undefined,
          demographics: state.demographics || undefined,
        });
        set({ serverResult: result, assessmentId: result.assessment_id });

        // Also compute local result as backup
        const localResult = computeScoringResult(state.answers, state.questions);
        set({ scoringResult: localResult, phase: 'complete' });

        // Persist to localStorage
        try {
          localStorage.setItem('manas_scoring_result', JSON.stringify(localResult));
          localStorage.setItem('manas_server_result', JSON.stringify(result));
        } catch { /* ignore */ }

        return result;
      } catch (err) {
        console.warn('Backend submit failed, using client-side scoring:', err);
        // Fall back to client-side scoring
        const localResult = computeScoringResult(state.answers, state.questions);
        set({ scoringResult: localResult, phase: 'complete' });

        try {
          localStorage.setItem('manas_scoring_result', JSON.stringify(localResult));
        } catch { /* ignore */ }

        return null;
      }
    },

    reset: () => {
      clearAnswers();
      try { localStorage.removeItem('manas_scoring_result'); } catch { /* ignore */ }
      try { localStorage.removeItem('manas_server_result'); } catch { /* ignore */ }
      set({
        assessmentId: null,
        assessmentType: 'quick',
        currentQuestionIndex: 0,
        answers: {},
        phase: 'idle',
        scoringResult: null,
        serverResult: null,
        demographics: null,
      });
    },

    setDemographics: (demographics) => {
      set({ demographics });
    },

    saveProgress: async () => {
      const { useAuthStore } = await import('./auth-store');
      const user = useAuthStore.getState().user;
      if (!user) return;

      const state = get();
      const answeredItems = state.questions
        .filter(q => state.answers[q.id])
        .map(q => ({ question_id: q.id, answer: state.answers[q.id]!.toUpperCase() }));

      try {
        await manas.saveProgress(user.id, state.assessmentType, state.currentQuestionIndex, answeredItems);
      } catch (err) {
        console.warn('Failed to save progress:', err);
      }
    },

    loadSavedProgress: async () => {
      const { useAuthStore } = await import('./auth-store');
      const user = useAuthStore.getState().user;
      if (!user) return false;

      try {
        const data = await manas.getResumeData(user.id);
        if (!data.has_progress || !data.answers?.length) return false;

        // Restore answers
        const restoredAnswers: Record<number, AnswerValue> = {};
        for (const a of data.answers) {
          restoredAnswers[a.question_id] = a.answer.toLowerCase() as AnswerValue;
        }

        // Figure out where to resume (first unanswered question)
        const state = get();
        let resumeIndex = 0;
        for (let i = 0; i < state.questions.length; i++) {
          if (!restoredAnswers[state.questions[i].id]) {
            resumeIndex = i;
            break;
          }
          resumeIndex = i + 1;
        }

        set({ answers: restoredAnswers, currentQuestionIndex: Math.min(resumeIndex, state.questions.length - 1) });
        saveAnswers(restoredAnswers);
        return true;
      } catch {
        return false;
      }
    },
  };
});
