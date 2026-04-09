import { BookOpen, Brain, Shield, Sparkles } from 'lucide-react';

const FACTS = [
  { icon: Brain, label: '25 Questions' },
  { icon: Sparkles, label: '7 Prakriti Types' },
  { icon: BookOpen, label: '3,000+ Year-Old Science' },
  { icon: Shield, label: 'PhD-Backed' },
];

export function SocialProofBar() {
  return (
    <div className="bg-[#1A1A1A] py-4 px-6">
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-6 md:gap-10 flex-wrap">
        {FACTS.map((f, i) => (
          <div key={i} className="flex items-center gap-2">
            <f.icon size={14} className="text-[#d4a017]" />
            <span className="text-xs text-white/70 font-medium">{f.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
