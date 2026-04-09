import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Hero } from '../components/landing/Hero';
import { HowItWorks } from '../components/landing/HowItWorks';
import { GunaPreview } from '../components/landing/GunaPreview';
import { PageLayout } from '../components/layout/PageLayout';
import { useAuthStore } from '../stores/auth-store';

export default function Landing() {
  const { locale = 'en' } = useParams<{ locale: string }>();
  const { isAuthenticated, isLoading } = useAuthStore();

  // Redirect logged-in users to dashboard
  if (!isLoading && isAuthenticated) {
    return <Navigate to={`/${locale}/dashboard`} replace />;
  }

  return (
    <PageLayout>
      <Hero />
      <HowItWorks />
      <GunaPreview />

      {/* Research Credibility Section */}
      <section className="py-16 bg-[#f6f3f2]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white text-[#795900] px-3 py-1 rounded-full text-xs font-medium mb-4">
            <Sparkles size={12} />
            Research-Backed
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#1c1b1b] font-[family-name:var(--font-heading)] mb-3">
            Grounded in Ayurvedic Science
          </h2>
          <p className="text-[#4f4634] text-sm leading-relaxed max-w-xl mx-auto mb-6">
            Our assessment is based on a PhD thesis in Ayurvedic Psychology from the University of Mumbai,
            mapping the classical Ashtanga Hridayam text to a modern personality classification system
            with 16 distinct sub-types.
          </p>
          <Link
            to={`/${locale}/science`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#d4a017] hover:underline"
          >
            Learn about the science
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 md:py-32 bg-[#fcf9f8]">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-10">
          {/* Leaf image accent */}
          <div className="relative inline-block">
            <img
              src="/images/hero-leaf.jpg"
              alt="Pure nature"
              className="w-32 h-32 rounded-full object-cover border-4 border-[#d4a017] mx-auto"
            />
            <div className="absolute -top-2 -right-2 bg-[#795900] w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
              <Sparkles size={14} className="text-white" />
            </div>
          </div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold font-['Plus_Jakarta_Sans'] text-[#1c1b1b] tracking-tight">
            Your Path to{' '}
            <span className="italic text-[#795900]">Mental Clarity</span>{' '}
            Starts Here.
          </h2>

          <p className="text-[#4f4634] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Join seekers who have discovered their mind's true constitution
            through Anantayu's modern Ayurvedic insights.
          </p>

          <div className="flex justify-center pt-6">
            <Link
              to={`/${locale}/assessment/intro`}
              className="group inline-flex items-center gap-3 rounded-full px-12 py-6 text-xl font-bold text-white shadow-2xl hover:scale-105 active:scale-95 transition-all"
              style={{
                background: 'linear-gradient(135deg, #795900 0%, #d4a017 100%)',
              }}
            >
              Begin Assessment
              <ArrowRight
                size={22}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
