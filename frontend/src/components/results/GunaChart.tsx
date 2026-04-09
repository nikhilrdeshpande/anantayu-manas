import { useEffect, useState } from 'react';

interface GunaChartProps {
  sattvaPercent: number;
  rajasPercent: number;
  tamasPercent: number;
  size?: number;
}

export function GunaChart({
  sattvaPercent,
  rajasPercent,
  tamasPercent,
  size = 192,
}: GunaChartProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Normalize to 100%
  const total = sattvaPercent + rajasPercent + tamasPercent;
  const sNorm = total > 0 ? (sattvaPercent / total) * 100 : 33.33;
  const rNorm = total > 0 ? (rajasPercent / total) * 100 : 33.33;
  void (total > 0 ? (tamasPercent / total) * 100 : 33.34); // tNorm computed implicitly via conic-gradient

  // Find dominant guna
  const dominant =
    sattvaPercent >= rajasPercent && sattvaPercent >= tamasPercent
      ? { label: 'Sattva', pct: Math.round(sattvaPercent), color: '#466729' }
      : rajasPercent >= tamasPercent
        ? { label: 'Rajas', pct: Math.round(rajasPercent), color: '#d4a017' }
        : { label: 'Tamas', pct: Math.round(tamasPercent), color: '#50606f' };

  const conicGradient = animated
    ? `conic-gradient(#466729 0% ${sNorm}%, #d4a017 ${sNorm}% ${sNorm + rNorm}%, #50606f ${sNorm + rNorm}% 100%)`
    : `conic-gradient(#466729 0% 0%, #d4a017 0% 0%, #50606f 0% 100%)`;

  const innerSize = size * 0.6;

  return (
    <div
      className="relative rounded-full"
      style={{
        width: size,
        height: size,
        background: conicGradient,
        transition: 'background 1s ease-out',
      }}
    >
      {/* Inner mask */}
      <div
        className="absolute rounded-full flex flex-col items-center justify-center"
        style={{
          width: innerSize,
          height: innerSize,
          top: (size - innerSize) / 2,
          left: (size - innerSize) / 2,
          backgroundColor: '#1a1a1a',
        }}
      >
        <span
          className="text-3xl font-bold"
          style={{ color: dominant.color }}
        >
          {dominant.pct}%
        </span>
        <span
          className="text-[10px] uppercase tracking-widest mt-0.5"
          style={{ color: 'rgba(255,255,255,0.5)' }}
        >
          {dominant.label}
        </span>
      </div>
    </div>
  );
}
