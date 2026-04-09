import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowRight, GraduationCap } from 'lucide-react';
import { Hero } from '../components/landing/Hero';
import { SocialProofBar } from '../components/landing/SocialProofBar';
import { HowItWorks } from '../components/landing/HowItWorks';
import { GunaPreview } from '../components/landing/GunaPreview';
import { ComparisonSection } from '../components/landing/ComparisonSection';
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

      {/* Research Credibility Section */}
      <section className="py-16 md:py-20 bg-[#f6f3f2] px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl border border-[#d3c5ae] p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
            <div className="w-14 h-14 rounded-2xl bg-[#fdf6e3] flex items-center justify-center flex-shrink-0">
              <GraduationCap size={28} className="text-[#d4a017]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1c1b1b] font-[family-name:var(--font-heading)] mb-1">
                Built on Real Research
              </h2>
              <p className="text-[#d4a017] text-sm font-medium mb-3">
                Dr. Prasad Akolkar - PhD, Ayurvedic Psychology, University of Mumbai
              </p>
              <p className="text-[#4f4634] text-sm leading-relaxed mb-4">
                This isn't a quiz someone made over a weekend. The Manas Prakriti assessment is based on
                <em> "Manasa Vijnana"</em>, a doctoral thesis that maps the classical Ashtanga Hridayam text
                to a modern personality classification system with 16 distinct sub-types. Every question,
                every scoring rule, every classification threshold traces to published research.
              </p>
              <div className="flex flex-wrap gap-3 mb-4">
                {['University of Mumbai', 'Ashtanga Hridayam', '16 Sub-types', '47 Behavioral Traits'].map((badge) => (
                  <span key={badge} className="bg-[#fdf6e3] text-[#795900] text-xs px-3 py-1 rounded-full font-medium">
                    {badge}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-4 text-sm">
                <Link to={`/${locale}/about`} className="text-[#d4a017] font-medium hover:underline flex items-center gap-1">
                  About us <ArrowRight size={14} />
                </Link>
                <Link to={`/${locale}/science`} className="text-[#d4a017] font-medium hover:underline flex items-center gap-1">
                  The science <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <DeepAssessmentTeaser />
      <LandingFAQ />

      {/* Final CTA Section */}
      <section className="py-20 md:py-28 bg-[#fcf9f8] px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold font-['Plus_Jakarta_Sans'] text-[#1c1b1b] tracking-tight mb-4">
            Stop Reading About Yourself.{' '}
            <span className="text-[#795900]">Start Understanding Yourself.</span>
          </h2>
          <p className="text-[#4f4634] text-lg max-w-lg mx-auto leading-relaxed mb-8">
            25 questions. 3 minutes. A personality profile rooted in 3,000 years of Ayurvedic science. Free.
          </p>
          <Link
            to={`/${locale}/assessment/intro`}
            className="group inline-flex items-center gap-3 rounded-full px-12 py-5 text-lg font-bold text-white shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
            style={{ background: 'linear-gradient(135deg, #795900 0%, #d4a017 100%)' }}
          >
            Take the Free Assessment
            <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <p className="text-xs text-[#817662] mt-4">No credit card. No spam. Just self-knowledge.</p>
        </div>
      </section>
    </PageLayout>
  );
}
