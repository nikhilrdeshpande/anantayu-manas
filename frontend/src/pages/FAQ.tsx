import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { PageLayout } from '../components/layout/PageLayout';

const FAQS = [
  {
    q: 'What is Manas Prakriti?',
    a: 'Manas Prakriti is your mental constitution according to Ayurveda. Unlike body constitution (Sharira Prakriti) which deals with physical doshas (Vata, Pitta, Kapha), Manas Prakriti describes your psychological makeup based on three mental qualities called Gunas: Sattva (purity and clarity), Rajas (energy and passion), and Tamas (stability and grounding). Your unique balance of these three qualities determines how you think, react, and relate to the world.',
  },
  {
    q: 'How is this different from MBTI or 16Personalities?',
    a: 'Three key differences. First, origin: MBTI is based on a 1940s theory by two non-psychologists, while Manas Prakriti draws from the Ashtanga Hridayam, a 3,000-year-old Ayurvedic medical text, validated through a PhD thesis at the University of Mumbai. Second, scope: MBTI tells you your personality type, Manas Prakriti gives you your type PLUS a personalized wellness plan - diet, daily routine, yoga, meditation, and a 30-day action plan. Third, depth: our deep assessment measures 47 distinct behavioral traits (bhavas) to classify you into 1 of 16 specific sub-types, each with mythological archetypes and animal symbols from the classical texts.',
  },
  {
    q: 'Is this scientifically validated?',
    a: 'Yes. The assessment is based on "Manasa Vijnana," a doctoral thesis by Dr. Akolkar Prasad Pramod, completed at the University of Mumbai in 2019. The thesis systematically maps personality classification from the Ashtanga Hridayam of Vagbhata to a modern assessment framework. Every question, scoring algorithm, and classification threshold in our platform traces directly to this published research.',
  },
  {
    q: 'How long does the assessment take?',
    a: 'The free quick assessment has 25 questions and takes about 3-5 minutes. The paid deep assessment has 80 questions and takes about 15-20 minutes. If you take the deep assessment after the quick one, your 25 previous answers carry over automatically, so you only answer the 55 new questions.',
  },
  {
    q: 'What do I get with the free assessment vs. the deep assessment?',
    a: 'The free assessment (25 questions) classifies you into 1 of 7 Prakriti types, shows your Guna balance percentages, your mental strength grade (Sattva Bala), and a brief AI-generated insight. The deep assessment (80 questions, ₹399 one-time) goes further: it classifies you into 1 of 16 specific sub-types with a mythological archetype, and generates a 1500+ word personalized report covering your behavioral patterns, strengths and shadows, personalized diet plan, daily routine, mind and body practices, and a 30-day transformation plan.',
  },
  {
    q: 'Is my data private?',
    a: 'Yes. Your assessment answers and results are stored securely and are never shared with third parties. We use your data only to generate your personalized reports. Payment processing is handled by Razorpay, a PCI-DSS compliant payment gateway. You can read our full Privacy Policy for details.',
  },
  {
    q: 'Can I retake the assessment?',
    a: 'Yes, you can retake the free quick assessment as many times as you want. Each attempt generates a new result, and you can track your history from your dashboard. For the deep assessment, each payment of ₹399 covers one complete assessment and report.',
  },
  {
    q: 'What is Sattva Bala?',
    a: 'Sattva Bala means "mental strength" in Sanskrit. It is calculated from your Sattva percentage and indicates the overall quality of your mental constitution. There are three grades: Pravara (superior, 66%+ Sattva), Madhya (moderate, 33-66% Sattva), and Avara (developing, below 33% Sattva). This is not a judgment - it is a starting point. Your Sattva Bala can improve over time through consistent practice of sattvic habits.',
  },
  {
    q: 'Who is Dr. Akolkar?',
    a: 'Dr. Akolkar Prasad Pramod is the researcher whose PhD thesis forms the scientific foundation of the Manas Prakriti assessment. His doctoral work at the University of Mumbai (2019) titled "Manasa Vijnana" established the framework for classifying mental constitution based on the Ashtanga Hridayam of Vagbhata. He is available for personalized 1-on-1 consultations through our platform.',
  },
  {
    q: 'How do I book a consultation with Dr. Akolkar?',
    a: 'After completing the deep assessment, you will see a "Book Consultation" button that opens a WhatsApp conversation with Dr. Akolkar. Your prakriti type is automatically included in the message so he has context before your session. You can also reach out directly through the consultation link on the deep results page.',
  },
];

export default function FAQ() {
  const { locale = 'en' } = useParams();
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <PageLayout>
      {/* Hero */}
      <section className="bg-[#1A1A1A] py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-[#d4a017] px-3 py-1 rounded-full text-xs font-medium mb-6">
            <HelpCircle size={12} />
            Help Center
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-heading)]">
            Frequently Asked Questions
          </h1>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-12 px-6 bg-[#fcf9f8]">
        <div className="max-w-2xl mx-auto space-y-3">
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
                <div className="px-4 pb-4 pt-0">
                  <p className="text-sm text-[#4f4634] leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Cross-links */}
        <div className="max-w-2xl mx-auto mt-10 text-center space-y-2">
          <p className="text-sm text-[#817662]">Still have questions?</p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <Link to={`/${locale}/about`} className="text-[#d4a017] hover:underline">About us</Link>
            <span className="text-[#d3c5ae]">|</span>
            <Link to={`/${locale}/science`} className="text-[#d4a017] hover:underline">The Science</Link>
            <span className="text-[#d3c5ae]">|</span>
            <Link to={`/${locale}/privacy`} className="text-[#d4a017] hover:underline">Privacy Policy</Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
