import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type SupportedLocale } from '../lib/constants';

export function useLocale() {
  const { locale } = useParams<{ locale: string }>();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const currentLocale = (locale && SUPPORTED_LOCALES.includes(locale as SupportedLocale)
    ? locale
    : DEFAULT_LOCALE) as SupportedLocale;

  const changeLocale = useCallback(
    (newLocale: SupportedLocale) => {
      i18n.changeLanguage(newLocale);
      const path = window.location.pathname.replace(`/${currentLocale}`, `/${newLocale}`);
      navigate(path);
    },
    [currentLocale, i18n, navigate],
  );

  return { locale: currentLocale, changeLocale };
}
