import { Link, useParams } from 'react-router-dom';

export function Footer() {
  const { locale = 'en' } = useParams<{ locale: string }>();

  const experienceLinks = [
    { label: 'Manas Prakriti Quiz', to: `/${locale}/assessment/intro` },
    { label: 'Deep Assessment', to: `/${locale}/pricing` },
    { label: 'The Science', to: `/${locale}/science` },
    { label: 'Track Progress', to: `/${locale}/dashboard` },
  ];

  const foundationLinks = [
    { label: 'About Anantayu', to: `/${locale}/about` },
    { label: 'FAQ', to: `/${locale}/faq` },
    { label: 'Privacy Policy', to: `/${locale}/privacy` },
    { label: 'Terms of Service', to: `/${locale}/terms` },
  ];

  return (
    <footer className="w-full bg-[#131313] border-t border-[#4f4634]/15 text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand column */}
          <div className="md:col-span-2">
            <span className="text-2xl font-bold tracking-tighter text-[#f6be39] font-['Plus_Jakarta_Sans'] mb-3 inline-block">
              Anantayu
            </span>
            <p className="text-sm text-white/50 leading-relaxed max-w-sm mb-6">
              Ancient Wisdom, Scientific Precision. Bridging millennia of Ayurvedic knowledge for modern mental wellness.
            </p>
            <p className="text-xs text-white/30">
              Based on PhD research by Dr. Prasad Akolkar, University of Mumbai
            </p>
          </div>

          {/* Experience column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#f6be39] mb-5">
              Experience
            </h4>
            <ul className="space-y-3">
              {experienceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/50 hover:text-[#f6be39] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Foundation column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#f6be39] mb-5">
              Foundation
            </h4>
            <ul className="space-y-3">
              {foundationLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/50 hover:text-[#f6be39] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-white/30">
            &copy; 2025-{new Date().getFullYear()} Anantayu. Ancient Wisdom, Scientific Precision.
          </p>
          <p className="text-xs text-white/30">
            Made with care for mindful living
          </p>
        </div>
      </div>
    </footer>
  );
}
