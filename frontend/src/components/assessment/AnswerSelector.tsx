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
              className="w-full py-4 rounded-2xl font-semibold text-base tracking-wide transition-all duration-150 active:scale-[0.97] cursor-pointer"
              style={{
                backgroundColor: isSelected ? colors.main : colors.main,
                color: '#FFFFFF',
                boxShadow: isSelected
                  ? `0 4px 16px ${colors.main}44`
                  : `0 2px 8px ${colors.main}22`,
                opacity: isSelected ? 1 : 0.85,
              }}
            >
              {label}
            </button>
          );
        }

        // SOMETIMES: bordered with section color, tinted bg
        if (value === 'sometimes') {
          return (
            <button
              key={value}
              onClick={() => onSelect(value)}
              className="w-full py-4 rounded-2xl font-semibold text-base tracking-wide transition-all duration-150 active:scale-[0.97] cursor-pointer"
              style={{
                backgroundColor: isSelected ? colors.tint : 'transparent',
                color: isSelected ? colors.dark : colors.main,
                border: `2px solid ${colors.main}`,
                opacity: isSelected ? 1 : 0.75,
              }}
            >
              {label}
            </button>
          );
        }

        // NO: light border, gray text
        return (
          <button
            key={value}
            onClick={() => onSelect(value)}
            className="w-full py-4 rounded-2xl font-semibold text-base tracking-wide transition-all duration-150 active:scale-[0.97] cursor-pointer"
            style={{
              backgroundColor: isSelected ? '#F5F0EB' : 'transparent',
              color: isSelected ? '#50606f' : '#9CA3AF',
              border: `2px solid ${isSelected ? '#C4C0BA' : '#E8E4DF'}`,
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
