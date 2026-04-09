import { Link, useParams } from 'react-router-dom';
import { ArrowRight, GraduationCap, BookOpen, Brain, Users, Target } from 'lucide-react';
import { PageLayout } from '../components/layout/PageLayout';

const DIFFERENTIATORS = [
  {
    icon: GraduationCap,
    title: 'Built on a PhD Thesis',
    description: 'Every question, score, and classification traces directly to Dr. Akolkar\'s doctoral research at the University of Mumbai. Not a blog post repackaged as science.',
  },
  {
    icon: Users,
    title: '16 Personality Sub-types',
    description: 'Most Ayurvedic tools stop at 3 doshas. We go deeper with 16 distinct mental constitution sub-types, each mapped to behavioral patterns from the Ashtanga Hridayam.',
  },
  {
    icon: Target,
    title: 'Actionable Plans, Not Just Labels',
    description: 'Knowing your type is the starting point, not the destination. Every result comes with specific diet, routine, and practice recommendations for your unique constitution.',
  },
];

export default function About() {
  const { locale = 'en' } = useParams();

  return (
    <PageLayout>
      {/* Hero */}
      <section className="bg-[#1A1A1A] py-16 md:py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-[#d4a017] px-3 py-1 rounded-full text-xs font-medium mb-6">
            <BookOpen size={12} />
            Our Story
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-heading)] mb-4">
            Ancient Wisdom, Modern Science,<br />Real Results
          </h1>
          <p className="text-white/60 text-base leading-relaxed max-w-xl mx-auto">
            We built Anantayu because Ayurvedic psychology deserves better than vague advice
            and generic wellness content.
          </p>
        </div>
      </section>

      {/* Dr. Akolkar Spotlight */}
      <section className="py-16 px-6 bg-[#fcf9f8]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-[#fdf6e3] flex items-center justify-center mx-auto mb-4">
              <GraduationCap size={36} className="text-[#d4a017]" />
            </div>
            <h2 className="text-2xl font-bold text-[#1c1b1b] font-[family-name:var(--font-heading)] mb-1">
              Dr. Prasad Akolkar
            </h2>
            <p className="text-[#d4a017] font-medium text-sm">
              PhD, Ayurvedic Psychology - University of Mumbai
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#d3c5ae] p-6 md:p-8 space-y-4">
            <p className="text-[#4f4634] text-sm leading-relaxed">
              Dr. Akolkar Prasad Pramod spent years researching the intersection of classical Ayurvedic
              texts and modern psychology. His doctoral thesis, <em>"Manasa Vijnana"</em> (2019), is a
              systematic study of mental constitution (Manas Prakriti) as described in the
              <strong> Ashtanga Hridayam of Vagbhata</strong> - one of the most authoritative texts in
              Ayurvedic medicine.
            </p>
            <p className="text-[#4f4634] text-sm leading-relaxed">
              The thesis establishes a rigorous framework for classifying mental constitution based on the
              three Gunas - Sattva (purity), Rajas (activity), and Tamas (inertia). It identifies 16
              distinct personality sub-types, each mapped to specific behavioral patterns (Svabhava) and
              mythological archetypes from ancient Indian texts.
            </p>
            <p className="text-[#4f4634] text-sm leading-relaxed">
              Every question in the Manas Prakriti assessment, every scoring rule, and every classification
              threshold is derived directly from this research. When we say "research-backed," we mean
              you can trace every output to a specific page in a published doctoral thesis.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-6 bg-[#f6f3f2]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-[#1c1b1b] font-[family-name:var(--font-heading)] text-center mb-4">
            Why We Built Anantayu
          </h2>
          <p className="text-[#4f4634] text-center text-sm leading-relaxed max-w-xl mx-auto mb-4">
            Most "Ayurvedic personality" tools online are surface-level at best - a few questions about
            whether you prefer hot or cold weather, then generic dosha advice. That's not what Ayurvedic
            psychology actually is.
          </p>
          <p className="text-[#4f4634] text-center text-sm leading-relaxed max-w-xl mx-auto">
            We built Anantayu to bring Dr. Akolkar's research to everyone. The full depth of
            Manas Prakriti assessment - 80 questions measuring 47 distinct behavioral traits across
            three Gunas - delivered through a modern, accessible platform with AI-powered personalization.
          </p>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-16 px-6 bg-[#fcf9f8]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[#1c1b1b] font-[family-name:var(--font-heading)] text-center mb-10">
            What Makes This Different
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DIFFERENTIATORS.map((d, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#d3c5ae] p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-[#fdf6e3] flex items-center justify-center mx-auto mb-4">
                  <d.icon size={24} className="text-[#d4a017]" />
                </div>
                <h3 className="font-bold text-[#1c1b1b] mb-2">{d.title}</h3>
                <p className="text-sm text-[#4f4634] leading-relaxed">{d.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-[#f6f3f2]">
        <div className="max-w-lg mx-auto text-center">
          <Brain size={36} className="text-[#d4a017] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#1c1b1b] font-[family-name:var(--font-heading)] mb-3">
            Discover Your Prakriti
          </h2>
          <p className="text-[#4f4634] text-sm mb-6">
            25 questions. 3 minutes. A personality profile backed by real research. Free.
          </p>
          <Link
            to={`/${locale}/assessment/intro`}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-white font-semibold
              bg-gradient-to-r from-[#8B6914] to-[#d4a017] hover:opacity-90 transition-opacity
              shadow-[0_4px_14px_rgba(212,160,23,0.35)]"
          >
            Take the Free Assessment
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </PageLayout>
  );
}
