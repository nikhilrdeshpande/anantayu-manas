interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
}

export function ProgressBar({ value, max = 100, color = 'var(--primary)' }: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--surface-container-high)' }}>
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{ width: `${percentage}%`, backgroundColor: color }}
      />
    </div>
  );
}
