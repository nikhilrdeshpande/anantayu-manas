import { Link, useParams } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
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
    <header
      className="fixed top-0 w-full z-50 bg-[#131313]/60 glass-nav border-b border-white/[0.06]"
      style={{ boxShadow: '0 10px 30px rgba(246,190,57,0.05)' }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-4 flex items-center justify-between">
        {/* Brand - logo image */}
        <Link to={`/${locale}`} className="flex items-center shrink-0">
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
              className="text-xs uppercase tracking-widest text-white/60 hover:text-white transition-colors font-medium"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Auth - desktop */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to={`/${locale}/dashboard`} className="flex items-center gap-2 group">
                  <div className="w-8 h-8 rounded-full metallic-gold flex items-center justify-center text-[#402d00] text-sm font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-white/70 text-xs hidden lg:block group-hover:text-white transition-colors uppercase tracking-wider font-medium">
                    {user?.name}
                  </span>
                </Link>
                <button
                  onClick={logout}
                  className="text-white/40 hover:text-white text-xs uppercase tracking-wider transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to={`/${locale}/login`}
                className="px-6 py-2.5 rounded-full metallic-gold text-[#402d00] font-semibold text-sm hover:scale-[0.97] active:scale-95 transition-all shadow-lg shadow-[#d4a017]/20"
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
        <div className="md:hidden bg-[#131313]/95 glass-nav border-t border-white/[0.06] px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="block text-xs uppercase tracking-widest font-medium text-white/70 hover:text-white transition-colors py-1.5"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-3 border-t border-white/[0.06]">
            {isAuthenticated ? (
              <>
                <Link
                  to={`/${locale}/dashboard`}
                  className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors mb-3"
                  onClick={() => setMobileOpen(false)}
                >
                  <div className="w-6 h-6 rounded-full metallic-gold flex items-center justify-center text-[#402d00] text-xs font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  {user?.name}
                </Link>
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="block text-xs uppercase tracking-wider text-white/40 hover:text-white transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to={`/${locale}/login`}
                className="inline-block px-5 py-2 rounded-full metallic-gold text-[#402d00] font-semibold text-sm"
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
