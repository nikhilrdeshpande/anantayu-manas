import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Check, Shield, Brain, Sparkles, BookOpen, Leaf, Target, Star, ChevronDown, Lock } from 'lucide-react';
import { PageLayout } from '../components/layout/PageLayout';
import { useAuthStore } from '../stores/auth-store';
import { usePurchaseStore } from '../stores/purchase-store';
import { manas } from '../lib/api';

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const REPORT_SECTIONS = [
  {
    title: 'Who You Are',
    description: 'A personality mirror so accurate you\'ll wonder how we know you. We describe your behavioral patterns, inner conflicts, and how you show up in relationships  - not generic Ayurveda theory.',
    preview: '"You\'re the person who checks their phone during a movie because your mind can\'t sit still. You\'ve started 5 projects this month and finished 2..."',
    free: false,
    icon: Brain,
  },
  {
    title: 'Strengths & Shadows',
    description: 'What makes you powerful and the flip side you struggle with. Honest, compassionate, and specific to your guna balance.',
    preview: null,
    free: false,
    icon: Star,
  },
  {
    title: 'Personalized Diet',
    description: 'Specific foods to eat and avoid based on your mental constitution. Sample breakfast, lunch, dinner tailored to your diet preference.',
    preview: null,
    free: false,
    icon: Leaf,
  },
  {
    title: 'Daily Routine',
    description: 'Hour-by-hour schedule adapted to your work type and sleep quality. Not generic  - built for your specific life.',
    preview: null,
    free: false,
    icon: Target,
  },
  {
    title: 'Mind & Body Practices',
    description: 'Named pranayama techniques, meditation style, and yoga poses prescribed specifically for your prakriti type.',
    preview: null,
    free: false,
    icon: Sparkles,
  },
  {
    title: '30-Day Transformation',
    description: 'Week-by-week progressive plan. Small changes in Week 1, building to a complete daily practice by Week 4.',
    preview: null,
    free: false,
    icon: BookOpen,
  },
];

const COMPARISON = [
  { feature: 'Assessment questions', free: '25', premium: '80' },
  { feature: 'Personality type', free: '7 types', premium: '16 sub-types' },
  { feature: 'Report length', free: '~150 words', premium: '1500+ words' },
  { feature: 'Behavioral mirror', free: '---', premium: 'Detailed' },
  { feature: 'Diet plan', free: '---', premium: 'Personalized' },
  { feature: 'Daily routine', free: '---', premium: 'Hour-by-hour' },
  { feature: 'Yoga & meditation', free: '---', premium: 'Prescribed' },
  { feature: '30-day plan', free: '---', premium: 'Week-by-week' },
];

export default function Pricing() {
  const navigate = useNavigate();
  const { locale = 'en' } = useParams();
  const { user, isAuthenticated } = useAuthStore();
  const { checkAccess } = usePurchaseStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedSection, setExpandedSection] = useState<number | null>(0);

  // If already purchased, redirect to deep assessment
  useEffect(() => {
    if (isAuthenticated && user) {
      checkAccess(user.id).then((hasAccess) => {
        if (hasAccess) navigate(`/${locale}/deep-assessment`, { replace: true });
      });
    }
  }, [isAuthenticated, user]);

  const handlePurchase = async () => {
    if (!isAuthenticated || !user) {
      navigate(`/${locale}/login`);
      return;
    }

    if (!window.Razorpay) {
      setError('Payment system is loading. Please wait a moment and try again.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const order = await manas.createOrder(user.id);

      const options = {
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        name: 'Anantayu',
        description: 'Deep Manas Prakriti Assessment',
        order_id: order.order_id,
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            await manas.verifyPayment(
              user.id,
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature,
            );
            navigate(`/${locale}/payment-success`);
          } catch {
            setError('Payment verification failed. Please contact support.');
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: '#d4a017',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Razorpay error:', err);
      const message = err instanceof Error ? err.message : 'Failed to create order';
      setError(message.includes('API error') ? 'Could not connect to payment server. Please try again.' : message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout hideFooter>
      <div className="min-h-screen bg-[#131313] relative">
        <div className="absolute inset-0 glow-gold pointer-events-none" />

        <div className="relative z-10">
          {/* Hero */}
          <div className="px-4 pb-12 pt-12">
            <div className="max-w-lg mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-[#f6be39]/10 border border-[#f6be39]/20 text-[#f6be39] px-4 py-2 rounded-full text-xs uppercase tracking-widest font-bold mb-6">
                <Sparkles size={12} />
                Premium Report
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-[#e5e2e1] font-['Plus_Jakarta_Sans'] mb-4">
                Go Deeper Than <span className="text-[#f6be39]">a Label</span>
              </h1>
              <p className="text-[#d3c5ae] text-base leading-relaxed mb-8 max-w-md mx-auto">
                Your free assessment told you <em>what</em> you are. The deep report shows you <em>who</em> you are -
                your behavioral patterns, inner conflicts, and a personalized wellness plan.
              </p>
              <div className="flex items-baseline justify-center gap-2 mb-2">
                <span className="text-5xl font-bold text-[#f6be39] font-['Plus_Jakarta_Sans']">&#x20B9;399</span>
                <span className="text-[#9b8f7a] text-sm uppercase tracking-wider">one-time</span>
              </div>
              <p className="text-[#9b8f7a] text-xs uppercase tracking-wider">No subscription. Yours forever.</p>
            </div>
          </div>

          <div className="max-w-lg mx-auto px-4 py-6 space-y-8 pb-32">

            {/* Personality preview teaser */}
            <div className="bg-[#2a2a2a] rounded-2xl border border-[#4f4634]/20 p-6 shadow-2xl">
              <h3 className="text-xs font-bold text-[#f6be39] mb-4 uppercase tracking-widest">
                Sample from a real report
              </h3>
              <div className="bg-[#1c1b1b] rounded-xl p-5 italic text-sm text-[#d3c5ae] leading-relaxed border-l-2 border-[#f6be39]">
                "You're the person who walks into a room and automatically assesses the power dynamics - who's in charge, who's a threat, who's useful. You set goals that others call unrealistic, then hit them. You've been called 'too much' or 'too intense' - you wear it as a badge of honor..."
              </div>
              <p className="text-xs text-[#9b8f7a] mt-3 text-center">
                From an Asura Kaya (The Titan) report. Yours will be equally specific to you.
              </p>
            </div>

            {/* What's in the report - accordion */}
            <div>
              <h3 className="text-xl font-bold text-[#e5e2e1] font-['Plus_Jakarta_Sans'] mb-4">
                What's in your report
              </h3>
              <div className="space-y-2">
                {REPORT_SECTIONS.map((section, i) => (
                  <div
                    key={i}
                    className="bg-[#2a2a2a] rounded-xl border border-[#4f4634]/20 overflow-hidden hover:border-[#f6be39]/30 transition-colors"
                  >
                    <button
                      onClick={() => setExpandedSection(expandedSection === i ? null : i)}
                      className="w-full flex items-center gap-3 p-4 text-left"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#f6be39]/10 border border-[#f6be39]/20 flex items-center justify-center flex-shrink-0">
                        <section.icon size={16} className="text-[#f6be39]" />
                      </div>
                      <span className="flex-1 font-semibold text-sm text-[#e5e2e1]">{section.title}</span>
                      <ChevronDown
                        size={16}
                        className={`text-[#9b8f7a] transition-transform ${expandedSection === i ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {expandedSection === i && (
                      <div className="px-4 pb-4 pt-0">
                        <p className="text-sm text-[#d3c5ae] leading-relaxed">{section.description}</p>
                        {section.preview && (
                          <div className="mt-3 bg-[#1c1b1b] rounded-lg p-3 text-xs italic text-[#9b8f7a] border border-[#4f4634]/20">
                            {section.preview}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Free vs Premium comparison */}
            <div>
              <h3 className="text-xl font-bold text-[#e5e2e1] font-['Plus_Jakarta_Sans'] mb-4">
                Free vs Deep Assessment
              </h3>
              <div className="bg-[#2a2a2a] rounded-2xl border border-[#4f4634]/20 overflow-hidden">
                <div className="grid grid-cols-3 bg-[#1c1b1b] px-4 py-3 text-xs uppercase tracking-wider font-bold">
                  <span className="text-[#d3c5ae]">Feature</span>
                  <span className="text-center text-[#9b8f7a]">Free</span>
                  <span className="text-center text-[#f6be39]">Premium</span>
                </div>
                {COMPARISON.map((row, i) => (
                  <div key={i} className="grid grid-cols-3 px-4 py-3 border-t border-[#4f4634]/10 text-xs">
                    <span className="text-[#e5e2e1] font-medium">{row.feature}</span>
                    <span className="text-center text-[#9b8f7a]">{row.free}</span>
                    <span className="text-center text-[#e5e2e1] font-medium">
                      {row.premium === '---' ? row.premium : (
                        <span className="flex items-center justify-center gap-1">
                          <Check size={12} className="text-[#abd288]" />
                          {row.premium}
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 16 sub-types preview */}
            <div className="bg-[#2a2a2a] rounded-2xl p-6 border border-[#4f4634]/20">
              <h3 className="font-bold mb-3 text-[#f6be39] text-xs uppercase tracking-widest">
                16 personality sub-types
              </h3>
              <p className="text-sm text-[#d3c5ae] mb-5 leading-relaxed">
                The free assessment gives you 1 of 7 types. The deep assessment classifies you into 1 of 16 specific sub-types, each with a mythological archetype and animal symbol.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  'Brahma - The Creator',
                  'Asura - The Titan',
                  'Varuna - The Protector',
                  'Sarpa - The Serpent',
                  'Gandharva - The Artist',
                  'Shakuna - The Hunter',
                  'Rishi - The Sage',
                  'Pashu - The Steady One',
                ].map((t, i) => (
                  <div key={i} className="flex items-center gap-2 text-[#d3c5ae]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#f6be39]" />
                    {t}
                  </div>
                ))}
                <div className="col-span-2 text-[#9b8f7a] text-center mt-2">+ 8 more sub-types</div>
              </div>
            </div>

            {/* Trust signals */}
            <div className="flex items-center justify-center gap-6 text-xs text-[#9b8f7a]">
              <div className="flex items-center gap-1.5">
                <Shield size={14} />
                <span>Secure payment</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock size={14} />
                <span>Data encrypted</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen size={14} />
                <span>Research-backed</span>
              </div>
            </div>
          </div>

          {/* Sticky CTA */}
          <div className="sticky bottom-0 bg-[#131313]/95 glass-nav border-t border-[#4f4634]/20 px-4 py-4">
            <div className="max-w-lg mx-auto">
              <button
                onClick={handlePurchase}
                disabled={loading}
                className="w-full py-4 rounded-xl metallic-gold text-[#402d00] font-bold text-base shadow-xl hover:shadow-[#f6be39]/30 hover:shadow-2xl transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Unlock Deep Assessment - \u20B9399'}
              </button>
              {error && (
                <p className="mt-2 text-sm text-red-400 text-center">{error}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
