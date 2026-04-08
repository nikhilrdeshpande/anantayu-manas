import { useAssessmentStore } from '../stores/assessment-store';

export function useAssessment() {
  return useAssessmentStore();
}
