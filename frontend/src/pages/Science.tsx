import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Leaf, Zap, Mountain, Brain, BookOpen, GraduationCap, Shield } from 'lucide-react';
import { PageLayout } from '../components/layout/PageLayout';

const GUNAS = [
  {
    name: 'Sattva',
    subtitle: 'Purity & Clarity',
    color: '#7ba05b',
    tint: '#eff5eb',
    dark: '#466729',
    icon: Leaf,
    description: 'Sattva represents purity, harmony, and balance of mind. It is associated with wisdom, compassion, truthfulness, and inner peace.',
    traits: ['Compassion (Ahimsa)', 'Truthfulness (Satya)', 'Patience (Dhairya)', 'Intellect (Medha)', 'Forgiveness (Kshama)', 'Selfless Service (Tyaga)'],
  },
  {
    name: 'Rajas',
    subtitle: 'Energy & Action',
    color: '#d4a017',
    tint: '#fdf6e3',
    dark: '#795900',
    icon: Zap,
    description: 'Rajas represents activity, passion, and ambition. It drives desire, competitiveness, restlessness, and the pursuit of achievement.',
    traits: ['Impatience (Amarsha)', 'Pride (Mana)', 'Competitiveness (Spardhā)', 'Anger (Krodha)', 'Ego (Ahamkara)', 'Stubbornness (Mada)'],
  },
  {
    name: 'Tamas',
    subtitle: 'Stability & Grounding',
    color: '#5b6b7a',
    tint: '#f0f2f4',
    dark: '#3a4a58',
    icon: Mountain,
    description: 'Tamas represents inertia, stability, and grounding. It manifests as resistance to change, preference for routine, and the need for rest.',
    traits: ['Excess Sleep (Nidra)', 'Laziness (Alasya)', 'Forgetfulness (Smriti Nasha)', 'Fear of Change (Bhaya)', 'Indifference (Udaseenata)'],
  },
];

const SUBTYPES = [
  { name: 'Brahma', archetype: 'The Creator', animal: 'Swan', guna: 'sattva' },
  { name: 'Mahendra', archetype: 'The Sovereign', animal: 'Lion', guna: 'sattva' },
  { name: 'Varuna', archetype: 'The Protector', animal: 'Elephant', guna: 'sattva' },
  { name: 'Kaubera', archetype: 'The Generous One', animal: 'Cow', guna: 'sattva' },
  { name: 'Gandharva', archetype: 'The Artist', animal: 'Peacock', guna: 'sattva' },
  { name: 'Yamya', archetype: 'The Just One', animal: 'Bull', guna: 'sattva' },
  { name: 'Rishi', archetype: 'The Sage', animal: 'Deer', guna: 'sattva' },
  { name: 'Asura', archetype: 'The Titan', animal: 'Tiger', guna: 'rajas' },
  { name: 'Sarpa', archetype: 'The Serpent', animal: 'Cobra', guna: 'rajas' },
  { name: 'Shakuna', archetype: 'The Hunter', animal: 'Hawk', guna: 'rajas' },
  { name: 'Rakshasa', archetype: 'The Fierce One', animal: 'Wolf', guna: 'rajas' },
  { name: 'Paishaca', archetype: 'The Indulgent', animal: 'Jackal', guna: 'rajas' },
  { name: 'Preta', archetype: 'The Seeker', animal: 'Crow', guna: 'rajas' },
  { name: 'Pashu', archetype: 'The Steady One', animal: 'Buffalo', guna: 'tamas' },
  { name: 'Matsya', archetype: 'The Hidden One', animal: 'Fish', guna: 'tamas' },
  { name: 'Vanaspatya', archetype: 'The Rooted One', animal: 'Tortoise', guna: 'tamas' },
];

const GUNA_COLORS: Record<string, string> = {
  sattva: '#7ba05b',
  rajas: '#d4a017',
  tamas: '#5b6b7a',
};

export default function Science() {
  const { locale = 'en' } = useParams();

  return (
    <PageLayout>
      {/* Hero */}
      <section className="bg-[#131313] py-20 md:py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 glow-gold pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#f6be39]/10 border border-[#f6be39]/20 text-[#f6be39] px-4 py-2 rounded-full text-xs uppercase tracking-widest font-bold mb-6">
            <BookOpen size={12} />
            Research Foundation
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#e5e2e1] font-['Plus_Jakarta_Sans'] mb-4">
            The Science Behind<br /><span className="text-[#f6be39]">Manas Prakriti</span>
          </h1>
          <p className="text-[#d3c5ae] text-base leading-relaxed max-w-xl mx-auto">
            Our assessment is grounded in a PhD thesis on Ayurvedic psychology, mapping ancient
            wisdom from the Ashtanga Hridayam to a modern, validated classification system.
          </p>
        </div>
      </section>

      {/* Research Foundation */}
      <section className="py-20 px-6 bg-[#1c1b1b]">
        <div className="max-w-3xl mx-auto">
          <div className="bg-[#2a2a2a] rounded-2xl border border-[#4f4634]/20 p-6 md:p-8 flex flex-col md:flex-row gap-6 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-[#f6be39]/10 border border-[#f6be39]/20 flex items-center justify-center flex-shrink-0">
              <GraduationCap size={28} className="text-[#f6be39]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#e5e2e1] font-['Plus_Jakarta_Sans'] mb-2">
                Research by Dr. Prasad Akolkar
              </h2>
              <p className="text-[#d3c5ae] text-sm leading-relaxed mb-3">
                The Manas Prakriti assessment is based on <em>"Manasa Vijnana"</em> - a doctoral thesis
                by Dr. Akolkar Prasad Pramod at the University of Mumbai (2019). The research references
                the classical Ayurvedic text <strong className="text-[#e5e2e1]">Ashtanga Hridayam of Vagbhata</strong>, one of the
                foundational works of Ayurvedic medicine.
              </p>
              <p className="text-[#d3c5ae] text-sm leading-relaxed">
                The thesis establishes a systematic framework for classifying mental constitution
                based on the three Gunas - Sattva, Rajas, and Tamas - and identifies
                16 distinct personality sub-types, each mapped to behavioral patterns (Svabhava) and
                mythological archetypes from ancient Indian texts.
              </p>
              <div className="flex items-center gap-4 mt-4 text-sm">
                <Link to={`/${locale}/about`} className="text-[#f6be39] font-bold hover:underline">Learn more about us</Link>
                <span className="text-[#4f4634]">|</span>
                <Link to={`/${locale}/faq`} className="text-[#f6be39] font-bold hover:underline">Read FAQ</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three Gunas */}
      <section className="py-20 px-6 bg-[#131313]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#e5e2e1] font-['Plus_Jakarta_Sans'] text-center mb-3">
            The Three Gunas
          </h2>
          <p className="text-[#d3c5ae] text-center text-sm mb-12 max-w-xl mx-auto">
            According to Ayurveda, every mind is a unique blend of three fundamental qualities.
            Your specific balance determines your mental constitution.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {GUNAS.map((guna) => {
              const Icon = guna.icon;
              return (
                <div
                  key={guna.name}
                  className="bg-[#2a2a2a] rounded-2xl p-6 border-2 transition-all hover:-translate-y-1 shadow-xl"
                  style={{ borderColor: `${guna.color}40` }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 border"
                    style={{ backgroundColor: `${guna.color}1a`, borderColor: `${guna.color}33` }}
                  >
                    <Icon size={24} style={{ color: guna.color }} />
                  </div>
                  <h3 className="text-2xl font-bold mb-1 font-['Plus_Jakarta_Sans']" style={{ color: guna.color }}>
                    {guna.name}
                  </h3>
                  <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: guna.color }}>
                    {guna.subtitle}
                  </p>
                  <p className="text-sm text-[#d3c5ae] leading-relaxed mb-4">
                    {guna.description}
                  </p>
                  <div className="space-y-1.5 pt-3 border-t border-white/5">
                    {guna.traits.map((trait, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-[#9b8f7a]">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: guna.color }} />
                        {trait}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-[#1c1b1b]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#e5e2e1] font-['Plus_Jakarta_Sans'] text-center mb-12">
            How the Assessment Works
          </h2>

          <div className="space-y-6">
            {[
              { num: '1', title: 'Answer questions about your natural tendencies', desc: 'Each question maps to a specific Bhava (behavioral quality) under one of the three Gunas. The quick assessment covers 25 questions; the deep assessment covers 80.' },
              { num: '2', title: 'Thesis-validated scoring algorithm', desc: 'Your answers are scored using the exact methodology from the PhD thesis. "Sometimes" answers are converted using different ratios for each Guna - Rajas (the active guna) gets a higher YES conversion than Sattva and Tamas.' },
              { num: '3', title: 'Classification into 7 or 16 types', desc: 'The quick assessment classifies you into 1 of 7 Prakriti types. The deep assessment further narrows this to 1 of 16 specific sub-types, each with a mythological archetype and animal symbol.' },
            ].map((step) => (
              <div key={step.num} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#f6be39]/10 border border-[#f6be39]/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-[#f6be39]">{step.num}</span>
                </div>
                <div>
                  <h3 className="font-bold text-[#e5e2e1] mb-1">{step.title}</h3>
                  <p className="text-sm text-[#d3c5ae] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-[#7ba05b]/10 border border-[#7ba05b]/20 flex items-center justify-center flex-shrink-0">
                <Shield size={18} className="text-[#abd288]" />
              </div>
              <div>
                <h3 className="font-bold text-[#e5e2e1] mb-1">Sattva Bala - Mental Strength</h3>
                <p className="text-sm text-[#d3c5ae] leading-relaxed">
                  Your Sattva percentage determines your mental strength grade:
                  <strong className="text-[#abd288]"> Pravara</strong> (high, 66%+),
                  <strong className="text-[#f6be39]"> Madhya</strong> (moderate, 33-66%), or
                  <strong className="text-[#9b8f7a]"> Avara</strong> (developing, below 33%).
                  This isn't a judgment - it's a starting point for growth.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 16 Sub-types */}
      <section className="py-20 px-6 bg-[#131313] relative">
        <div className="absolute inset-0 glow-gold pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#e5e2e1] font-['Plus_Jakarta_Sans'] text-center mb-3">
            16 Personality Sub-types
          </h2>
          <p className="text-[#d3c5ae] text-sm text-center mb-12 max-w-xl mx-auto">
            The deep assessment classifies you into one of these specific sub-types,
            each rooted in the Ashtanga Hridayam classification system.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {SUBTYPES.map((st) => (
              <div
                key={st.name}
                className="bg-[#2a2a2a] rounded-xl p-4 border border-[#4f4634]/20 hover:border-[#f6be39]/30 transition-colors"
              >
                <div
                  className="w-2 h-2 rounded-full mb-2"
                  style={{ backgroundColor: GUNA_COLORS[st.guna] }}
                />
                <p className="text-[#e5e2e1] font-bold text-sm">{st.name} Kaya</p>
                <p className="text-[#f6be39] text-xs">{st.archetype}</p>
                <p className="text-[#9b8f7a] text-xs mt-1">{st.animal}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 px-6 bg-[#1c1b1b]">
        <div className="max-w-lg mx-auto text-center">
          <Brain size={40} className="text-[#f6be39] mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-[#e5e2e1] font-['Plus_Jakarta_Sans'] mb-3">
            Discover Your Prakriti
          </h2>
          <p className="text-[#d3c5ae] text-base mb-8">
            Take the free 25-question assessment to find your mental constitution type.
            It takes less than 5 minutes.
          </p>
          <Link
            to={`/${locale}/assessment/intro`}
            className="inline-flex items-center gap-2 metallic-gold px-10 py-4 rounded-xl text-[#402d00] font-bold text-lg shadow-xl hover:shadow-[#f6be39]/30 hover:shadow-2xl transition-all active:scale-95"
          >
            Begin Assessment
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </PageLayout>
  );
}
