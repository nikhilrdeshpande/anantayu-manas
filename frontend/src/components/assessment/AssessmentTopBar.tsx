import { ArrowLeft, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function AssessmentTopBar() {
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14 bg-[#131313]/80 glass-nav border-b border-[#4f4634]/20">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-white/5 cursor-pointer"
      >
        <ArrowLeft className="w-5 h-5 text-[#d3c5ae]" />
      </button>

      {/* Brand */}
      <img src="/anantayu-logo-dark.png" alt="Anantayu" className="h-7 w-auto" />

      {/* Language pill */}
      <button className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer bg-white/5 text-[#d3c5ae] hover:bg-white/10 transition-colors">
        <Globe className="w-3.5 h-3.5" />
        EN
      </button>
    </div>
  );
}
