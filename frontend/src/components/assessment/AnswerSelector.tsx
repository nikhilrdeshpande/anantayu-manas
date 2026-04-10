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

        return (
          <button
            key={value}
            onClick={() => onSelect(value)}
            className="w-full py-4 rounded-xl font-bold text-base tracking-wider transition-all duration-150 active:scale-[0.97] cursor-pointer"
            style={{
              backgroundColor: isSelected ? `${colors.main}1f` : 'transparent',
              color: isSelected ? colors.main : '#d3c5ae',
              border: `2px solid ${isSelected ? colors.main : '#4f4634'}`,
              boxShadow: isSelected ? `0 0 0 4px ${colors.main}1a` : 'none',
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
