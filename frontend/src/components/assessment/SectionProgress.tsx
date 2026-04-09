import { SECTION_ORDER, SECTION_CONFIG, DEEP_SECTION_CONFIG } from '../../lib/constants';
import { useAssessmentStore } from '../../stores/assessment-store';
import type { GunaType } from '../../types';

const SECTION_COLORS: Record<GunaType, string> = {
  sattva: '#7BA05B',
  rajas: '#D4A017',
  tamas: '#5B6B7A',
};

interface SectionProgressProps {
  currentGlobalIndex: number;
  sectionProgress: { sattva: number; rajas: number; tamas: number };
}

export function SectionProgress({ currentGlobalIndex, sectionProgress }: SectionProgressProps) {
  const assessmentType = useAssessmentStore((s) => s.assessmentType);
  const config = assessmentType === 'deep' ? DEEP_SECTION_CONFIG : SECTION_CONFIG;

  // Determine current section
  let cumulative = 0;
  let currentSection: GunaType = 'sattva';
  for (const s of SECTION_ORDER) {
    if (currentGlobalIndex < cumulative + config[s].questions) {
      currentSection = s;
      break;
    }
    cumulative += config[s].questions;
  }

  return (
    <div className="flex gap-1.5 w-full">
      {SECTION_ORDER.map((section) => {
        const total = config[section].questions;
        const answered = sectionProgress[section];
        const color = SECTION_COLORS[section];

        const sectionIdx = SECTION_ORDER.indexOf(section);
        const currentIdx = SECTION_ORDER.indexOf(currentSection);

        const isComplete = sectionIdx < currentIdx || answered >= total;
        const isCurrent = section === currentSection;
        const fillPct = isComplete ? 100 : isCurrent ? (answered / total) * 100 : 0;

        return (
          <div
            key={section}
            className="flex-1 h-1.5 rounded-full overflow-hidden"
            style={{ backgroundColor: '#E8E4DF' }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${fillPct}%`,
                backgroundColor: color,
                transition: 'width 400ms ease-out',
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
