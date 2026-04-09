import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const { locale = 'en' } = useParams();
  const [showCheck, setShowCheck] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowCheck(true), 300);
    setTimeout(() => setShowContent(true), 800);
  }, []);

  return (
    <div className="min-h-screen bg-[#fcf9f8] flex flex-col items-center justify-center px-4">
      <div className="max-w-sm w-full text-center">
        {/* Animated check */}
        <div className={`transition-all duration-500 ${showCheck ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
          <div className="w-20 h-20 rounded-full bg-[#eff5eb] flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={44} className="text-[#7ba05b]" />
          </div>
        </div>

        <div className={`transition-all duration-500 delay-300 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <h1 className="text-2xl font-bold text-[#1c1b1b] font-[family-name:var(--font-heading)] mb-2">
            Payment Successful
          </h1>
          <p className="text-[#4f4634] text-sm mb-2">
            Your Deep Assessment is now unlocked.
          </p>
          <div className="bg-white rounded-xl border border-[#e8e4df] p-4 mb-6 mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-[#817662]">Product</span>
              <span className="text-[#1c1b1b] font-medium">Deep Manas Prakriti Assessment</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-[#817662]">Amount</span>
              <span className="text-[#1c1b1b] font-medium">₹399</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#817662]">Includes</span>
              <span className="text-[#7ba05b] font-medium">Assessment + Report</span>
            </div>
          </div>

          <p className="text-xs text-[#817662] mb-6">
            Your deep assessment and personalized report are ready. Let's begin.
          </p>

          <button
            onClick={() => navigate(`/${locale}/deep-assessment`)}
            className="w-full py-3.5 rounded-full font-semibold text-white transition-all
              bg-gradient-to-r from-[#8B6914] to-[#d4a017] hover:opacity-90
              shadow-[0_4px_14px_rgba(212,160,23,0.35)]
              flex items-center justify-center gap-2"
          >
            Start Deep Assessment
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
