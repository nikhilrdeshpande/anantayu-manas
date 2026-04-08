export type PrakritiType =
  | 'vata'
  | 'pitta'
  | 'kapha'
  | 'vata-pitta'
  | 'pitta-kapha'
  | 'vata-kapha'
  | 'tridoshic';

export type GunaType = 'sattva' | 'rajas' | 'tamas';

export type AnswerValue = 'yes' | 'no' | 'sometimes';

export type AssessmentType = 'quick' | 'deep';

export type AssessmentPhase = 'idle' | 'intro' | 'quiz' | 'transition' | 'processing' | 'complete';

export interface Question {
  id: number;
  section: GunaType;
  question_number: number;
  text_en: string;
  bhava_tag: string;
  bhava_description_en: string;
}

export interface Answer {
  questionId: number;
  value: AnswerValue;
}

export interface GunaScore {
  sattva: number;
  rajas: number;
  tamas: number;
}

export interface SattvaBala {
  score: number;
  label: string;
  description: string;
}

export interface Assessment {
  id: string;
  type: AssessmentType;
  answers: Answer[];
  gunaScores: GunaScore;
  prakritiType: PrakritiType;
  sattvaBala: SattvaBala;
  createdAt: string;
  locale: string;
}

export interface Result {
  assessmentId: string;
  prakritiType: PrakritiType;
  gunaScores: GunaScore;
  sattvaBala: SattvaBala;
  insights: string[];
  recommendations: string[];
}

export type ManasPrakritiType = string;

export type SattvaBalaGrade = 'pravara' | 'madhya' | 'avara';

export interface ScoringResult {
  // Raw counts
  sattvaYes: number;
  sattvaNo: number;
  sattvaSometimes: number;
  rajasYes: number;
  rajasNo: number;
  rajasSometimes: number;
  tamasYes: number;
  tamasNo: number;
  tamasSometimes: number;
  // Primary percentages (YES / total * 100)
  sattvaPrimaryPct: number;
  rajasPrimaryPct: number;
  tamasPrimaryPct: number;
  // Secondary percentages (after SOMETIMES conversion)
  sattvaSecondaryPct: number;
  rajasSecondaryPct: number;
  tamasSecondaryPct: number;
  // Classification
  primaryDominantGuna: GunaType;
  secondaryDominantGuna: GunaType | null;
  prakritiType: string;
  prakritiSubtype: string | null;
  archetypeTitle: string | null;
  sattvaBalaGrade: SattvaBalaGrade;
}
