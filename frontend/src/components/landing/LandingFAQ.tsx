import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'How long does it take?',
    a: '3-5 minutes for the free assessment (25 questions). The deep assessment (80 questions) takes 15-20 minutes, but if you already took the free one, 25 answers carry over automatically.',
  },
  {
    q: 'Is this scientifically validated?',
    a: 'Yes. Based on a PhD thesis by Dr. Akolkar Prasad Pramod at the University of Mumbai (2019), referencing the classical Ashtanga Hridayam of Vagbhata.',
  },
  {
    q: 'How is this different from MBTI?',
    a: 'MBTI tells you your personality type. Manas Prakriti tells you your type AND gives you a personalized diet, daily routine, yoga, meditation, and 30-day action plan based on Ayurvedic science.',
  },
  {
    q: 'Is the basic assessment really free?',
    a: 'Yes, completely free. No credit card required. You get your Prakriti type, Guna balance, mental strength grade, and a brief AI insight. The deep assessment (₹399) unlocks 16 sub-types and a comprehensive wellness report.',
  },
  {
    q: 'Is my data private?',
    a: 'Yes. We never sell or share your data. Payments are processed by Razorpay (PCI-DSS compliant). Your assessment data is used only to generate your personal reports.',
  },
];

export function LandingFAQ() {
  const { locale = 'en' } = useParams();
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section className="py-16 md:py-20 px-6 bg-[#f6f3f2]">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-[#1c1b1b] font-[family-name:var(--font-heading)] text-center mb-8">
          Common Questions
        </h2>

        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-white rounded-xl border border-[#e8e4df] overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="font-medium text-sm text-[#1c1b1b] pr-4">{faq.q}</span>
                <ChevronDown
                  size={16}
                  className={`text-[#817662] transition-transform flex-shrink-0 ${expanded === i ? 'rotate-180' : ''}`}
                />
              </button>
              {expanded === i && (
                <div className="px-4 pb-4">
                  <p className="text-sm text-[#4f4634] leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-6">
          <Link to={`/${locale}/faq`} className="text-sm text-[#d4a017] font-medium hover:underline">
            View all FAQs
          </Link>
        </div>
      </div>
    </section>
  );
}
