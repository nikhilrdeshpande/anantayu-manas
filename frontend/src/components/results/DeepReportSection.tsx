import { User, Shield, UtensilsCrossed, Clock, Wind, Target, Star, AlertTriangle, Check, X, Sun, Moon, Sunrise, Sunset } from 'lucide-react';

// ── Types ──

export interface DeepReportData {
  who_you_are?: {
    paragraphs: string[];
    inner_conflict: string;
    at_work: string;
    in_relationships: string;
  };
  strengths_and_shadows?: {
    strengths: { title: string; description: string }[];
    shadows: { title: string; description: string }[];
  };
  diet?: {
    increase: { food: string; reason: string }[];
    reduce: { food: string; reason: string }[];
    meals: { breakfast: string; lunch: string; dinner: string; snack: string };
    note: string;
  };
  routine?: {
    morning: { time: string; practices: string[] };
    midday: { time: string; practices: string[] };
    evening: { time: string; practices: string[] };
    night: { time: string; practices: string[] };
  };
  practices?: {
    pranayama: { name: string; duration: string; technique: string };
    meditation: { name: string; duration: string; technique: string };
    yoga: { name: string; benefit: string }[];
  };
  thirty_day_plan?: {
    week1: { focus: string; actions: string[] };
    week2: { focus: string; actions: string[] };
    week3: { focus: string; actions: string[] };
    week4: { focus: string; actions: string[] };
    expected_outcome: string;
  };
}

export interface SubtypeProfile {
  behavioral_patterns?: string[];
  strengths?: string[];
  shadows?: string[];
  relationship_style?: string;
  work_style?: string;
}

interface SectionHeaderProps {
  icon: typeof User;
  color: string;
  tint: string;
  title: string;
}

function SectionHeader({ icon: Icon, color, tint, title }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: tint }}>
        <Icon size={20} style={{ color }} />
      </div>
      <h2 className="text-lg font-bold text-[#1c1b1b] font-[family-name:var(--font-heading)]">{title}</h2>
    </div>
  );
}

// ── 1. Who You Are ──

export function WhoYouAreSection({ data, subtypeProfile }: { data: DeepReportData['who_you_are']; subtypeProfile?: SubtypeProfile | null }) {
  if (!data) return null;
  return (
    <div className="mb-6">
      <SectionHeader icon={User} color="#d4a017" tint="#fdf6e3" title="Who You Are" />
      <div className="bg-[#1A1A1A] rounded-2xl p-5 border-l-4 border-[#d4a017]">
        {/* Behavioral pattern pills */}
        {subtypeProfile?.behavioral_patterns && subtypeProfile.behavioral_patterns.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {subtypeProfile.behavioral_patterns.slice(0, 3).map((p, i) => (
              <div key={i} className="bg-white/10 text-white/80 text-xs px-3 py-1.5 rounded-lg leading-snug">{p}</div>
            ))}
          </div>
        )}

        {/* Paragraphs */}
        <div className="text-white/85 text-sm leading-relaxed space-y-3">
          {data.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        </div>

        {/* Inner conflict callout */}
        {data.inner_conflict && (
          <div className="mt-4 p-3 rounded-xl bg-[#d4a017]/10 border border-[#d4a017]/20">
            <p className="text-[#d4a017] text-xs font-semibold uppercase tracking-wider mb-1">Your Core Tension</p>
            <p className="text-white/80 text-sm">{data.inner_conflict}</p>
          </div>
        )}

        {/* Work + Relationships */}
        <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.at_work && (
            <div>
              <p className="text-[#d4a017] text-xs font-semibold uppercase tracking-wider mb-1">At Work</p>
              <p className="text-white/60 text-xs leading-relaxed">{data.at_work}</p>
            </div>
          )}
          {data.in_relationships && (
            <div>
              <p className="text-[#d4a017] text-xs font-semibold uppercase tracking-wider mb-1">In Relationships</p>
              <p className="text-white/60 text-xs leading-relaxed">{data.in_relationships}</p>
            </div>
          )}
        </div>

        {/* Profile relationship/work style */}
        {subtypeProfile && (subtypeProfile.relationship_style || subtypeProfile.work_style) && (
          <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4">
            {subtypeProfile.relationship_style && (
              <div>
                <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-1">Relationship Pattern</p>
                <p className="text-white/50 text-xs leading-relaxed">{subtypeProfile.relationship_style}</p>
              </div>
            )}
            {subtypeProfile.work_style && (
              <div>
                <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-1">Work Pattern</p>
                <p className="text-white/50 text-xs leading-relaxed">{subtypeProfile.work_style}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── 2. Strengths & Shadows ──

export function StrengthsShadowsSection({ data }: { data: DeepReportData['strengths_and_shadows'] }) {
  if (!data) return null;
  return (
    <div className="mb-6">
      <SectionHeader icon={Star} color="#7ba05b" tint="#eff5eb" title="Your Strengths & Shadows" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="bg-white rounded-xl border border-[#d3c5ae] p-4">
          <div className="flex items-center gap-2 mb-3">
            <Shield size={16} className="text-[#7ba05b]" />
            <h3 className="text-sm font-semibold text-[#466729]">Strengths</h3>
          </div>
          <div className="space-y-3">
            {data.strengths.map((s, i) => (
              <div key={i} className="flex gap-2">
                <Check size={14} className="text-[#7ba05b] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-[#1c1b1b]">{s.title}</p>
                  <p className="text-xs text-[#4f4634] mt-0.5">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shadows */}
        <div className="bg-white rounded-xl border border-[#d3c5ae] p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={16} className="text-[#5b6b7a]" />
            <h3 className="text-sm font-semibold text-[#50606f]">Shadows</h3>
          </div>
          <div className="space-y-3">
            {data.shadows.map((s, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-[#5b6b7a] mt-0.5 flex-shrink-0">&#x25CF;</span>
                <div>
                  <p className="text-sm font-medium text-[#1c1b1b]">{s.title}</p>
                  <p className="text-xs text-[#4f4634] mt-0.5">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 3. Diet ──

export function DietSection({ data }: { data: DeepReportData['diet'] }) {
  if (!data) return null;
  return (
    <div className="mb-6">
      <SectionHeader icon={UtensilsCrossed} color="#7ba05b" tint="#eff5eb" title="Personalized Diet (Ahara)" />
      <div className="bg-white rounded-2xl border border-[#d3c5ae] overflow-hidden">
        {/* Increase */}
        <div className="p-4">
          <h3 className="text-xs font-semibold text-[#7ba05b] uppercase tracking-wider mb-3">Foods to Increase</h3>
          <div className="space-y-2">
            {data.increase.map((item, i) => (
              <div key={i} className="flex gap-2 text-sm">
                <Check size={14} className="text-[#7ba05b] mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium text-[#1c1b1b]">{item.food}</span>
                  <span className="text-[#817662]"> - {item.reason}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-[#f0eded]" />

        {/* Reduce */}
        <div className="p-4">
          <h3 className="text-xs font-semibold text-[#c44] uppercase tracking-wider mb-3">Foods to Reduce</h3>
          <div className="space-y-2">
            {data.reduce.map((item, i) => (
              <div key={i} className="flex gap-2 text-sm">
                <X size={14} className="text-[#c44] mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium text-[#1c1b1b]">{item.food}</span>
                  <span className="text-[#817662]"> - {item.reason}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-[#f0eded]" />

        {/* Sample Meals */}
        <div className="p-4">
          <h3 className="text-xs font-semibold text-[#795900] uppercase tracking-wider mb-3">Sample Meals</h3>
          <div className="grid grid-cols-2 gap-3">
            {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((meal) => (
              <div key={meal} className="bg-[#fdf6e3] rounded-lg p-3">
                <p className="text-xs font-semibold text-[#795900] uppercase mb-1">{meal}</p>
                <p className="text-xs text-[#4f4634]">{data.meals[meal]}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Note */}
        {data.note && (
          <>
            <div className="border-t border-[#f0eded]" />
            <div className="p-4 bg-[#f6f3f2]">
              <p className="text-xs text-[#4f4634] italic">{data.note}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── 4. Routine - Timeline ──

const ROUTINE_SLOTS = [
  { key: 'morning' as const, label: 'Morning', icon: Sunrise, color: '#d4a017' },
  { key: 'midday' as const, label: 'Midday', icon: Sun, color: '#d4a017' },
  { key: 'evening' as const, label: 'Evening', icon: Sunset, color: '#5b6b7a' },
  { key: 'night' as const, label: 'Night', icon: Moon, color: '#5b6b7a' },
];

export function RoutineSection({ data }: { data: DeepReportData['routine'] }) {
  if (!data) return null;
  return (
    <div className="mb-6">
      <SectionHeader icon={Clock} color="#d4a017" tint="#fdf6e3" title="Daily Routine (Dinacharya)" />
      <div className="relative pl-6 border-l-2 border-[#d4a017]/30 space-y-4">
        {ROUTINE_SLOTS.map((slot) => {
          const block = data[slot.key];
          if (!block) return null;
          const SlotIcon = slot.icon;
          return (
            <div key={slot.key} className="relative">
              <div className="absolute -left-[31px] w-4 h-4 rounded-full bg-[#fdf6e3] border-2 border-[#d4a017] top-1" />
              <div className="bg-white rounded-xl border border-[#e8e4df] p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <SlotIcon size={14} style={{ color: slot.color }} />
                    <h3 className="text-sm font-semibold text-[#1c1b1b]">{slot.label}</h3>
                  </div>
                  <span className="text-xs text-[#817662] bg-[#f6f3f2] px-2 py-0.5 rounded">{block.time}</span>
                </div>
                <div className="space-y-1">
                  {block.practices.map((p, i) => (
                    <div key={i} className="flex gap-2 text-sm text-[#4f4634]">
                      <span className="text-[#d4a017]">&#x2022;</span>
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── 5. Practices - Cards ──

export function PracticesSection({ data }: { data: DeepReportData['practices'] }) {
  if (!data) return null;
  return (
    <div className="mb-6">
      <SectionHeader icon={Wind} color="#466729" tint="#eff5eb" title="Mind & Body Practices" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Pranayama */}
        {data.pranayama && (
          <div className="bg-white rounded-xl border border-[#d3c5ae] p-4">
            <div className="w-8 h-8 rounded-lg bg-[#eff5eb] flex items-center justify-center mb-3">
              <Wind size={16} className="text-[#466729]" />
            </div>
            <h3 className="text-sm font-semibold text-[#1c1b1b] mb-1">{data.pranayama.name}</h3>
            <p className="text-xs text-[#d4a017] font-medium mb-2">{data.pranayama.duration}</p>
            <p className="text-xs text-[#4f4634] leading-relaxed">{data.pranayama.technique}</p>
          </div>
        )}

        {/* Meditation */}
        {data.meditation && (
          <div className="bg-white rounded-xl border border-[#d3c5ae] p-4">
            <div className="w-8 h-8 rounded-lg bg-[#fdf6e3] flex items-center justify-center mb-3">
              <Sun size={16} className="text-[#d4a017]" />
            </div>
            <h3 className="text-sm font-semibold text-[#1c1b1b] mb-1">{data.meditation.name}</h3>
            <p className="text-xs text-[#d4a017] font-medium mb-2">{data.meditation.duration}</p>
            <p className="text-xs text-[#4f4634] leading-relaxed">{data.meditation.technique}</p>
          </div>
        )}

        {/* Yoga */}
        {data.yoga && data.yoga.length > 0 && (
          <div className="bg-white rounded-xl border border-[#d3c5ae] p-4">
            <div className="w-8 h-8 rounded-lg bg-[#eff5eb] flex items-center justify-center mb-3">
              <User size={16} className="text-[#466729]" />
            </div>
            <h3 className="text-sm font-semibold text-[#1c1b1b] mb-2">Yoga Asanas</h3>
            <div className="space-y-1.5">
              {data.yoga.map((a, i) => (
                <div key={i} className="text-xs">
                  <span className="font-medium text-[#1c1b1b]">{a.name}</span>
                  <span className="text-[#817662]"> - {a.benefit}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── 6. 30-Day Plan - Week Grid ──

const WEEK_COLORS = ['#d4a017', '#7ba05b', '#466729', '#795900'];

export function ThirtyDaySection({ data }: { data: DeepReportData['thirty_day_plan'] }) {
  if (!data) return null;

  const weeks = [
    { key: 'week1' as const, label: 'Week 1' },
    { key: 'week2' as const, label: 'Week 2' },
    { key: 'week3' as const, label: 'Week 3' },
    { key: 'week4' as const, label: 'Week 4' },
  ];

  return (
    <div className="mb-6">
      <SectionHeader icon={Target} color="#795900" tint="#fdf6e3" title="Your 30-Day Transformation" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {weeks.map((w, i) => {
          const weekData = data[w.key];
          if (!weekData) return null;
          return (
            <div key={w.key} className="bg-white rounded-xl border border-[#d3c5ae] p-4 relative overflow-hidden">
              <div className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: WEEK_COLORS[i] + '15' }}>
                <span className="text-xs font-bold" style={{ color: WEEK_COLORS[i] }}>{i + 1}</span>
              </div>
              <h3 className="text-sm font-semibold text-[#1c1b1b] mb-1 pr-8">{w.label}: {weekData.focus}</h3>
              <div className="space-y-1 mt-2">
                {weekData.actions.map((a, j) => (
                  <div key={j} className="flex gap-2 text-xs text-[#4f4634]">
                    <Target size={10} className="text-[#d4a017] mt-0.5 flex-shrink-0" />
                    <span>{a}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Expected outcome */}
      {data.expected_outcome && (
        <div className="mt-3 p-4 bg-[#fdf6e3] rounded-xl border border-[#d4a017]/20">
          <p className="text-xs font-semibold text-[#795900] uppercase tracking-wider mb-1">After 30 Days</p>
          <p className="text-sm text-[#4f4634]">{data.expected_outcome}</p>
        </div>
      )}
    </div>
  );
}
