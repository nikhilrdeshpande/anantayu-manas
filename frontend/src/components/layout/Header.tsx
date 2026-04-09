import { Link, useParams } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useAuthStore } from '../../stores/auth-store';

export function Header() {
  const { locale = 'en' } = useParams<{ locale: string }>();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();

  const navLinks = isAuthenticated
    ? [
        { label: 'Dashboard', to: `/${locale}/dashboard` },
        { label: 'Assessment', to: `/${locale}/assessment/intro` },
        { label: 'Go Deeper', to: `/${locale}/pricing` },
        { label: 'Science', to: `/${locale}/science` },
      ]
    : [
        { label: 'Home', to: `/${locale}` },
        { label: 'Assessment', to: `/${locale}/assessment/intro` },
        { label: 'Pricing', to: `/${locale}/pricing` },
        { label: 'Science', to: `/${locale}/science` },
      ];

  return (
    <header className="sticky top-0 z-50 bg-[#1A1A1A] border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Brand  - logo image */}
        <Link to={`/${locale}`} className="flex items-center gap-2 shrink-0">
          <img
            src="/anantayu-logo-dark.png"
            alt="Anantayu"
            className="h-9 w-auto"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="text-sm font-medium text-white/60 hover:text-white transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher variant="dark" />

          {/* Auth area - desktop */}
          <div className="hidden md:flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to={`/${locale}/dashboard`} className="flex items-center gap-2 group">
                  <div className="w-8 h-8 rounded-full bg-[#d4a017] flex items-center justify-center text-white text-sm font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-stone-300 text-sm hidden lg:block group-hover:text-white transition-colors">
                    {user?.name}
                  </span>
                </Link>
                <button
                  onClick={logout}
                  className="text-stone-400 hover:text-white text-sm transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to={`/${locale}/login`}
                className="text-[#d4a017] font-semibold text-sm hover:text-[#f6be39] transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white/70 hover:text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden bg-[#1A1A1A] border-t border-white/[0.06] px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="block text-sm font-medium text-white/70 hover:text-white transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {/* Auth links in mobile */}
          <div className="pt-3 border-t border-white/[0.06]">
            {isAuthenticated ? (
              <>
                <Link
                  to={`/${locale}/dashboard`}
                  className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors mb-3"
                  onClick={() => setMobileOpen(false)}
                >
                  <div className="w-6 h-6 rounded-full bg-[#d4a017] flex items-center justify-center text-white text-xs font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  {user?.name}
                </Link>
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="block text-sm text-stone-400 hover:text-white transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to={`/${locale}/login`}
                className="block text-sm font-semibold text-[#d4a017] hover:text-[#f6be39] transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
