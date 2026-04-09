import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Shield, Brain, Sparkles, BookOpen, Leaf, Target, Star, ChevronDown, Lock } from 'lucide-react';
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
      <div className="min-h-screen bg-[#fcf9f8]">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-[#1A1A1A] px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-white/70 hover:text-white">
            <ArrowLeft size={20} />
          </button>
          <span className="text-white/90 font-medium">Deep Assessment</span>
        </div>

        {/* Hero */}
        <div className="bg-[#1A1A1A] px-4 pb-10 pt-6">
          <div className="max-w-lg mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 text-[#d4a017] px-3 py-1 rounded-full text-xs font-medium mb-4">
              <Sparkles size={12} />
              Premium Report
            </div>
            <h1 className="text-3xl font-bold text-white font-[family-name:var(--font-heading)] mb-3">
              Go Deeper Than a Label
            </h1>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Your free assessment told you <em>what</em> you are. The deep report shows you <em>who</em> you are  -
              your behavioral patterns, inner conflicts, and a personalized wellness plan that actually fits your life.
            </p>
            <div className="flex items-baseline justify-center gap-1 mb-2">
              <span className="text-4xl font-bold text-white">₹399</span>
              <span className="text-white/50 text-sm">one-time</span>
            </div>
            <p className="text-white/40 text-xs">One-time payment. No subscription. 80-question assessment + comprehensive AI report.</p>
          </div>
        </div>

        <div className="max-w-lg mx-auto px-4 py-6 space-y-8">

          {/* Personality preview teaser */}
          <div className="bg-white rounded-2xl border border-[#d3c5ae] p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-[#795900] mb-3 uppercase tracking-wide">
              Sample from a real report
            </h3>
            <div className="bg-[#fdf6e3] rounded-xl p-4 italic text-sm text-[#4f4634] leading-relaxed">
              "You're the person who walks into a room and automatically assesses the power dynamics  - who's in charge, who's a threat, who's useful. You set goals that others call unrealistic, then hit them. You've been called 'too much' or 'too intense'  - you wear it as a badge of honor..."
            </div>
            <p className="text-xs text-[#817662] mt-3 text-center">
              This is from an Asura Kaya (The Titan) report. Yours will be equally specific to you.
            </p>
          </div>

          {/* What's in the report  - accordion */}
          <div>
            <h3 className="text-lg font-bold text-[#1c1b1b] font-[family-name:var(--font-heading)] mb-4">
              What's in your report
            </h3>
            <div className="space-y-2">
              {REPORT_SECTIONS.map((section, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-[#e8e4df] overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedSection(expandedSection === i ? null : i)}
                    className="w-full flex items-center gap-3 p-4 text-left"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#fdf6e3] flex items-center justify-center flex-shrink-0">
                      <section.icon size={16} className="text-[#d4a017]" />
                    </div>
                    <span className="flex-1 font-medium text-sm text-[#1c1b1b]">{section.title}</span>
                    <ChevronDown
                      size={16}
                      className={`text-[#817662] transition-transform ${expandedSection === i ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {expandedSection === i && (
                    <div className="px-4 pb-4 pt-0">
                      <p className="text-sm text-[#4f4634] leading-relaxed">{section.description}</p>
                      {section.preview && (
                        <div className="mt-3 bg-[#f6f3f2] rounded-lg p-3 text-xs italic text-[#4f4634]">
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
            <h3 className="text-lg font-bold text-[#1c1b1b] font-[family-name:var(--font-heading)] mb-4">
              Free vs Deep Assessment
            </h3>
            <div className="bg-white rounded-2xl border border-[#d3c5ae] overflow-hidden">
              <div className="grid grid-cols-3 bg-[#f6f3f2] px-4 py-2.5 text-xs font-semibold">
                <span className="text-[#4f4634]">Feature</span>
                <span className="text-center text-[#817662]">Free</span>
                <span className="text-center text-[#d4a017]">Premium</span>
              </div>
              {COMPARISON.map((row, i) => (
                <div key={i} className="grid grid-cols-3 px-4 py-2.5 border-t border-[#f0eded] text-xs">
                  <span className="text-[#1c1b1b]">{row.feature}</span>
                  <span className="text-center text-[#817662]">{row.free}</span>
                  <span className="text-center text-[#1c1b1b] font-medium">
                    {row.premium === '---' ? row.premium : (
                      <span className="flex items-center justify-center gap-1">
                        <Check size={12} className="text-[#7ba05b]" />
                        {row.premium}
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 16 sub-types preview */}
          <div className="bg-[#1A1A1A] rounded-2xl p-5 text-white">
            <h3 className="font-semibold mb-3 text-[#d4a017] text-sm">16 personality sub-types</h3>
            <p className="text-xs text-white/70 mb-4">
              The free assessment gives you 1 of 7 types. The deep assessment classifies you into 1 of 16 specific sub-types, each with a mythological archetype and animal symbol.
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                'Brahma  - The Creator',
                'Asura  - The Titan',
                'Varuna  - The Protector',
                'Sarpa  - The Serpent',
                'Gandharva  - The Artist',
                'Shakuna  - The Hunter',
                'Rishi  - The Sage',
                'Pashu  - The Steady One',
              ].map((t, i) => (
                <div key={i} className="flex items-center gap-2 text-white/60">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#d4a017]" />
                  {t}
                </div>
              ))}
              <div className="col-span-2 text-white/40 text-center mt-1">+ 8 more sub-types</div>
            </div>
          </div>

          {/* Trust signals */}
          <div className="flex items-center justify-center gap-6 text-xs text-[#817662]">
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
        <div className="sticky bottom-0 bg-white/95 backdrop-blur border-t border-[#d3c5ae] px-4 py-3">
          <div className="max-w-lg mx-auto">
            <button
              onClick={handlePurchase}
              disabled={loading}
              className="w-full py-3.5 rounded-full font-semibold text-white transition-all
                bg-gradient-to-r from-[#8B6914] to-[#d4a017] hover:opacity-90 disabled:opacity-50
                shadow-[0_4px_14px_rgba(212,160,23,0.35)]"
            >
              {loading ? 'Processing...' : 'Unlock Deep Assessment  - ₹399'}
            </button>
            {error && (
              <p className="mt-2 text-sm text-red-600 text-center">{error}</p>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
