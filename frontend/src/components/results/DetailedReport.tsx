import {
  Zap, Sparkles, Brain, Heart, Shield, Sprout, Globe,
  Sun, Moon, UtensilsCrossed, BookOpen, Wind, Clock,
  Anchor, Rocket, Users, Target, Timer, RefreshCw,
  Flame, Mountain, Share2, ChevronRight,
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import type { ScoringResult } from '../../types';
import type { PrakritiInfo } from '../../lib/prakriti-data';

// Icon lookup
const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Zap, Sparkles, Brain, Heart, Shield, Sprout, Globe,
  Sun, Moon, UtensilsCrossed, BookOpen, Wind, Clock,
  Anchor, Rocket, Users, Target, Timer, RefreshCw,
  Flame, Mountain,
};

function getIcon(name: string) {
  return ICON_MAP[name] || Sparkles;
}

interface DetailedReportProps {
  result: ScoringResult;
  prakritiInfo: PrakritiInfo;
}

export function DetailedReport({ result, prakritiInfo }: DetailedReportProps) {
  const { locale = 'en' } = useParams<{ locale: string }>();
  const sattva = result.sattvaSecondaryPct;
  const rajas = result.rajasSecondaryPct;
  const tamas = result.tamasSecondaryPct;

  // Normalize for SVG donut
  const total = sattva + rajas + tamas;
  const sNorm = total > 0 ? (sattva / total) * 100 : 33.33;
  const rNorm = total > 0 ? (rajas / total) * 100 : 33.33;

  // SVG donut segments
  const circumference = 2 * Math.PI * 40;
  const sLen = (sNorm / 100) * circumference;
  const rLen = (rNorm / 100) * circumference;
  const tLen = circumference - sLen - rLen;

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-8">
      {/* ── Hero Section ── */}
      <div
        className="rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center gap-8"
        style={{ backgroundColor: '#313030' }}
      >
        <div className="flex-1 flex flex-col gap-4">
          <span
            className="inline-block text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded-full w-fit font-medium"
            style={{
              backgroundColor: 'rgba(212,160,23,0.15)',
              color: '#d4a017',
              border: '1px solid rgba(212,160,23,0.3)',
            }}
          >
            Current Constitution
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            {result.prakritiType}
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
            {prakritiInfo.description}
          </p>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `My Manas Prakriti: ${result.prakritiType}`,
                  text: prakritiInfo.description,
                  url: window.location.href,
                });
              }
            }}
            className="flex items-center gap-2 w-fit px-5 py-2.5 rounded-lg text-sm font-semibold text-white mt-2 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #d4a017 0%, #b8860b 100%)',
            }}
          >
            <Share2 size={16} />
            Share Report
          </button>
        </div>

        {/* SVG Donut */}
        <div className="shrink-0">
          <svg width="140" height="140" viewBox="0 0 100 100">
            {/* Sattva */}
            <circle
              cx="50" cy="50" r="40"
              fill="none"
              stroke="#466729"
              strokeWidth="12"
              strokeDasharray={`${sLen} ${circumference - sLen}`}
              strokeDashoffset="0"
              transform="rotate(-90 50 50)"
            />
            {/* Rajas */}
            <circle
              cx="50" cy="50" r="40"
              fill="none"
              stroke="#d4a017"
              strokeWidth="12"
              strokeDasharray={`${rLen} ${circumference - rLen}`}
              strokeDashoffset={`${-sLen}`}
              transform="rotate(-90 50 50)"
            />
            {/* Tamas */}
            <circle
              cx="50" cy="50" r="40"
              fill="none"
              stroke="#50606f"
              strokeWidth="12"
              strokeDasharray={`${tLen} ${circumference - tLen}`}
              strokeDashoffset={`${-(sLen + rLen)}`}
              transform="rotate(-90 50 50)"
            />
            <text x="50" y="47" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
              {Math.round(sattva)}%
            </text>
            <text x="50" y="60" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="7" letterSpacing="0.1em">
              SATTVA
            </text>
          </svg>
        </div>
      </div>

      {/* ── What is X Prakriti? ── */}
      <div className="rounded-2xl p-8 bg-white shadow-sm">
        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--on-surface)' }}>
          What is {result.prakritiType} Prakriti?
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--on-surface-variant)' }}>
          {prakritiInfo.whatIs}
        </p>
      </div>

      {/* ── Strengths & Growth Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 rounded-full" style={{ backgroundColor: '#d4a017' }} />
            <h3 className="text-lg font-bold" style={{ color: 'var(--on-surface)' }}>
              Your Strengths
            </h3>
          </div>
          {prakritiInfo.strengths.map((s) => {
            const Icon = getIcon(s.icon);
            return (
              <div
                key={s.title}
                className="rounded-xl p-5 bg-white shadow-sm flex gap-4"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: 'rgba(212,160,23,0.1)' }}
                >
                  <Icon size={20} className="text-[#d4a017]" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-1" style={{ color: 'var(--on-surface)' }}>
                    {s.title}
                  </h4>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--on-surface-variant)' }}>
                    {s.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Growth Areas */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 rounded-full" style={{ backgroundColor: '#50606f' }} />
            <h3 className="text-lg font-bold" style={{ color: 'var(--on-surface)' }}>
              Areas for Growth
            </h3>
          </div>
          {prakritiInfo.growthAreas.map((g) => {
            const Icon = getIcon(g.icon);
            return (
              <div
                key={g.title}
                className="rounded-xl p-5 bg-white shadow-sm flex gap-4"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: 'rgba(80,96,111,0.1)' }}
                >
                  <Icon size={20} className="text-[#50606f]" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-1" style={{ color: 'var(--on-surface)' }}>
                    {g.title}
                  </h4>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--on-surface-variant)' }}>
                    {g.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Daily Practices ── */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-bold" style={{ color: 'var(--on-surface)' }}>
          Daily Practices
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {prakritiInfo.dailyPractices.map((p) => {
            const Icon = getIcon(p.icon);
            return (
              <div
                key={p.title}
                className="rounded-xl p-5 flex flex-col gap-3"
                style={{
                  backgroundColor: 'rgba(212,160,23,0.06)',
                  border: '1px solid rgba(212,160,23,0.15)',
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(212,160,23,0.12)' }}
                >
                  <Icon size={20} className="text-[#d4a017]" />
                </div>
                <h4 className="text-sm font-semibold" style={{ color: 'var(--on-surface)' }}>
                  {p.title}
                </h4>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--on-surface-variant)' }}>
                  {p.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── AI Insight ── */}
      <div
        className="rounded-xl p-6"
        style={{ backgroundColor: '#f6f3f2' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={16} className="text-[#d4a017]" />
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#d4a017' }}>
            AI Insight
          </span>
        </div>
        <blockquote
          className="text-sm italic leading-relaxed pl-4"
          style={{
            color: 'var(--on-surface-variant)',
            borderLeft: '4px solid #d4a017',
          }}
        >
          {prakritiInfo.aiInsight}
        </blockquote>
      </div>

      {/* ── Bottom links ── */}
      <div className="text-center pt-4 space-y-2">
        <a
          href={`/${locale}/science`}
          className="text-xs hover:underline block"
          style={{ color: 'var(--on-surface-variant)' }}
        >
          Learn about the science behind this assessment
        </a>
      </div>
    </div>
  );
}
