import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Hero } from '../components/landing/Hero';
import { SocialProofBar } from '../components/landing/SocialProofBar';
import { HowItWorks } from '../components/landing/HowItWorks';
import { GunaPreview } from '../components/landing/GunaPreview';
import { ComparisonSection } from '../components/landing/ComparisonSection';
import { ResearchCredibility } from '../components/landing/ResearchCredibility';
import { DeepAssessmentTeaser } from '../components/landing/DeepAssessmentTeaser';
import { LandingFAQ } from '../components/landing/LandingFAQ';
import { PageLayout } from '../components/layout/PageLayout';
import { useAuthStore } from '../stores/auth-store';

export default function Landing() {
  const { locale = 'en' } = useParams<{ locale: string }>();
  const { isAuthenticated, isLoading } = useAuthStore();

  if (!isLoading && isAuthenticated) {
    return <Navigate to={`/${locale}/dashboard`} replace />;
  }

  return (
    <PageLayout>
      <Hero />
      <SocialProofBar />
      <HowItWorks />
      <GunaPreview />
      <ComparisonSection />
      <ResearchCredibility />
      <DeepAssessmentTeaser />
      <LandingFAQ />

      {/* Final CTA Section */}
      <section className="py-32 md:py-40 bg-[#fcf9f8] text-[#1c1b1b] text-center relative overflow-hidden">
        {/* Decorative blur orbs */}
        <div className="blur-orb -bottom-24 -left-24 w-96 h-96 bg-[#f6be39]/10" />
        <div className="blur-orb -top-24 -right-24 w-96 h-96 bg-[#7ba05b]/10" />

        <div className="container mx-auto px-6 md:px-8 relative z-10">
          <h2 className="text-5xl lg:text-7xl font-extrabold mb-8 max-w-4xl mx-auto leading-tight font-['Plus_Jakarta_Sans']">
            Stop Reading About Yourself.<br />
            Start <span className="text-[#d4a017]">Understanding</span> Yourself.
          </h2>
          <p className="text-xl text-[#1c1b1b]/60 mb-12 max-w-2xl mx-auto">
            25 questions. 3 minutes. A personality profile rooted in 3,000 years of Ayurvedic science. Free.
          </p>
          <Link
            to={`/${locale}/assessment/intro`}
            className="inline-flex items-center gap-3 metallic-gold px-12 py-6 rounded-2xl text-[#402d00] font-bold text-xl shadow-2xl hover:shadow-[#f6be39]/30 hover:shadow-2xl transition-all hover:scale-105 active:scale-95"
          >
            Take the Free Assessment
            <ArrowRight size={24} />
          </Link>
          <p className="text-xs text-[#1c1b1b]/50 mt-6 uppercase tracking-widest font-medium">
            No credit card. No spam. Just self-knowledge.
          </p>
        </div>
      </section>
    </PageLayout>
  );
}
