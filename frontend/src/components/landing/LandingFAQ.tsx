import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Plus, ArrowRight } from 'lucide-react';

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
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <section className="py-24 md:py-28 bg-[#1c1b1b] text-[#e5e2e1]">
      <div className="container mx-auto px-6 md:px-8 max-w-4xl">
        <h2 className="text-4xl lg:text-5xl font-bold mb-16 text-center font-['Plus_Jakarta_Sans']">
          Common Questions
        </h2>

        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="bg-[#2a2a2a] rounded-2xl overflow-hidden border border-[#4f4634]/10 hover:border-[#f6be39]/20 transition-colors"
            >
              <button
                onClick={() => setExpanded(expanded === i ? null : i)}
                className="w-full p-6 text-left flex justify-between items-center group"
              >
                <span className="font-semibold text-[#e5e2e1] pr-4">{faq.q}</span>
                <Plus
                  size={20}
                  className={`text-[#f6be39] transition-transform flex-shrink-0 ${expanded === i ? 'rotate-45' : ''}`}
                />
              </button>
              {expanded === i && (
                <div className="px-6 pb-6 text-[#d3c5ae] leading-relaxed text-sm">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to={`/${locale}/faq`}
            className="inline-flex items-center gap-2 text-[#f6be39] text-sm font-semibold hover:underline"
          >
            View all FAQs <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
