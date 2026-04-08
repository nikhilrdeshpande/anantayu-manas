import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageLayout } from '../components/layout/PageLayout';
import { PrakritiCard } from '../components/results/PrakritiCard';
import { ShareButtons } from '../components/results/ShareButtons';
import { DetailedReport } from '../components/results/DetailedReport';
import { AIInsights } from '../components/results/AIInsights';
import { useAssessmentStore } from '../stores/assessment-store';
import { PRAKRITI_DATA } from '../lib/prakriti-data';
import type { ScoringResult, SattvaBalaGrade, GunaType } from '../types';
import type { ApiResult } from '../lib/api';

// Sample data for development — always shows something useful
const SAMPLE_RESULT: ScoringResult = {
  sattvaYes: 7,
  sattvaNo: 1,
  sattvaSometimes: 2,
  rajasYes: 5,
  rajasNo: 3,
  rajasSometimes: 2,
  tamasYes: 1,
  tamasNo: 3,
  tamasSometimes: 1,
  sattvaPrimaryPct: 70,
  rajasPrimaryPct: 50,
  tamasPrimaryPct: 20,
  sattvaSecondaryPct: 76.6,
  rajasSecondaryPct: 63.4,
  tamasSecondaryPct: 26.6,
  primaryDominantGuna: 'sattva',
  secondaryDominantGuna: 'rajas',
  prakritiType: 'Sattva-Rajasika',
  prakritiSubtype: null,
  archetypeTitle: 'The Enlightened Leader',
  sattvaBalaGrade: 'pravara',
};

/**
 * Look up prakriti data by normalizing the prakriti type string to a key.
 * The store returns names like "Sattvika", "Sattva-Rajasika", etc.
 * The PRAKRITI_DATA keys are "sattvika", "sattvika-rajasika", etc.
 */
function lookupPrakritiData(prakritiType: string) {
  // Try direct lowercase match
  const directKey = prakritiType.toLowerCase().replace(/\s+/g, '-');
  if (PRAKRITI_DATA[directKey]) return PRAKRITI_DATA[directKey];

  // Try mapping store format to data keys
  const mappings: Record<string, string> = {
    sattvika: 'sattvika',
    rajasika: 'rajasika',
    tamasika: 'tamasika',
    'sattva-rajasika': 'sattvika-rajasika',
    'rajo-sattvika': 'sattvika-rajasika',
    'sattva-tamasika': 'sattvika-tamasika',
    'rajo-tamasika': 'rajasika-tamasika',
    trigunatmaka: 'trigunatmaka',
  };

  const normalized = prakritiType.toLowerCase().replace(/\s+/g, '-');
  const mappedKey = mappings[normalized];
  if (mappedKey && PRAKRITI_DATA[mappedKey]) return PRAKRITI_DATA[mappedKey];

  // Fuzzy: check if any key is contained in the type
  for (const [key, data] of Object.entries(PRAKRITI_DATA)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return data;
    }
  }

  // Default fallback
  return PRAKRITI_DATA['sattvika-rajasika'];
}

/**
 * Convert an ApiResult from the backend into a ScoringResult shape used by the UI.
 */
function apiResultToScoringResult(sr: ApiResult): ScoringResult {
  return {
    sattvaYes: sr.sattva_yes,
    sattvaNo: sr.sattva_no,
    sattvaSometimes: sr.sattva_sometimes,
    rajasYes: sr.rajas_yes,
    rajasNo: sr.rajas_no,
    rajasSometimes: sr.rajas_sometimes,
    tamasYes: sr.tamas_yes,
    tamasNo: sr.tamas_no,
    tamasSometimes: sr.tamas_sometimes,
    sattvaPrimaryPct: Number(sr.sattva_primary_pct),
    rajasPrimaryPct: Number(sr.rajas_primary_pct),
    tamasPrimaryPct: Number(sr.tamas_primary_pct),
    sattvaSecondaryPct: Number(sr.sattva_secondary_pct),
    rajasSecondaryPct: Number(sr.rajas_secondary_pct),
    tamasSecondaryPct: Number(sr.tamas_secondary_pct),
    primaryDominantGuna: sr.primary_dominant_guna as GunaType,
    secondaryDominantGuna: sr.secondary_dominant_guna as GunaType | null,
    prakritiType: sr.prakriti_type,
    prakritiSubtype: sr.prakriti_subtype,
    archetypeTitle: sr.archetype_title,
    sattvaBalaGrade: sr.sattva_bala as SattvaBalaGrade,
  };
}

export default function Results() {
  const navigate = useNavigate();
  const scoringResult = useAssessmentStore((s) => s.scoringResult);
  const serverResult = useAssessmentStore((s) => s.serverResult);
  const assessmentId = useAssessmentStore((s) => s.assessmentId);

  // Prefer server result, fall back to client-side, then localStorage, then sample
  const result: ScoringResult = useMemo(() => {
    if (serverResult) return apiResultToScoringResult(serverResult);
    if (scoringResult) return scoringResult;

    // Try localStorage fallbacks
    try {
      const storedServer = localStorage.getItem('manas_server_result');
      if (storedServer) return apiResultToScoringResult(JSON.parse(storedServer) as ApiResult);
    } catch { /* ignore */ }

    try {
      const stored = localStorage.getItem('manas_scoring_result');
      if (stored) return JSON.parse(stored) as ScoringResult;
    } catch {
      // ignore
    }

    return SAMPLE_RESULT;
  }, [serverResult, scoringResult]);

  const prakritiInfo = useMemo(() => lookupPrakritiData(result.prakritiType), [result.prakritiType]);

  // Determine traits from prakriti data or fallback
  const traits = prakritiInfo.traits;
  const archetypeTitle = result.archetypeTitle || prakritiInfo.archetype;

  return (
    <PageLayout>
      <div className="w-full max-w-3xl mx-auto px-4 py-8 flex flex-col gap-10">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-medium w-fit cursor-pointer"
          style={{ color: 'var(--on-surface-variant)' }}
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* Prakriti Card */}
        <div className="flex justify-center">
          <PrakritiCard
            prakritiType={result.prakritiType}
            archetypeTitle={archetypeTitle}
            sattvaPercent={result.sattvaSecondaryPct}
            rajasPercent={result.rajasSecondaryPct}
            tamasPercent={result.tamasSecondaryPct}
            sattvaBala={result.sattvaBalaGrade}
            traits={traits}
          />
        </div>

        {/* Share buttons */}
        <ShareButtons prakritiType={result.prakritiType} />

        {/* Detailed Report */}
        <DetailedReport result={result} prakritiInfo={prakritiInfo} />

        {/* AI Insights (streamed from backend) */}
        <AIInsights
          assessmentId={assessmentId}
          fallbackText={prakritiInfo.aiInsight}
        />
      </div>
    </PageLayout>
  );
}
