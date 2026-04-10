import { Link, useParams } from 'react-router-dom';
import { Quote, ArrowRight } from 'lucide-react';

export function DeepAssessmentTeaser() {
  const { locale = 'en' } = useParams();

  return (
    <section className="py-24 md:py-28 bg-[#131313] text-[#e5e2e1] overflow-hidden relative">
      {/* Center radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] glow-gold opacity-30 pointer-events-none" />

      <div className="container mx-auto px-6 md:px-8 max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 font-['Plus_Jakarta_Sans']">
            Go Deeper: 16 Sub-types,<br />One Personalized Plan
          </h2>
          <p className="text-[#d3c5ae] text-lg max-w-2xl mx-auto">
            Our Premium Assessment explores the nuanced layers of your mental landscape.
          </p>
        </div>

        {/* Sample Profile Card */}
        <div className="max-w-3xl mx-auto bg-[#2a2a2a] rounded-3xl p-8 md:p-10 border border-[#4f4634]/20 shadow-2xl">
          <div className="flex flex-col md:flex-row gap-8 md:gap-10">
            {/* Left: Mock profile data */}
            <div className="md:w-1/2 space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-xs uppercase tracking-widest text-[#f6be39] font-bold">Sample Profile</span>
                <span className="text-xs text-[#d3c5ae]/60 font-mono">ID: 98231-SA</span>
              </div>
              <div className="space-y-2">
                <h4 className="text-3xl font-bold font-['Plus_Jakarta_Sans']">Sattva-Rajas</h4>
                <p className="text-sm text-[#abd288] bg-[#2f4f13]/40 px-3 py-1 rounded-full inline-block">
                  Balanced Dynamic
                </p>
              </div>
              <div className="space-y-4 pt-4">
                {[
                  { label: 'Clarity (Sattva)', pct: 65, color: '#abd288' },
                  { label: 'Action (Rajas)', pct: 30, color: '#f6be39' },
                  { label: 'Rest (Tamas)', pct: 5, color: '#9b8f7a' },
                ].map((bar, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#d3c5ae]">{bar.label}</span>
                      <span className="text-[#e5e2e1] font-medium">{bar.pct}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#0e0e0e] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${bar.pct}%`, backgroundColor: bar.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Quote insight card */}
            <div className="md:w-1/2 bg-[#353535] p-8 rounded-2xl border border-[#4f4634]/20 flex flex-col justify-center">
              <Quote size={32} className="text-[#f6be39]/40 mb-4" />
              <p className="italic text-base lg:text-lg text-[#d3c5ae] leading-relaxed">
                "You possess a mind like clear water that is beginning to ripple. You have
                the vision to see the depth, and the energy to reach the shore."
              </p>
              <div className="mt-6 pt-6 border-t border-[#4f4634]/20 text-xs uppercase tracking-widest text-[#f6be39] font-bold">
                The Mirror Insight
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
          <Link
            to={`/${locale}/assessment/intro`}
            className="inline-flex items-center gap-2 text-[#f6be39] text-sm font-semibold hover:underline"
          >
            Start with the free assessment first <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
