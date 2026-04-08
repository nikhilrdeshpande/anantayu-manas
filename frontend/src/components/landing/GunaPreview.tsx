interface Guna {
  name: string;
  description: string;
  color: string;
  hoverBg: string;
  borderColor: string;
  secondaryColor: string;
}

const gunas: Guna[] = [
  {
    name: 'Sattva',
    description:
      'The quality of purity, harmony, and clarity. Sattva brings peace of mind, wisdom, and a natural inclination towards knowledge and truth.',
    color: '#7BA05B',
    hoverBg: '#466729',
    borderColor: '#7BA05B',
    secondaryColor: '#466729',
  },
  {
    name: 'Rajas',
    description:
      'The quality of energy, passion, and activity. Rajas drives ambition, desire, and the restless pursuit of goals and experiences.',
    color: '#D4A017',
    hoverBg: '#795900',
    borderColor: '#D4A017',
    secondaryColor: '#795900',
  },
  {
    name: 'Tamas',
    description:
      'The quality of stability, grounding, and rest. Tamas provides the necessary inertia for deep sleep, endurance, and physical strength.',
    color: '#5B6B7A',
    hoverBg: '#50606f',
    borderColor: '#5B6B7A',
    secondaryColor: '#50606f',
  },
];

export function GunaPreview() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left text */}
          <div className="lg:sticky lg:top-32">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#d4a017] mb-3">
              The Three Qualities
            </p>
            <h2 className="text-3xl md:text-4xl font-bold font-['Plus_Jakarta_Sans'] text-[#1c1b1b] mb-6 leading-tight">
              Understanding{' '}
              <br className="hidden md:block" />
              Your Gunas
            </h2>
            <p className="text-[#4f4634] leading-relaxed mb-6 max-w-md">
              In Ayurvedic psychology, every mind is a unique blend of three fundamental
              qualities called <strong>Gunas</strong>. Understanding your dominant Guna reveals
              your natural mental tendencies and the path to greater balance.
            </p>
            <p className="text-sm text-[#4f4634]/60 leading-relaxed max-w-md">
              Your Prakriti assessment maps your responses to these three qualities,
              giving you a personalized profile and actionable guidance.
            </p>
          </div>

          {/* Right cards */}
          <div className="space-y-5">
            {gunas.map((guna) => (
              <div
                key={guna.name}
                className="group relative bg-[#fcf9f8] rounded-2xl p-7 border border-[#e5e2e1] transition-all duration-400 hover:text-white cursor-default overflow-hidden"
                style={{
                  borderBottomWidth: '6px',
                  borderBottomColor: guna.borderColor,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = guna.hoverBg;
                  e.currentTarget.style.borderColor = guna.hoverBg;
                  e.currentTarget.style.borderBottomColor = guna.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '';
                  e.currentTarget.style.borderColor = '';
                  e.currentTarget.style.borderBottomColor = guna.borderColor;
                }}
              >
                {/* Guna dot + name */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: guna.color }}
                  />
                  <h3
                    className="text-xl font-bold font-['Plus_Jakarta_Sans'] transition-colors duration-400"
                    style={{ color: guna.color }}
                  >
                    {guna.name}
                  </h3>
                </div>

                <p className="text-sm leading-relaxed text-[#4f4634] group-hover:text-white/80 transition-colors duration-400">
                  {guna.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
