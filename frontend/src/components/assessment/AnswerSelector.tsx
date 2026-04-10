import type { AnswerValue, GunaType } from '../../types';

const SECTION_COLORS: Record<GunaType, { main: string; tint: string; dark: string }> = {
  sattva: { main: '#7BA05B', tint: '#eff5eb', dark: '#466729' },
  rajas: { main: '#D4A017', tint: '#fdf6e3', dark: '#8B6914' },
  tamas: { main: '#5B6B7A', tint: '#f0f2f4', dark: '#50606f' },
};

interface AnswerSelectorProps {
  currentSection: GunaType;
  selectedAnswer: AnswerValue | undefined;
  onSelect: (answer: AnswerValue) => void;
}

export function AnswerSelector({ currentSection, selectedAnswer, onSelect }: AnswerSelectorProps) {
  const colors = SECTION_COLORS[currentSection];

  const buttons: { value: AnswerValue; label: string }[] = [
    { value: 'yes', label: 'YES' },
    { value: 'sometimes', label: 'SOMETIMES' },
    { value: 'no', label: 'NO' },
  ];

  return (
    <div className="flex flex-col gap-3 w-full">
      {buttons.map(({ value, label }) => {
        const isSelected = selectedAnswer === value;

        // YES: filled with section color
        if (value === 'yes') {
          return (
            <button
              key={value}
              onClick={() => onSelect(value)}
              className="w-full py-4 rounded-xl font-bold text-base tracking-wider transition-all duration-150 active:scale-[0.97] cursor-pointer"
              style={{
                backgroundColor: colors.main,
                color: '#FFFFFF',
                boxShadow: isSelected
                  ? `0 8px 24px ${colors.main}55`
                  : `0 4px 12px ${colors.main}33`,
                opacity: isSelected ? 1 : 0.92,
              }}
            >
              {label}
            </button>
          );
        }

        // SOMETIMES: bordered with section color
        if (value === 'sometimes') {
          return (
            <button
              key={value}
              onClick={() => onSelect(value)}
              className="w-full py-4 rounded-xl font-bold text-base tracking-wider transition-all duration-150 active:scale-[0.97] cursor-pointer"
              style={{
                backgroundColor: isSelected ? `${colors.main}1a` : 'transparent',
                color: colors.main,
                border: `2px solid ${colors.main}`,
              }}
            >
              {label}
            </button>
          );
        }

        // NO: subtle dark
        return (
          <button
            key={value}
            onClick={() => onSelect(value)}
            className="w-full py-4 rounded-xl font-bold text-base tracking-wider transition-all duration-150 active:scale-[0.97] cursor-pointer"
            style={{
              backgroundColor: isSelected ? 'rgba(255,255,255,0.08)' : 'transparent',
              color: isSelected ? '#e5e2e1' : '#9b8f7a',
              border: `2px solid ${isSelected ? '#9b8f7a' : '#4f4634'}`,
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
