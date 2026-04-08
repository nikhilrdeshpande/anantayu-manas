import type { GunaType, PrakritiType } from '../types';

export const GUNA_COLORS: Record<GunaType, { main: string; tint: string }> = {
  sattva: { main: 'var(--sattva)', tint: 'var(--sattva-tint)' },
  rajas: { main: 'var(--rajas)', tint: 'var(--rajas-tint)' },
  tamas: { main: 'var(--tamas)', tint: 'var(--tamas-tint)' },
};

export const SECTION_ORDER: GunaType[] = ['sattva', 'rajas', 'tamas'];

export const SECTION_CONFIG: Record<GunaType, { labelKey: string; questions: number; label: string; subtitle: string }> = {
  sattva: { labelKey: 'assessment:sections.sattva', questions: 10, label: 'Sattva', subtitle: 'Purity & Balance' },
  rajas: { labelKey: 'assessment:sections.rajas', questions: 10, label: 'Rajas', subtitle: 'Energy & Action' },
  tamas: { labelKey: 'assessment:sections.tamas', questions: 5, label: 'Tamas', subtitle: 'Stability & Grounding' },
};

export const PRAKRITI_TYPES: Record<PrakritiType, { nameKey: string; archetypeKey: string }> = {
  vata: { nameKey: 'results:types.vata.name', archetypeKey: 'results:types.vata.archetype' },
  pitta: { nameKey: 'results:types.pitta.name', archetypeKey: 'results:types.pitta.archetype' },
  kapha: { nameKey: 'results:types.kapha.name', archetypeKey: 'results:types.kapha.archetype' },
  'vata-pitta': { nameKey: 'results:types.vata-pitta.name', archetypeKey: 'results:types.vata-pitta.archetype' },
  'pitta-kapha': { nameKey: 'results:types.pitta-kapha.name', archetypeKey: 'results:types.pitta-kapha.archetype' },
  'vata-kapha': { nameKey: 'results:types.vata-kapha.name', archetypeKey: 'results:types.vata-kapha.archetype' },
  tridoshic: { nameKey: 'results:types.tridoshic.name', archetypeKey: 'results:types.tridoshic.archetype' },
};

export const SUPPORTED_LOCALES = ['en', 'hi', 'sa'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: SupportedLocale = 'en';
