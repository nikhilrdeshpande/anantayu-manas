import { Leaf, Zap, Mountain } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Guna {
  name: string;
  tagline: string;
  description: string;
  color: string;
  icon: LucideIcon;
}

const gunas: Guna[] = [
  {
    name: 'Sattva',
    tagline: 'Purity and Clarity',
    description: 'The state of balance, harmony, and enlightenment. It represents the quiet, focused mind capable of deep understanding.',
    color: '#7ba05b',
    icon: Leaf,
  },
  {
    name: 'Rajas',
    tagline: 'Energy and Action',
    description: 'The state of motion, passion, and change. When out of balance, it manifests as restlessness, ambition, and anxiety.',
    color: '#d4a017',
    icon: Zap,
  },
  {
    name: 'Tamas',
    tagline: 'Stability and Grounding',
    description: 'The state of inertia, darkness, and stability. Tamas provides necessary rest but can lead to lethargy when dominant.',
    color: '#5b6b7a',
    icon: Mountain,
  },
];

export function GunaPreview() {
  return (
    <section className="py-24 md:py-28 bg-white text-[#1c1b1b]">
      <div className="container mx-auto px-6 md:px-8 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 font-['Plus_Jakarta_Sans']">
            The Three Gunas
          </h2>
          <p className="text-lg text-[#4f4634]/70 max-w-2xl mx-auto">
            The fundamental forces that shape your consciousness and daily experience.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {gunas.map((guna) => {
            const Icon = guna.icon;
            return (
              <div
                key={guna.name}
                className="group border-2 rounded-2xl p-8 flex flex-col h-full transition-all duration-300 hover:-translate-y-1"
                style={{
                  borderColor: guna.color,
                  backgroundColor: 'transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${guna.color}0d`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div className="mb-6" style={{ color: guna.color }}>
                  <Icon size={36} />
                </div>
                <h3 className="text-3xl font-bold mb-3 font-['Plus_Jakarta_Sans']">
                  {guna.name}
                </h3>
                <p className="text-base font-medium mb-6" style={{ color: guna.color }}>
                  {guna.tagline}
                </p>
                <p className="text-[#4f4634]/70 leading-relaxed mb-8 flex-grow">
                  {guna.description}
                </p>
                <div className="h-1 w-12 rounded-full" style={{ backgroundColor: `${guna.color}4d` }} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
