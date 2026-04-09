import { PageLayout } from '../components/layout/PageLayout';

export default function PrivacyPolicy() {
  return (
    <PageLayout>
      <div className="py-12 px-6 bg-[#fcf9f8]">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-[#1c1b1b] font-[family-name:var(--font-heading)] mb-2">
            Privacy Policy
          </h1>
          <p className="text-sm text-[#817662] mb-8">Last updated: April 2026</p>

          <div className="bg-white rounded-2xl border border-[#e8e4df] p-6 md:p-8 space-y-6 text-sm text-[#4f4634] leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-[#1c1b1b] mb-2">1. Information We Collect</h2>
              <p>When you use Anantayu Manas Prakriti, we collect:</p>
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li><strong>Account information:</strong> Name, email address, and password (encrypted)</li>
                <li><strong>Assessment responses:</strong> Your answers to the Manas Prakriti questionnaire</li>
                <li><strong>Demographic data:</strong> Age, gender, diet preference, work type, and sleep quality (used to personalize your report)</li>
                <li><strong>Payment information:</strong> Processed securely by Razorpay. We do not store your card details.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#1c1b1b] mb-2">2. How We Use Your Data</h2>
              <ul className="list-disc ml-5 space-y-1">
                <li>Generate your personalized Prakriti assessment results and reports</li>
                <li>Provide AI-powered wellness insights tailored to your constitution</li>
                <li>Save your assessment history for tracking progress over time</li>
                <li>Process payments for premium features</li>
              </ul>
              <p className="mt-2">We do <strong>not</strong> sell, rent, or share your personal data with third parties for marketing purposes.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#1c1b1b] mb-2">3. Data Storage & Security</h2>
              <p>Your data is stored on secure servers. Passwords are hashed using bcrypt. All communication between your browser and our servers is encrypted via HTTPS/TLS. Assessment data and AI-generated reports are stored in our database and associated with your account.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#1c1b1b] mb-2">4. Third-Party Services</h2>
              <ul className="list-disc ml-5 space-y-1">
                <li><strong>Razorpay:</strong> Payment processing (PCI-DSS compliant)</li>
                <li><strong>AI providers:</strong> We use AI language models to generate personalized reports. Your demographic data and assessment scores are sent to generate insights, but no personally identifiable information (name, email) is shared with AI providers.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#1c1b1b] mb-2">5. Your Rights</h2>
              <p>You may request access to, correction of, or deletion of your personal data at any time by contacting us. You can delete your account and all associated data by reaching out to our support.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#1c1b1b] mb-2">6. Contact</h2>
              <p>For privacy-related inquiries, contact us at <strong>privacy@anantayu.com</strong></p>
            </section>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
