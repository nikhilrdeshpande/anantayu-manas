import { Check, X } from 'lucide-react';

const ROWS = [
  { feature: 'Based on', other: '1940s personality theory', ours: '3,000-year-old Ayurvedic text' },
  { feature: 'Validated by', other: 'Corporate HR departments', ours: 'PhD thesis, University of Mumbai' },
  { feature: 'Result types', other: '16 letter combinations', ours: '7 types (16 deep sub-types)' },
  { feature: 'Tells you', other: 'What box you fit in', ours: 'How to eat, sleep, and live better' },
  { feature: 'Diet plan', other: null, ours: 'Personalized to your type + preference' },
  { feature: 'Daily routine', other: null, ours: 'Hour-by-hour, adapted to your work' },
  { feature: 'Yoga & meditation', other: null, ours: 'Prescribed techniques with duration' },
  { feature: '30-day plan', other: null, ours: 'Progressive week-by-week actions' },
];

export function ComparisonSection() {
  return (
    <section className="py-16 md:py-20 px-6 bg-[#fcf9f8]">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#d4a017] text-center mb-3">
          Why This Is Different
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-[#1c1b1b] font-[family-name:var(--font-heading)] text-center mb-3">
          You've Done the Personality Tests.<br />Now Try the One That's Actually Been Tested.
        </h2>
        <p className="text-[#4f4634] text-sm text-center mb-10 max-w-lg mx-auto">
          MBTI and 16Personalities are fun. But they don't tell you what to eat for breakfast
          or which pranayama to practice. Manas Prakriti does.
        </p>

        <div className="bg-white rounded-2xl border border-[#d3c5ae] overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-3 bg-[#f6f3f2] px-4 py-3">
            <span className="text-xs font-semibold text-[#4f4634]">Feature</span>
            <span className="text-xs font-semibold text-[#817662] text-center">MBTI / 16P</span>
            <span className="text-xs font-semibold text-[#d4a017] text-center">Manas Prakriti</span>
          </div>

          {/* Rows */}
          {ROWS.map((row, i) => (
            <div key={i} className="grid grid-cols-3 px-4 py-3 border-t border-[#f0eded] items-center">
              <span className="text-xs text-[#1c1b1b] font-medium">{row.feature}</span>
              <span className="text-xs text-[#817662] text-center">
                {row.other === null ? (
                  <X size={14} className="text-[#d3c5ae] mx-auto" />
                ) : (
                  row.other
                )}
              </span>
              <span className="text-xs text-[#1c1b1b] text-center font-medium flex items-center justify-center gap-1">
                <Check size={12} className="text-[#7ba05b]" />
                {row.ours}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
