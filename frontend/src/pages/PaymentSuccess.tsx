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
    <div className="min-h-screen bg-[#131313] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 glow-gold pointer-events-none" />
      <div className="blur-orb top-[10%] left-[10%] w-80 h-80 bg-[#7ba05b]/10" />
      <div className="blur-orb bottom-[10%] right-[10%] w-80 h-80 bg-[#f6be39]/10" />

      <div className="relative z-10 max-w-sm w-full text-center">
        {/* Animated check */}
        <div className={`transition-all duration-500 ${showCheck ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
          <div className="w-24 h-24 rounded-full bg-[#7ba05b]/10 border-2 border-[#7ba05b]/30 flex items-center justify-center mx-auto mb-8">
            <CheckCircle size={50} className="text-[#abd288]" />
          </div>
        </div>

        <div className={`transition-all duration-500 delay-300 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <h1 className="text-3xl font-bold text-[#e5e2e1] font-['Plus_Jakarta_Sans'] mb-2">
            Payment <span className="text-[#abd288]">Successful</span>
          </h1>
          <p className="text-[#d3c5ae] text-sm mb-6">
            Your Deep Assessment is now unlocked.
          </p>

          <div className="bg-[#2a2a2a] rounded-2xl border border-[#4f4634]/20 p-5 mb-8 shadow-2xl">
            <div className="flex justify-between text-sm mb-3">
              <span className="text-[#9b8f7a] uppercase tracking-wider text-xs">Product</span>
              <span className="text-[#e5e2e1] font-bold">Deep Assessment</span>
            </div>
            <div className="flex justify-between text-sm mb-3">
              <span className="text-[#9b8f7a] uppercase tracking-wider text-xs">Amount</span>
              <span className="text-[#f6be39] font-bold">&#x20B9;399</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#9b8f7a] uppercase tracking-wider text-xs">Includes</span>
              <span className="text-[#abd288] font-bold">Assessment + Report</span>
            </div>
          </div>

          <p className="text-xs text-[#9b8f7a] uppercase tracking-wider mb-6">
            Your deep assessment and personalized report are ready.
          </p>

          <button
            onClick={() => navigate(`/${locale}/deep-assessment`)}
            className="w-full py-4 rounded-xl metallic-gold text-[#402d00] font-bold text-base shadow-xl hover:shadow-[#f6be39]/30 hover:shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            Start Deep Assessment
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
