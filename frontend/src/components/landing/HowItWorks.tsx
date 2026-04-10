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
    description: 'No right or wrong answers. Just 25 questions about how you actually think, react, and feel.',
    icon: MessageCircle,
  },
  {
    number: '02',
    title: 'Get Classified',
    description: 'Our PhD-backed algorithm maps your responses to 1 of 7 fundamental Manas Prakriti types.',
    icon: Brain,
  },
  {
    number: '03',
    title: 'Act on It',
    description: 'Get personalized recommendations for diet, lifestyle, and meditation tailored to your unique profile.',
    icon: Sun,
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 md:py-28 bg-[#fcf9f8] text-[#1c1b1b]">
      <div className="container mx-auto px-6 md:px-8 max-w-7xl">
        <h2 className="text-4xl lg:text-5xl font-bold mb-16 text-center font-['Plus_Jakarta_Sans']">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="bg-white p-10 rounded-2xl relative overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group card-lift"
              >
                {/* Watermark number */}
                <div className="absolute -top-4 -left-4 text-9xl font-black text-[#1c1b1b]/[0.04] group-hover:text-[#f6be39]/10 transition-colors font-['Plus_Jakarta_Sans'] leading-none select-none">
                  {step.number}
                </div>

                <div className="relative z-10 flex flex-col gap-6">
                  <div className="w-12 h-12 rounded-full bg-[#f6be39]/10 flex items-center justify-center">
                    <Icon size={22} className="text-[#d4a017]" />
                  </div>
                  <h3 className="text-2xl font-bold font-['Plus_Jakarta_Sans']">{step.title}</h3>
                  <p className="text-[#4f4634] leading-relaxed">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
