import { MessageCircle, GraduationCap, Clock, UserCheck } from 'lucide-react';

interface ConsultationCTAProps {
  prakritiType?: string;
  variant?: 'full' | 'compact';
}

const WHATSAPP_NUMBER = import.meta.env.VITE_CONSULTATION_WHATSAPP || '919999999999';

export function ConsultationCTA({ prakritiType, variant = 'full' }: ConsultationCTAProps) {
  const message = prakritiType
    ? `Hi Dr. Akolkar, I just completed the Manas Prakriti deep assessment on Anantayu. My prakriti type is ${prakritiType}. I'd like to book a personalized consultation.`
    : `Hi Dr. Akolkar, I'd like to book a Manas Prakriti consultation on Anantayu.`;

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3 p-4 bg-[#1A1A1A] rounded-xl">
        <div className="w-10 h-10 rounded-full bg-[#d4a017]/20 flex items-center justify-center flex-shrink-0">
          <GraduationCap size={18} className="text-[#d4a017]" />
        </div>
        <div className="flex-1">
          <p className="text-white text-sm font-medium">Speak to the expert</p>
          <p className="text-white/50 text-xs">1-on-1 with Dr. Prasad Akolkar</p>
        </div>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-full bg-[#25D366] text-white text-xs font-semibold flex items-center gap-1.5 hover:opacity-90 transition-opacity"
        >
          <MessageCircle size={12} />
          Book
        </a>
      </div>
    );
  }

  return (
    <div className="bg-[#1A1A1A] rounded-2xl p-6 text-center">
      {/* Dr. Akolkar intro */}
      <div className="w-16 h-16 rounded-full bg-[#d4a017]/20 flex items-center justify-center mx-auto mb-4">
        <GraduationCap size={28} className="text-[#d4a017]" />
      </div>
      <h3 className="text-lg font-bold text-white font-[family-name:var(--font-heading)] mb-1">
        Consult the Expert
      </h3>
      <p className="text-[#d4a017] text-sm font-medium mb-3">
        Dr. Prasad Akolkar
      </p>
      <p className="text-white/60 text-xs mb-1">
        PhD, Ayurvedic Psychology  - University of Mumbai
      </p>
      <p className="text-white/70 text-sm leading-relaxed mb-5 max-w-sm mx-auto">
        Get personalized guidance from the researcher behind this assessment.
        Discuss your prakriti report, ask questions, and receive tailored wellness advice.
      </p>

      {/* Trust signals */}
      <div className="flex items-center justify-center gap-4 mb-5 text-xs text-white/40">
        <div className="flex items-center gap-1">
          <GraduationCap size={12} />
          <span>PhD Researcher</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={12} />
          <span>30-min session</span>
        </div>
        <div className="flex items-center gap-1">
          <UserCheck size={12} />
          <span>Personalized</span>
        </div>
      </div>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white font-semibold text-sm hover:opacity-90 transition-opacity"
      >
        <MessageCircle size={16} />
        Book via WhatsApp
      </a>

      <p className="text-white/30 text-xs mt-3">
        Opens WhatsApp with a pre-filled message
      </p>
    </div>
  );
}
