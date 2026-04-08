import { ArrowLeft, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function AssessmentTopBar() {
  const navigate = useNavigate();

  return (
    <div
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14"
      style={{
        backgroundColor: 'rgba(250, 250, 245, 0.95)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #E8E4DF',
      }}
    >
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-[#F0EDED] cursor-pointer"
      >
        <ArrowLeft className="w-5 h-5" style={{ color: 'var(--on-surface)' }} />
      </button>

      {/* Brand */}
      <img
        src="/Anantayu Logo.png"
        alt="Anantayu"
        className="h-7 w-auto"
      />

      {/* Language pill */}
      <button
        className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer"
        style={{
          backgroundColor: 'var(--surface-container)',
          color: 'var(--on-surface-variant)',
        }}
      >
        <Globe className="w-3.5 h-3.5" />
        EN
      </button>
    </div>
  );
}
