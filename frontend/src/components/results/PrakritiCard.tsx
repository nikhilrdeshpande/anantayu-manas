import { GunaChart } from './GunaChart';
import { GunaBar } from './GunaBar';
import type { SattvaBalaGrade } from '../../types';

interface PrakritiCardProps {
  prakritiType: string;
  archetypeTitle: string;
  sattvaPercent: number;
  rajasPercent: number;
  tamasPercent: number;
  sattvaBala: SattvaBalaGrade;
  traits: string[];
}

const BALA_LABELS: Record<SattvaBalaGrade, string> = {
  pravara: 'Superior',
  madhya: 'Moderate',
  avara: 'Developing',
};

export function PrakritiCard({
  prakritiType,
  archetypeTitle,
  sattvaPercent,
  rajasPercent,
  tamasPercent,
  sattvaBala,
  traits,
}: PrakritiCardProps) {
  return (
    <div
      className="w-full max-w-[420px] mx-auto rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-5"
      style={{
        backgroundColor: '#1a1a1a',
        border: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Label */}
      <span
        className="text-[10px] uppercase tracking-[0.25em] font-semibold"
        style={{ color: '#d4a017' }}
      >
        Manas Prakriti
      </span>

      {/* Donut chart */}
      <GunaChart
        sattvaPercent={sattvaPercent}
        rajasPercent={rajasPercent}
        tamasPercent={tamasPercent}
        size={192}
      />

      {/* Prakriti type name */}
      <h2 className="text-xl font-bold uppercase tracking-wider text-center text-white">
        {prakritiType}
      </h2>

      {/* Archetype */}
      <p className="text-sm italic" style={{ color: '#d4a017' }}>
        {archetypeTitle}
      </p>

      {/* Trait pills */}
      <div className="flex flex-wrap justify-center gap-2">
        {traits.map((trait) => (
          <span
            key={trait}
            className="px-3 py-1 rounded-full text-xs text-white"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
          >
            {trait}
          </span>
        ))}
      </div>

      {/* Guna bars */}
      <div className="w-full flex flex-col gap-3 mt-2">
        <GunaBar guna="sattva" percent={sattvaPercent} />
        <GunaBar guna="rajas" percent={rajasPercent} />
        <GunaBar guna="tamas" percent={tamasPercent} />
      </div>

      {/* Mental Strength badge */}
      <div
        className="flex items-center gap-2 px-4 py-2 rounded-lg mt-1"
        style={{
          backgroundColor: 'rgba(212,160,23,0.1)',
          border: '1px solid rgba(212,160,23,0.3)',
        }}
      >
        <span className="text-[10px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Mental Strength
        </span>
        <span className="text-sm font-semibold" style={{ color: '#d4a017' }}>
          {sattvaBala.charAt(0).toUpperCase() + sattvaBala.slice(1)}  - {BALA_LABELS[sattvaBala]}
        </span>
      </div>

      {/* Footer */}
      <span className="text-[10px] mt-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
        anantayu.com/prakriti
      </span>
    </div>
  );
}
