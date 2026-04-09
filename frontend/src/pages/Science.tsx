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
      <section className="bg-[#1A1A1A] py-16 md:py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-[#d4a017] px-3 py-1 rounded-full text-xs font-medium mb-6">
            <BookOpen size={12} />
            Research Foundation
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-heading)] mb-4">
            The Science Behind<br />Manas Prakriti
          </h1>
          <p className="text-white/60 text-base leading-relaxed max-w-xl mx-auto">
            Our assessment is grounded in a PhD thesis on Ayurvedic psychology, mapping ancient
            wisdom from the Ashtanga Hridayam to a modern, validated classification system.
          </p>
        </div>
      </section>

      {/* Research Foundation */}
      <section className="py-16 px-6 bg-[#fcf9f8]">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl border border-[#d3c5ae] p-6 md:p-8 flex flex-col md:flex-row gap-6">
            <div className="w-16 h-16 rounded-2xl bg-[#fdf6e3] flex items-center justify-center flex-shrink-0">
              <GraduationCap size={28} className="text-[#d4a017]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1c1b1b] font-[family-name:var(--font-heading)] mb-2">
                Research by Dr. Prasad Akolkar
              </h2>
              <p className="text-[#4f4634] text-sm leading-relaxed mb-3">
                The Manas Prakriti assessment is based on <em>"Manasa Vijnana"</em>  - a doctoral thesis
                by Dr. Akolkar Prasad Pramod at the University of Mumbai (2019). The research references
                the classical Ayurvedic text <strong>Ashtanga Hridayam of Vagbhata</strong>, one of the
                foundational works of Ayurvedic medicine.
              </p>
              <p className="text-[#4f4634] text-sm leading-relaxed">
                The thesis establishes a systematic framework for classifying mental constitution
                (Manas Prakriti) based on the three Gunas  - Sattva, Rajas, and Tamas  - and identifies
                16 distinct personality sub-types, each mapped to behavioral patterns (Svabhava) and
                mythological archetypes from ancient Indian texts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Three Gunas */}
      <section className="py-16 px-6 bg-[#f6f3f2]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[#1c1b1b] font-[family-name:var(--font-heading)] text-center mb-3">
            The Three Gunas
          </h2>
          <p className="text-[#4f4634] text-center text-sm mb-10 max-w-xl mx-auto">
            According to Ayurveda, every mind is a unique blend of three fundamental qualities.
            Your specific balance determines your mental constitution.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {GUNAS.map((guna) => {
              const Icon = guna.icon;
              return (
                <div
                  key={guna.name}
                  className="bg-white rounded-2xl p-6 border-b-4 transition-all hover:-translate-y-1 hover:shadow-md"
                  style={{ borderBottomColor: guna.color }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: guna.tint }}
                  >
                    <Icon size={24} style={{ color: guna.color }} />
                  </div>
                  <h3 className="text-lg font-bold mb-1" style={{ color: guna.dark }}>
                    {guna.name}
                  </h3>
                  <p className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: guna.color }}>
                    {guna.subtitle}
                  </p>
                  <p className="text-sm text-[#4f4634] leading-relaxed mb-4">
                    {guna.description}
                  </p>
                  <div className="space-y-1.5">
                    {guna.traits.map((trait, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-[#4f4634]">
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
      <section className="py-16 px-6 bg-[#fcf9f8]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-[#1c1b1b] font-[family-name:var(--font-heading)] text-center mb-10">
            How the Assessment Works
          </h2>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-[#fdf6e3] flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-[#d4a017]">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-[#1c1b1b] mb-1">Answer questions about your natural tendencies</h3>
                <p className="text-sm text-[#4f4634]">
                  Each question maps to a specific Bhava (behavioral quality) under one of the three Gunas.
                  The quick assessment covers 25 questions; the deep assessment covers 80.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-[#fdf6e3] flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-[#d4a017]">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-[#1c1b1b] mb-1">Thesis-validated scoring algorithm</h3>
                <p className="text-sm text-[#4f4634]">
                  Your answers are scored using the exact methodology from the PhD thesis.
                  "Sometimes" answers are converted using different ratios for each Guna  -
                  Rajas (the active guna) gets a higher YES conversion than Sattva and Tamas.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-[#fdf6e3] flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-[#d4a017]">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-[#1c1b1b] mb-1">Classification into 7 or 16 types</h3>
                <p className="text-sm text-[#4f4634]">
                  The quick assessment classifies you into 1 of 7 Prakriti types based on your dominant Guna combination.
                  The deep assessment further narrows this to 1 of 16 specific sub-types, each with a
                  mythological archetype and animal symbol from the Ayurvedic texts.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-[#eff5eb] flex items-center justify-center flex-shrink-0">
                <Shield size={18} className="text-[#7ba05b]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#1c1b1b] mb-1">Sattva Bala  - Mental Strength</h3>
                <p className="text-sm text-[#4f4634]">
                  Your Sattva percentage determines your mental strength grade:
                  <strong> Pravara</strong> (high, 66%+),
                  <strong> Madhya</strong> (moderate, 33-66%), or
                  <strong> Avara</strong> (developing, below 33%).
                  This isn't a judgment  - it's a starting point for growth.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 16 Sub-types */}
      <section className="py-16 px-6 bg-[#1A1A1A]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white font-[family-name:var(--font-heading)] text-center mb-3">
            16 Personality Sub-types
          </h2>
          <p className="text-white/50 text-sm text-center mb-10 max-w-xl mx-auto">
            The deep assessment classifies you into one of these specific sub-types,
            each rooted in the Ashtanga Hridayam classification system.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {SUBTYPES.map((st) => (
              <div
                key={st.name}
                className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-colors"
              >
                <div
                  className="w-2 h-2 rounded-full mb-2"
                  style={{ backgroundColor: GUNA_COLORS[st.guna] }}
                />
                <p className="text-white font-semibold text-sm">{st.name} Kaya</p>
                <p className="text-[#d4a017] text-xs">{st.archetype}</p>
                <p className="text-white/40 text-xs mt-1">{st.animal}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-[#fcf9f8]">
        <div className="max-w-lg mx-auto text-center">
          <Brain size={36} className="text-[#d4a017] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#1c1b1b] font-[family-name:var(--font-heading)] mb-3">
            Discover Your Prakriti
          </h2>
          <p className="text-[#4f4634] text-sm mb-6">
            Take the free 25-question assessment to find your mental constitution type.
            It takes less than 5 minutes.
          </p>
          <Link
            to={`/${locale}/assessment/intro`}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-white font-semibold
              bg-gradient-to-r from-[#8B6914] to-[#d4a017] hover:opacity-90 transition-opacity
              shadow-[0_4px_14px_rgba(212,160,23,0.35)]"
          >
            Begin Assessment
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </PageLayout>
  );
}
