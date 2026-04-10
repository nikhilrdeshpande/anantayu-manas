import { useNavigate, useParams } from 'react-router-dom';
import { Brain, Leaf, Zap, Mountain, ArrowRight, RotateCcw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAssessmentStore } from '../stores/assessment-store';
import { useAuthStore } from '../stores/auth-store';
import { DemographicsForm } from '../components/assessment/DemographicsForm';
import { AuthGate } from '../components/assessment/AuthGate';
import { manas } from '../lib/api';
import type { ApiDemographics } from '../lib/api';

type Step = 'intro' | 'auth' | 'demographics';

export default function AssessmentIntro() {
  const navigate = useNavigate();
  const { locale = 'en' } = useParams<{ locale: string }>();
  const store = useAssessmentStore();
  const { isAuthenticated, user } = useAuthStore();
  const [step, setStep] = useState<Step>('intro');
  const [resumeMessage, setResumeMessage] = useState('');
  const [hasResumable, setHasResumable] = useState(false);
  const [savedDemographics, setSavedDemographics] = useState<ApiDemographics | null>(null);
  const [, setLoadingDemographics] = useState(false);

  // Check for saved progress + demographics when user is authenticated
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    // Check resumable progress
    manas.getResumeData(user.id).then((data) => {
      if (data.has_progress && data.answers && data.answers.length > 0) {
        setHasResumable(true);
      }
    }).catch(() => {});
    // Check saved demographics
    manas.getUserDemographics(user.id).then((data) => {
      if (data.has_demographics && data.demographics) {
        setSavedDemographics(data.demographics);
      }
    }).catch(() => {});
  }, [isAuthenticated, user]);

  const startFresh = () => {
    store.reset();
    store.loadQuestions();
    if (savedDemographics) {
      // Skip demographics  - use saved ones
      store.setDemographics(savedDemographics);
      store.setPhase('quiz');
      navigate(`/${locale}/assessment`);
    } else {
      setStep('demographics');
    }
  };

  const handleResume = async () => {
    store.reset();
    store.loadQuestions();
    if (savedDemographics) {
      store.setDemographics(savedDemographics);
    }
    const loaded = await store.loadSavedProgress();
    if (loaded) {
      setResumeMessage('Resuming from where you left off');
      store.setPhase('quiz');
      navigate(`/${locale}/assessment`);
    } else {
      // Nothing to resume, start fresh
      startFresh();
    }
  };

  const handleBegin = () => {
    if (isAuthenticated) {
      startFresh();
    } else {
      setStep('auth');
    }
  };

  const handleAuthenticated = () => {
    // Auth completed  - check demographics async, then proceed
    setLoadingDemographics(true);
    manas.getUserDemographics(user!.id).then((data) => {
      if (data.has_demographics && data.demographics) {
        setSavedDemographics(data.demographics);
        store.reset();
        store.loadQuestions();
        store.setDemographics(data.demographics);
        store.setPhase('quiz');
        navigate(`/${locale}/assessment`);
      } else {
        store.reset();
        store.loadQuestions();
        setStep('demographics');
      }
    }).catch(() => {
      store.reset();
      store.loadQuestions();
      setStep('demographics');
    }).finally(() => setLoadingDemographics(false));
  };

  const handleDemographicsSubmit = async (demographics: ApiDemographics) => {
    store.setDemographics(demographics);
    store.setPhase('quiz');
    navigate(`/${locale}/assessment`);
  };

  // Step: Auth gate
  if (step === 'auth') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-24 bg-[#131313] relative">
        <div className="absolute inset-0 glow-gold pointer-events-none" />
        <div className="relative z-10 w-full flex flex-col items-center">
          <div className="mb-8 text-center">
            <span className="text-3xl font-bold tracking-tighter text-[#f6be39] font-['Plus_Jakarta_Sans']">
              Anantayu
            </span>
            <p className="text-[#d3c5ae] tracking-widest uppercase text-[10px] font-bold mt-2">
              Manas Prakriti Assessment
            </p>
          </div>

          <div className="w-full max-w-lg">
            <div className="bg-[#2a2a2a] rounded-3xl border border-[#4f4634]/20 p-8 md:p-12 shadow-2xl">
              <AuthGate onAuthenticated={handleAuthenticated} />

              <div className="mt-6 text-center">
                <button
                  onClick={() => setStep('intro')}
                  className="text-xs uppercase tracking-wider text-[#d3c5ae] hover:text-[#f6be39] transition-colors"
                >
                  Back to assessment info
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step: Demographics form
  if (step === 'demographics') {
    return (
      <div className="min-h-screen bg-[#131313] relative pt-20 pb-12">
        <div className="absolute inset-0 glow-gold pointer-events-none" />
        <div className="relative z-10">
          <div className="text-center pt-6 pb-6">
            <span className="text-2xl font-bold tracking-tighter text-[#f6be39] font-['Plus_Jakarta_Sans']">
              Anantayu
            </span>
            {user && (
              <p className="text-sm text-[#d3c5ae] mt-3">
                Welcome, <span className="font-semibold text-[#e5e2e1]">{user.name}</span>
              </p>
            )}
          </div>

          {resumeMessage && (
            <div className="max-w-md mx-auto mt-2 mb-0 p-3 rounded-xl bg-[#7ba05b]/20 border border-[#7ba05b]/30 text-[#abd288] text-sm text-center">
              {resumeMessage}
            </div>
          )}

          <DemographicsForm onSubmit={handleDemographicsSubmit} />
        </div>
      </div>
    );
  }

  // Step: Intro (default)
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-24 bg-[#131313] relative overflow-hidden">
      <div className="absolute inset-0 glow-gold pointer-events-none" />

      {/* Decorative blur orbs */}
      <div className="blur-orb -top-32 -right-32 w-96 h-96 bg-[#f6be39]/10" />
      <div className="blur-orb -bottom-32 -left-32 w-96 h-96 bg-[#7ba05b]/10" />

      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Brand label */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f6be39]/10 border border-[#f6be39]/20 mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f6be39] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f6be39]" />
            </span>
            <span className="text-[#f6be39] text-xs uppercase tracking-widest font-bold">
              Manas Prakriti Assessment
            </span>
          </div>
        </div>

        <div className="max-w-2xl w-full">
          <div className="bg-[#2a2a2a] rounded-3xl border border-[#4f4634]/20 shadow-2xl p-8 md:p-12">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-[#f6be39]/10 border border-[#f6be39]/20 flex items-center justify-center">
                <Brain className="w-8 h-8 text-[#f6be39]" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-bold text-center mb-4 text-[#e5e2e1] font-['Plus_Jakarta_Sans']">
              Know Yourself in <span className="text-[#f6be39]">3 Minutes</span>
            </h1>

            {/* Description */}
            <p className="text-center text-base md:text-lg leading-relaxed mb-10 max-w-md mx-auto text-[#d3c5ae]">
              25 honest questions about how you think, react, and cope. No right answers.
              Based on a PhD thesis in Ayurvedic psychology from the University of Mumbai.
            </p>

            {/* Guna indicators */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-[#7ba05b]/10 border border-[#7ba05b]/20">
                <div className="w-10 h-10 rounded-full bg-[#7ba05b] flex items-center justify-center flex-shrink-0">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-sm text-[#abd288] uppercase tracking-wider">Part 1  - Calm Nature</p>
                  <p className="text-xs text-[#d3c5ae] mt-0.5">
                    10 questions exploring your purity and balance
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-[#f6be39]/10 border border-[#f6be39]/20">
                <div className="w-10 h-10 rounded-full bg-[#d4a017] flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-sm text-[#f6be39] uppercase tracking-wider">Part 2  - Active Nature</p>
                  <p className="text-xs text-[#d3c5ae] mt-0.5">
                    10 questions exploring your energy and drive
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-[#5b6b7a]/10 border border-[#5b6b7a]/20">
                <div className="w-10 h-10 rounded-full bg-[#5b6b7a] flex items-center justify-center flex-shrink-0">
                  <Mountain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-sm text-[#c8c6c5] uppercase tracking-wider">Part 3  - Steady Nature</p>
                  <p className="text-xs text-[#d3c5ae] mt-0.5">
                    5 questions exploring your stability and grounding
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleBegin}
              className="w-full py-4 rounded-xl flex items-center justify-center gap-2 metallic-gold text-[#402d00] font-bold text-lg shadow-xl hover:shadow-[#f6be39]/20 hover:shadow-2xl transition-all active:scale-95"
            >
              {isAuthenticated ? 'Start Assessment' : 'Begin Assessment'}
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Resume option */}
            {isAuthenticated && hasResumable && (
              <button
                onClick={handleResume}
                className="w-full py-3 mt-3 rounded-xl flex items-center justify-center gap-2 font-medium text-sm transition-all border border-[#4f4634]/30 text-[#d3c5ae] hover:border-[#f6be39]/40 hover:text-[#f6be39]"
              >
                <RotateCcw className="w-4 h-4" />
                Resume Previous Assessment
              </button>
            )}

            {/* Footer */}
            <p className="text-center text-xs mt-5 uppercase tracking-wider text-[#d3c5ae]/60">
              {isAuthenticated
                ? `Signed in as ${user?.name}`
                : 'Free forever. No credit card needed.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
