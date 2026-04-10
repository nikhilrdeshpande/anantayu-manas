import { CheckCircle2 } from 'lucide-react';

const ROWS = [
  { feature: 'Research Foundation', other: 'Modern psychology theory', ours: 'Clinical PhD Validation' },
  { feature: 'Historical Depth', other: '70-100 years', ours: '3,000+ Years' },
  { feature: 'Result Specificity', other: '16 letter combos', ours: '7 types + 16 sub-types' },
  { feature: 'Dietary Guidance', other: 'None', ours: 'Specific foods for your mind' },
  { feature: 'Daily Routine', other: 'None', ours: 'Hour-by-hour schedule' },
  { feature: 'Yoga & Meditation', other: 'None', ours: 'Prescribed techniques' },
  { feature: '30-Day Plan', other: 'None', ours: 'Week-by-week actions' },
  { feature: 'Bio-Physical Link', other: 'Limited', ours: 'Deep mind-body integration' },
];

export function ComparisonSection() {
  return (
    <section className="py-24 md:py-28 bg-[#fcf9f8] text-[#1c1b1b]">
      <div className="container mx-auto px-6 md:px-8 max-w-6xl">
        <h2 className="text-4xl lg:text-5xl font-bold mb-16 text-center max-w-4xl mx-auto leading-tight font-['Plus_Jakarta_Sans']">
          You've Done the Personality Tests.<br />
          Now Try the One That's <span className="text-[#d4a017]">Actually Been Tested</span>.
        </h2>

        <div className="overflow-x-auto rounded-2xl shadow-lg">
          <table className="w-full text-left bg-white border-collapse">
            <thead>
              <tr className="bg-[#1c1b1b] text-[#e5e2e1]">
                <th className="p-6 font-bold font-['Plus_Jakarta_Sans']">Feature</th>
                <th className="p-6 font-bold font-['Plus_Jakarta_Sans']">MBTI / 16Personalities</th>
                <th className="p-6 font-bold font-['Plus_Jakarta_Sans'] text-[#f6be39]">Manas Prakriti</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c1b1b]/5">
              {ROWS.map((row, i) => (
                <tr key={i} className="hover:bg-[#fdf6e3]/30 transition-colors">
                  <td className="p-6 font-medium text-[#1c1b1b]">{row.feature}</td>
                  <td className="p-6 text-[#1c1b1b]/50">{row.other}</td>
                  <td className="p-6">
                    <span className="flex items-center gap-2 text-[#1c1b1b]">
                      <CheckCircle2 size={18} className="text-[#7ba05b] flex-shrink-0" />
                      {row.ours}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
