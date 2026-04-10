import { GraduationCap } from 'lucide-react';

export function ResearchCredibility() {
  return (
    <section className="py-24 md:py-28 bg-white text-[#1c1b1b]">
      <div className="container mx-auto px-6 md:px-8 max-w-6xl">
        <div className="bg-[#1c1b1b] text-[#e5e2e1] rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl">
          {/* Left visual side - decorative */}
          <div className="md:w-2/5 relative bg-gradient-to-br from-[#1c1b1b] via-[#20201f] to-[#131313] flex items-center justify-center p-12 min-h-[280px]">
            <div className="absolute inset-0 glow-gold opacity-50" />
            <div className="relative z-10 text-center">
              <div className="w-28 h-28 rounded-full bg-[#f6be39]/10 border-2 border-[#f6be39]/20 flex items-center justify-center mx-auto mb-4">
                <GraduationCap size={48} className="text-[#f6be39]" />
              </div>
              <p className="text-[#f6be39] text-xs uppercase tracking-widest font-bold">
                PhD Research
              </p>
              <p className="text-white/40 text-xs mt-2">University of Mumbai</p>
            </div>
          </div>

          {/* Right content side */}
          <div className="md:w-3/5 p-10 md:p-12 flex flex-col justify-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#f6be39]/20 rounded-full flex items-center justify-center flex-shrink-0">
                <GraduationCap size={20} className="text-[#f6be39]" />
              </div>
              <div>
                <h3 className="text-2xl font-bold font-['Plus_Jakarta_Sans']">Dr. Prasad Akolkar</h3>
                <p className="text-[#f6be39] text-xs uppercase tracking-widest font-bold mt-1">
                  PhD, Ayurvedic Psychology
                </p>
              </div>
            </div>

            <p className="text-base lg:text-lg leading-relaxed text-[#d3c5ae]">
              "This assessment isn't a casual quiz; it's the culmination of years of clinical research
              and a PhD thesis defended at the University of Mumbai. We've translated the complex Sanskrit
              parameters of the <em>Ashtanga Hridayam</em> into a precise, validated psychometric instrument."
            </p>

            <div className="flex flex-wrap gap-6 items-center pt-4">
              {['UNIVERSITY OF MUMBAI', 'ASHTANGA HRIDAYAM', '16 SUB-TYPES', '47 BHAVAS'].map((badge) => (
                <span
                  key={badge}
                  className="text-xs font-bold tracking-wider text-white/40 hover:text-[#f6be39] transition-colors cursor-default"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
