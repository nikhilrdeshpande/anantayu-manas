import { Link, useParams } from 'react-router-dom';
import { Heart } from 'lucide-react';

export function Footer() {
  const { locale = 'en' } = useParams<{ locale: string }>();

  const experienceLinks = [
    { label: 'Manas Prakriti Quiz', to: `/${locale}/assessment/intro` },
    { label: 'Personalized Plans', to: `/${locale}/insights` },
    { label: 'Daily Rituals', to: `/${locale}/insights` },
    { label: 'Track Progress', to: `/${locale}/profile` },
  ];

  const foundationLinks = [
    { label: 'About Anantayu', to: `/${locale}` },
    { label: 'The Science', to: `/${locale}/science` },
    { label: 'Consult an Expert', to: `/${locale}/pricing` },
    { label: 'Privacy Policy', to: `/${locale}` },
  ];

  return (
    <footer className="bg-[#f6f3f2]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand column */}
          <div className="md:col-span-2">
            <img
              src="/Anantayu Logo.png"
              alt="Anantayu"
              className="h-10 w-auto mb-3"
            />
            <p className="text-sm text-[#4f4634] leading-relaxed max-w-sm mb-6">
              Rooted in the timeless wisdom of Ayurveda, Anantayu guides you to understand your
              unique mental constitution and live in greater harmony.
            </p>
            <div className="flex items-center gap-4">
              {/* Social placeholders */}
              {['Twitter', 'Instagram', 'YouTube'].map((platform) => (
                <a
                  key={platform}
                  href="#"
                  className="text-xs font-medium text-[#4f4634]/60 hover:text-[#d4a017] transition-colors duration-200"
                >
                  {platform}
                </a>
              ))}
            </div>
          </div>

          {/* Experience column */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1c1b1b] mb-4">
              Experience
            </h4>
            <ul className="space-y-3">
              {experienceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-[#4f4634]/70 hover:text-[#d4a017] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Foundation column */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1c1b1b] mb-4">
              Foundation
            </h4>
            <ul className="space-y-3">
              {foundationLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-[#4f4634]/70 hover:text-[#d4a017] transition-colors duration-200"
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
      <div className="border-t border-[#e5e2e1]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-[#4f4634]/50">
            &copy; {new Date().getFullYear()} Anantayu. All rights reserved.
          </p>
          <p className="text-xs text-[#4f4634]/50 flex items-center gap-1">
            Made with <Heart size={12} className="text-[#d4a017]" /> for mindful living
          </p>
        </div>
      </div>
    </footer>
  );
}
