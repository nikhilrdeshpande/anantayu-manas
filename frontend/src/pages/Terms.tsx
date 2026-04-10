import { PageLayout } from '../components/layout/PageLayout';

export default function Terms() {
  return (
    <PageLayout>
      <div className="py-16 px-6 bg-[#131313] min-h-screen relative">
        <div className="absolute inset-0 glow-gold pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-[#e5e2e1] font-['Plus_Jakarta_Sans'] mb-2">
            Terms of <span className="text-[#f6be39]">Service</span>
          </h1>
          <p className="text-xs text-[#9b8f7a] uppercase tracking-widest font-bold mb-8">Last updated: April 2026</p>

          <div className="bg-[#2a2a2a] rounded-2xl border border-[#4f4634]/20 p-6 md:p-8 space-y-6 text-sm text-[#d3c5ae] leading-relaxed shadow-2xl">
            <section>
              <h2 className="text-lg font-bold text-[#e5e2e1] mb-2 font-['Plus_Jakarta_Sans']">1. Acceptance of Terms</h2>
              <p>By accessing or using the Anantayu Manas Prakriti platform ("Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#e5e2e1] mb-2 font-['Plus_Jakarta_Sans']">2. Service Description</h2>
              <p>Anantayu provides an Ayurvedic mental constitution assessment tool based on published academic research. The Service includes:</p>
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li>Free quick assessment (25 questions) with basic results</li>
                <li>Paid deep assessment (80 questions) with comprehensive personalized report</li>
                <li>AI-generated wellness recommendations</li>
                <li>Optional expert consultation referral</li>
              </ul>
              <p className="mt-2">The Service is for informational and educational purposes only. It is not a substitute for professional medical, psychological, or psychiatric advice.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#e5e2e1] mb-2 font-['Plus_Jakarta_Sans']">3. Accounts</h2>
              <p>You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate information when creating an account. One account per person.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#e5e2e1] mb-2 font-['Plus_Jakarta_Sans']">4. Payments & Refunds</h2>
              <ul className="list-disc ml-5 space-y-1">
                <li>The deep assessment is a one-time payment of INR 399 (or equivalent).</li>
                <li>Each payment grants access to one deep assessment and its associated report.</li>
                <li>Payments are processed securely via Razorpay.</li>
                <li>Reports, once generated, are non-refundable as they involve AI processing costs.</li>
                <li>If a technical issue prevents report generation, contact us for resolution or refund.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#e5e2e1] mb-2 font-['Plus_Jakarta_Sans']">5. Intellectual Property</h2>
              <p>The assessment methodology, scoring algorithms, sub-type classifications, and platform content are proprietary. The underlying research is based on Dr. Akolkar Prasad Pramod's doctoral thesis. You may share your personal results but may not reproduce the assessment tool or methodology.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#e5e2e1] mb-2 font-['Plus_Jakarta_Sans']">6. Disclaimer</h2>
              <p>The Manas Prakriti assessment and generated reports are based on Ayurvedic principles and AI analysis. Results are personalized guidance, not medical diagnosis. Always consult qualified healthcare practitioners before making significant changes to diet, exercise, or health practices.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#e5e2e1] mb-2 font-['Plus_Jakarta_Sans']">7. Limitation of Liability</h2>
              <p>Anantayu is provided "as is" without warranties of any kind. We are not liable for any direct, indirect, incidental, or consequential damages arising from your use of the Service.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#e5e2e1] mb-2 font-['Plus_Jakarta_Sans']">8. Contact</h2>
              <p>For questions about these terms, contact us at <strong className="text-[#e5e2e1]">support@anantayu.com</strong></p>
            </section>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
