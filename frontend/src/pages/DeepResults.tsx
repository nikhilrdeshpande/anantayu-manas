import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Share2, MessageCircle, Check, Loader2, Download } from 'lucide-react';
import { PageLayout } from '../components/layout/PageLayout';
import { GunaChart } from '../components/results/GunaChart';
import { GunaBar } from '../components/results/GunaBar';
import {
  WhoYouAreSection,
  StrengthsShadowsSection,
  DietSection,
  RoutineSection,
  PracticesSection,
  ThirtyDaySection,
  type DeepReportData,
  type SubtypeProfile,
} from '../components/results/DeepReportSection';
import { ConsultationCTA } from '../components/results/ConsultationCTA';
import { useAssessmentStore } from '../stores/assessment-store';
import { useAuthStore } from '../stores/auth-store';
import { manas, type ApiResult } from '../lib/api';
import { shareResults } from '../lib/share';

/**
 * Extract valid JSON from AI response that may be wrapped in markdown
 * code fences, have leading/trailing text, or other artifacts.
 */
function extractJSON(raw: string): DeepReportData | null {
  let text = raw.trim();

  // Strip markdown code fences: ```json ... ``` or ``` ... ```
  const fenceMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (fenceMatch) {
    text = fenceMatch[1].trim();
  }

  // Try direct parse
  try {
    return JSON.parse(text) as DeepReportData;
  } catch { /* continue */ }

  // Try finding first { to last }
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    try {
      return JSON.parse(text.slice(firstBrace, lastBrace + 1)) as DeepReportData;
    } catch { /* give up */ }
  }

  return null;
}

const SECTION_LABELS = [
  { key: 'who_you_are', label: 'Who You Are' },
  { key: 'strengths_and_shadows', label: 'Strengths & Shadows' },
  { key: 'diet', label: 'Personalized Diet' },
  { key: 'routine', label: 'Daily Routine' },
  { key: 'practices', label: 'Mind & Body Practices' },
  { key: 'thirty_day_plan', label: '30-Day Plan' },
];

export default function DeepResults() {
  const navigate = useNavigate();
  const { locale = 'en', id } = useParams();
  const { user } = useAuthStore();
  const { serverResult: storeResult } = useAssessmentStore();
  const [result, setResult] = useState<ApiResult | null>(null);
  const [rawText, setRawText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [reportData, setReportData] = useState<DeepReportData | null>(null);
  const [parseError, setParseError] = useState(false);
  const [subtypeProfile, setSubtypeProfile] = useState<SubtypeProfile | null>(null);

  // Detect which sections have appeared in the raw stream (for progress UI)
  const streamProgress = useMemo(() => {
    return SECTION_LABELS.map((s) => ({
      ...s,
      detected: rawText.includes(`"${s.key}"`),
    }));
  }, [rawText]);

  // Load result
  useEffect(() => {
    if (storeResult && (id === 'local' || id === storeResult.assessment_id)) {
      setResult(storeResult);
      return;
    }
    try {
      const stored = localStorage.getItem('manas_server_result');
      if (stored) {
        const parsed = JSON.parse(stored) as ApiResult;
        if (id === 'local' || parsed.assessment_id === id) {
          setResult(parsed);
          return;
        }
      }
    } catch { /* ignore */ }
    if (id && id !== 'local') {
      manas.getResult(id).then(setResult).catch(console.error);
    }
  }, [id, storeResult]);

  // Load subtype profile
  useEffect(() => {
    if (!result?.assessment_id) return;
    manas.getSubtypeProfile(result.assessment_id)
      .then((data) => {
        if (data.has_profile && data.profile) {
          setSubtypeProfile(data.profile as SubtypeProfile);
        }
      })
      .catch(() => {});
  }, [result]);

  // Stream deep report
  useEffect(() => {
    if (!result || !user) return;
    const assessmentId = result.assessment_id;
    if (!assessmentId) return;

    // Check cache
    const cacheKey = `deep_${locale}`;
    if (result.ai_insights && result.ai_insights[cacheKey]) {
      const cached = result.ai_insights[cacheKey];
      setRawText(cached);
      const parsed = extractJSON(cached);
      if (parsed) {
        setReportData(parsed);
      } else {
        setParseError(true);
      }
      return;
    }

    setIsStreaming(true);
    let text = '';

    manas.streamDeepInsights(assessmentId, user.id, locale)
      .then(async (response) => {
        if (!response.ok) {
          setRawText('Unable to generate report. Please try again later.');
          setIsStreaming(false);
          setParseError(true);
          return;
        }
        const reader = response.body?.getReader();
        if (!reader) return;
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          text += decoder.decode(value, { stream: true });
          setRawText(text);
        }

        // Parse JSON from streamed text
        const parsed = extractJSON(text);
        if (parsed) {
          setReportData(parsed);
        } else {
          setParseError(true);
        }
        setIsStreaming(false);
      })
      .catch(() => {
        setRawText('Unable to generate report. Please try again later.');
        setIsStreaming(false);
        setParseError(true);
      });
  }, [result, user, locale]);

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcf9f8]">
        <div className="w-8 h-8 border-2 border-[#d4a017] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const sattva = Number(result.sattva_secondary_pct);
  const rajas = Number(result.rajas_secondary_pct);
  const tamas = Number(result.tamas_secondary_pct);

  const WHATSAPP_NUMBER = import.meta.env.VITE_CONSULTATION_WHATSAPP || '919999999999';
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi Dr. Akolkar, I completed the deep assessment on Anantayu. My type is ${result.prakriti_subtype || result.prakriti_type}. I'd like to book a consultation.`
  )}`;

  return (
    <PageLayout hideFooter>
      <div className="min-h-screen bg-[#fcf9f8]">
        {/* Dark header */}
        <div className="sticky top-0 z-30 bg-[#1A1A1A] px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate(`/${locale}/dashboard`)} className="text-white/70 hover:text-white">
            <ArrowLeft size={20} />
          </button>
          <span className="text-white/90 font-medium text-sm">Your Deep Report</span>
          <button
            onClick={() => shareResults(window.location.href, `My Manas Prakriti: ${result.prakriti_type}`, '')}
            className="text-white/70 hover:text-white"
          >
            <Share2 size={18} />
          </button>
        </div>

        {/* Sub-type Hero Card */}
        <div className="bg-[#1A1A1A] px-4 pb-8 pt-4">
          <div className="max-w-lg mx-auto text-center">
            {result.subtype_animal && (
              <div className="inline-flex items-center gap-2 bg-white/10 text-[#d4a017] px-3 py-1 rounded-full text-xs font-medium mb-4">
                {result.subtype_animal}
              </div>
            )}

            <div className="flex justify-center mb-4">
              <GunaChart sattvaPercent={sattva} rajasPercent={rajas} tamasPercent={tamas} size={160} />
            </div>

            <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-heading)] mb-1">
              {result.prakriti_subtype || result.prakriti_type}
            </h1>
            <p className="text-[#d4a017] text-sm mb-4">
              {result.subtype_archetype || result.archetype_title}
            </p>

            <div className="space-y-2 max-w-xs mx-auto">
              <GunaBar guna="sattva" percent={sattva} />
              <GunaBar guna="rajas" percent={rajas} />
              <GunaBar guna="tamas" percent={tamas} />
            </div>

            <div className="mt-4 inline-flex items-center gap-2 bg-white/5 rounded-full px-3 py-1">
              <span className="text-xs text-white/60">Mental Strength</span>
              <span className="text-xs font-semibold text-[#7ba05b] capitalize">{result.sattva_bala}</span>
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Streaming progress indicator */}
          {isStreaming && !reportData && (
            <div className="bg-white rounded-2xl border border-[#e8e4df] p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Loader2 size={18} className="text-[#d4a017] animate-spin" />
                <p className="text-sm font-medium text-[#1c1b1b]">Generating your personalized report...</p>
              </div>
              <div className="space-y-2">
                {streamProgress.map((s) => (
                  <div key={s.key} className="flex items-center gap-2">
                    {s.detected ? (
                      <Check size={14} className="text-[#7ba05b]" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-[#d3c5ae]" />
                    )}
                    <span className={`text-xs ${s.detected ? 'text-[#1c1b1b]' : 'text-[#817662]'}`}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rendered report sections */}
          {reportData && (
            <>
              <WhoYouAreSection data={reportData.who_you_are} subtypeProfile={subtypeProfile} />
              <StrengthsShadowsSection data={reportData.strengths_and_shadows} />
              <DietSection data={reportData.diet} />
              <RoutineSection data={reportData.routine} />
              <PracticesSection data={reportData.practices} />
              <ThirtyDaySection data={reportData.thirty_day_plan} />
            </>
          )}

          {/* Fallback: raw text if JSON parse failed */}
          {parseError && !reportData && rawText && (
            <div className="bg-white rounded-2xl border border-[#e8e4df] p-5">
              <div className="text-sm text-[#4f4634] leading-relaxed whitespace-pre-wrap">{rawText}</div>
            </div>
          )}

          {/* Consultation CTA - after report is done */}
          {reportData && (
            <div className="mt-8">
              <ConsultationCTA prakritiType={result.prakriti_subtype || result.prakriti_type} />
            </div>
          )}
        </div>

        {/* Sticky bottom bar */}
        {reportData && (
          <div className="sticky bottom-0 bg-white/95 backdrop-blur border-t border-[#d3c5ae] px-4 py-3">
            <div className="max-w-2xl mx-auto flex gap-2">
              {user && result.assessment_id && (
                <a
                  href={manas.downloadDeepPdf(result.assessment_id, user.id)}
                  className="py-2.5 px-4 rounded-full border border-[#d3c5ae] text-[#795900] font-medium text-sm flex items-center justify-center gap-1.5"
                >
                  <Download size={14} />
                  PDF
                </a>
              )}
              <button
                onClick={() => shareResults(window.location.href, `My Manas Prakriti: ${result.prakriti_type}`, '')}
                className="flex-1 py-2.5 rounded-full border border-[#d3c5ae] text-[#795900] font-medium text-sm flex items-center justify-center gap-2"
              >
                <Share2 size={16} />
                Share
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 rounded-full bg-[#25D366] text-white font-medium text-sm flex items-center justify-center gap-2"
              >
                <MessageCircle size={16} />
                Consult
              </a>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
