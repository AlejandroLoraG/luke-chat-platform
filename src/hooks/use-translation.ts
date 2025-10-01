import { useLanguage } from '@/contexts/language-context';

/**
 * Hook to access translations
 * Returns the translation object for the current language
 *
 * Usage:
 * const t = useTranslation();
 * return <h1>{t.header.title}</h1>
 */
export function useTranslation() {
  const { t } = useLanguage();
  return t;
}
