import { MessageCircle, Brain, Sun } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Step {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

const steps: Step[] = [
  {
    number: '01',
    title: 'Answer Honestly',
    description:
      '25 questions about how you actually think, react, and feel. No right answers - just your truth.',
    icon: MessageCircle,
  },
  {
    number: '02',
    title: 'Get Classified',
    description:
      'Our algorithm (from a real PhD thesis) maps you to 1 of 7 Prakriti types based on the Triguna framework from the Ashtanga Hridayam.',
    icon: Brain,
  },
  {
    number: '03',
    title: 'Act on It',
    description:
      'Get strengths, growth areas, and daily practices for your type. Want more? Unlock the deep assessment for 16 sub-types + a personalized wellness plan.',
    icon: Sun,
  },
];

export function HowItWorks() {
  return (
    <section className="bg-[#f6f3f2] py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#d4a017] mb-3">
            The Journey
          </p>
          <h2 className="text-3xl md:text-4xl font-bold font-['Plus_Jakarta_Sans'] text-[#1c1b1b] mb-4">
            How It Works
          </h2>
          <div className="w-16 h-1 bg-[#d4a017] rounded-full mx-auto" />
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="group relative bg-white rounded-2xl p-8 border border-[#e5e2e1] hover:-translate-y-2 transition-all duration-300 hover:shadow-xl hover:shadow-[#d4a017]/[0.05] cursor-default"
              >
                {/* Large faded number */}
                <span className="absolute top-4 right-6 text-7xl font-bold font-['Plus_Jakarta_Sans'] text-[#f0eded] select-none group-hover:text-[#d4a017]/10 transition-colors duration-300">
                  {step.number}
                </span>

                {/* Icon */}
                <div className="relative z-10 w-12 h-12 rounded-xl bg-[#d4a017]/10 flex items-center justify-center mb-6 group-hover:bg-[#d4a017]/20 transition-colors duration-300">
                  <Icon size={22} className="text-[#d4a017]" />
                </div>

                {/* Text */}
                <h3 className="relative z-10 text-lg font-bold font-['Plus_Jakarta_Sans'] text-[#1c1b1b] mb-3">
                  {step.title}
                </h3>
                <p className="relative z-10 text-sm text-[#4f4634] leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
