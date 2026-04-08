import { useEffect, useState } from 'react';
import type { GunaType } from '../../types';

const COLORS: Record<GunaType, string> = {
  sattva: '#466729',
  rajas: '#d4a017',
  tamas: '#50606f',
};

interface GunaBarProps {
  guna: GunaType;
  percent: number;
}

export function GunaBar({ guna, percent }: GunaBarProps) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(percent), 200);
    return () => clearTimeout(timer);
  }, [percent]);

  const color = COLORS[guna];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <span
          className="text-[10px] uppercase tracking-widest font-semibold"
          style={{ color }}
        >
          {guna}
        </span>
        <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
          {Math.round(percent)}%
        </span>
      </div>
      <div
        className="h-1 w-full rounded-full"
        style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
      >
        <div
          className="h-1 rounded-full"
          style={{
            width: `${width}%`,
            backgroundColor: color,
            transition: 'width 0.8s ease-out',
          }}
        />
      </div>
    </div>
  );
}
