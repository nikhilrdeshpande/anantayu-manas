import { useNavigate, useParams } from 'react-router-dom';
import { Brain, Leaf, Zap, Mountain, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useAssessmentStore } from '../stores/assessment-store';
import { useAuthStore } from '../stores/auth-store';
import { DemographicsForm } from '../components/assessment/DemographicsForm';
import { AuthGate } from '../components/assessment/AuthGate';
import type { ApiDemographics } from '../lib/api';

type Step = 'intro' | 'auth' | 'demographics';

export default function AssessmentIntro() {
  const navigate = useNavigate();
  const { locale = 'en' } = useParams<{ locale: string }>();
  const store = useAssessmentStore();
  const { isAuthenticated, user } = useAuthStore();
  const [step, setStep] = useState<Step>('intro');
  const [resumeMessage, setResumeMessage] = useState('');

  const handleBegin = () => {
    if (isAuthenticated) {
      // Already logged in — go straight to demographics
      store.reset();
      store.loadQuestions();
      setStep('demographics');
    } else {
      // Need to sign up / sign in first
      setStep('auth');
    }
  };

  const handleAuthenticated = () => {
    // Auth completed — now proceed to demographics
    store.reset();
    store.loadQuestions();
    setStep('demographics');
  };

  const handleDemographicsSubmit = async (demographics: ApiDemographics) => {
    store.setDemographics(demographics);

    // Check for saved progress
    const hasProgress = await store.loadSavedProgress();
    if (hasProgress) {
      setResumeMessage('Resuming from where you left off');
      setTimeout(() => setResumeMessage(''), 3000);
    }

    store.setPhase('quiz');
    navigate(`/${locale}/assessment`);
  };

  // Step: Auth gate
  if (step === 'auth') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12" style={{ backgroundColor: '#FAFAF5' }}>
        {/* Logo */}
        <div className="mb-8 text-center">
          <img src="/Anantayu Logo.png" alt="Anantayu" className="h-14 w-auto mx-auto mb-2" />
          <p className="text-[#4f4634] tracking-widest uppercase text-[10px] font-semibold">
            Manas Prakriti Assessment
          </p>
        </div>

        <div className="w-full max-w-lg">
          <div className="bg-white rounded-3xl shadow-sm border border-[#E8E4DF] p-8 md:p-12">
            <AuthGate onAuthenticated={handleAuthenticated} />

            {/* Back link */}
            <div className="mt-6 text-center">
              <button
                onClick={() => setStep('intro')}
                className="text-sm hover:underline"
                style={{ color: '#817662' }}
              >
                Back to assessment info
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step: Demographics form
  if (step === 'demographics') {
    return (
      <div style={{ backgroundColor: '#FAFAF5' }} className="min-h-screen">
        {/* Logo + greeting */}
        <div className="text-center pt-10 pb-4">
          <img src="/Anantayu Logo.png" alt="Anantayu" className="h-12 w-auto mx-auto mb-3" />
          {user && (
            <p className="text-sm" style={{ color: '#4f4634' }}>
              Welcome, <span className="font-semibold" style={{ color: '#1c1b1b' }}>{user.name}</span>
            </p>
          )}
        </div>

        {resumeMessage && (
          <div className="max-w-md mx-auto mt-2 mb-0 p-3 rounded-xl bg-[#c6efa1]/30 text-[#466729] text-sm text-center">
            {resumeMessage}
          </div>
        )}

        <DemographicsForm onSubmit={handleDemographicsSubmit} />
      </div>
    );
  }

  // Step: Intro (default)
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12" style={{ backgroundColor: '#FAFAF5' }}>
      {/* Logo */}
      <div className="mb-8 text-center">
        <img src="/Anantayu Logo.png" alt="Anantayu" className="h-14 w-auto mx-auto mb-2" />
        <p className="text-[#4f4634] tracking-widest uppercase text-[10px] font-semibold">
          Manas Prakriti Assessment
        </p>
      </div>

      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-sm border border-[#E8E4DF] p-8 md:p-12">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--rajas-tint)' }}
            >
              <Brain className="w-8 h-8" style={{ color: 'var(--rajas)' }} />
            </div>
          </div>

          {/* Title */}
          <h1
            className="text-3xl md:text-4xl font-bold text-center mb-3"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--on-surface)' }}
          >
            About This Assessment
          </h1>

          {/* Description */}
          <p
            className="text-center text-base md:text-lg leading-relaxed mb-8 max-w-md mx-auto"
            style={{ color: 'var(--on-surface-variant)' }}
          >
            Answer 25 questions about your natural tendencies to discover your unique
            Manas Prakriti — your psychological constitution according to Ayurveda.
          </p>

          {/* Guna indicators */}
          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: 'var(--sattva-tint)' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#7BA05B' }}>
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: '#466729' }}>Part 1 — Calm Nature</p>
                <p className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>
                  10 questions exploring your purity and balance
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: 'var(--rajas-tint)' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#D4A017' }}>
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: '#8B6914' }}>Part 2 — Active Nature</p>
                <p className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>
                  10 questions exploring your energy and drive
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: 'var(--tamas-tint)' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#5B6B7A' }}>
                <Mountain className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: '#50606f' }}>Part 3 — Steady Nature</p>
                <p className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>
                  5 questions exploring your stability and grounding
                </p>
              </div>
            </div>
          </div>

          {/* Illustration placeholder */}
          <div
            className="w-full h-40 rounded-2xl mb-8 flex items-center justify-center"
            style={{ backgroundColor: '#F5F0EB' }}
          >
            <p className="text-sm italic" style={{ color: 'var(--on-surface-variant)' }}>
              Discover the balance of your three gunas
            </p>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleBegin}
            className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-white font-semibold text-lg transition-all duration-200 hover:opacity-90 active:scale-[0.98] cursor-pointer"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              background: 'linear-gradient(135deg, #D4A017 0%, #C4920F 100%)',
              boxShadow: '0 4px 14px rgba(212, 160, 23, 0.35)',
            }}
          >
            {isAuthenticated ? 'Continue to Assessment' : 'Begin Assessment'}
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Footer */}
          <p className="text-center text-xs mt-4" style={{ color: 'var(--on-surface-variant)' }}>
            {isAuthenticated
              ? `Signed in as ${user?.name}`
              : 'You\'ll create a free account to save your results'}
          </p>
        </div>
      </div>
    </div>
  );
}
