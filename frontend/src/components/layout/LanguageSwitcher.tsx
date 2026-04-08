import { useParams, useNavigate, useLocation } from 'react-router-dom';

const LOCALES = [
  { code: 'en', label: 'EN' },
  { code: 'hi', label: 'HI' },
  { code: 'mr', label: 'MR' },
] as const;

interface LanguageSwitcherProps {
  variant?: 'dark' | 'light';
}

export function LanguageSwitcher({ variant = 'dark' }: LanguageSwitcherProps) {
  const { locale = 'en' } = useParams<{ locale: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSwitch = (newLocale: string) => {
    if (newLocale === locale) return;
    // Replace the locale segment in the current path
    const pathParts = location.pathname.split('/');
    if (pathParts[1] && LOCALES.some((l) => l.code === pathParts[1])) {
      pathParts[1] = newLocale;
    } else {
      pathParts.splice(1, 0, newLocale);
    }
    navigate(pathParts.join('/') || '/');
  };

  const containerClass =
    variant === 'dark'
      ? 'bg-white/[0.08] backdrop-blur-xl border border-white/[0.1]'
      : 'bg-[#f6f3f2]/80 backdrop-blur-xl border border-[#e5e2e1]';

  return (
    <div className={`inline-flex items-center rounded-full p-1 gap-0.5 ${containerClass}`}>
      {LOCALES.map((l) => {
        const isActive = l.code === locale;
        return (
          <button
            key={l.code}
            onClick={() => handleSwitch(l.code)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
              isActive
                ? 'bg-[#d4a017] text-white shadow-sm'
                : variant === 'dark'
                  ? 'text-white/60 hover:text-white/90'
                  : 'text-[#4f4634]/60 hover:text-[#4f4634]/90'
            }`}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
}
