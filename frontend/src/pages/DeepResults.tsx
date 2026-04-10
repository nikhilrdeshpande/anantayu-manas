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
      <div className="min-h-screen flex items-center justify-center bg-[#131313]">
        <div className="w-8 h-8 border-2 border-[#f6be39] border-t-transparent rounded-full animate-spin" />
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
      <div className="min-h-screen bg-[#131313] relative">
        <div className="absolute inset-0 glow-gold pointer-events-none" />

        <div className="relative z-10">
          {/* Sub-type Hero Card */}
          <div className="px-4 pb-12 pt-12">
            <div className="max-w-lg mx-auto text-center">
              {result.subtype_animal && (
                <div className="inline-flex items-center gap-2 bg-[#f6be39]/10 border border-[#f6be39]/20 text-[#f6be39] px-4 py-1.5 rounded-full text-xs uppercase tracking-widest font-bold mb-6">
                  {result.subtype_animal}
                </div>
              )}

              <div className="flex justify-center mb-6">
                <GunaChart sattvaPercent={sattva} rajasPercent={rajas} tamasPercent={tamas} size={180} />
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-[#e5e2e1] font-['Plus_Jakarta_Sans'] mb-2">
                {result.prakriti_subtype || result.prakriti_type}
              </h1>
              <p className="text-[#f6be39] text-base italic mb-6">
                {result.subtype_archetype || result.archetype_title}
              </p>

              <div className="space-y-2 max-w-xs mx-auto">
                <GunaBar guna="sattva" percent={sattva} />
                <GunaBar guna="rajas" percent={rajas} />
                <GunaBar guna="tamas" percent={tamas} />
              </div>

              <div className="mt-5 inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5">
                <span className="text-xs text-[#d3c5ae] uppercase tracking-wider">Mental Strength</span>
                <span className="text-xs font-bold text-[#abd288] capitalize">{result.sattva_bala}</span>
              </div>
            </div>
          </div>

          {/* Report Content */}
          <div className="max-w-2xl mx-auto px-4 py-8 pb-32">
            {/* Streaming progress indicator */}
            {isStreaming && !reportData && (
              <div className="bg-[#2a2a2a] rounded-2xl border border-[#4f4634]/20 p-6 mb-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <Loader2 size={18} className="text-[#f6be39] animate-spin" />
                  <p className="text-sm font-bold text-[#e5e2e1] uppercase tracking-wider">Generating your personalized report...</p>
                </div>
                <div className="space-y-2">
                  {streamProgress.map((s) => (
                    <div key={s.key} className="flex items-center gap-2">
                      {s.detected ? (
                        <Check size={14} className="text-[#abd288]" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-[#4f4634]" />
                      )}
                      <span className={`text-xs ${s.detected ? 'text-[#e5e2e1]' : 'text-[#9b8f7a]'}`}>
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

            {/* Fallback */}
            {parseError && !reportData && rawText && (
              <div className="bg-[#2a2a2a] rounded-2xl border border-[#4f4634]/20 p-5">
                <div className="text-sm text-[#d3c5ae] leading-relaxed whitespace-pre-wrap">{rawText}</div>
              </div>
            )}

            {/* Consultation CTA */}
            {reportData && (
              <div className="mt-10">
                <ConsultationCTA prakritiType={result.prakriti_subtype || result.prakriti_type} />
              </div>
            )}
          </div>

          {/* Sticky bottom bar */}
          {reportData && (
            <div className="fixed bottom-0 left-0 right-0 bg-[#131313]/95 glass-nav border-t border-[#4f4634]/20 px-4 py-4 z-40">
              <div className="max-w-2xl mx-auto flex gap-2">
                {user && result.assessment_id && (
                  <a
                    href={manas.downloadDeepPdf(result.assessment_id, user.id)}
                    className="py-3 px-4 rounded-full border border-[#4f4634]/30 text-[#d3c5ae] font-medium text-sm flex items-center justify-center gap-1.5 hover:border-[#f6be39]/40 hover:text-[#f6be39] transition-colors"
                  >
                    <Download size={14} />
                    PDF
                  </a>
                )}
                <button
                  onClick={() => shareResults(window.location.href, `My Manas Prakriti: ${result.prakriti_type}`, '')}
                  className="flex-1 py-3 rounded-full border border-[#4f4634]/30 text-[#d3c5ae] font-medium text-sm flex items-center justify-center gap-2 hover:border-[#f6be39]/40 hover:text-[#f6be39] transition-colors"
                >
                  <Share2 size={16} />
                  Share
                </button>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 rounded-full bg-[#25D366] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-[#25D366]/30 transition-all"
                >
                  <MessageCircle size={16} />
                  Consult
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
