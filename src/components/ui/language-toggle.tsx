"use client";

import { Languages } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useLanguage, type Language } from '@/contexts/language-context';

/**
 * Language Toggle Component
 * Allows users to switch between English and Spanish
 */
export function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = (value: string) => {
    if (value === 'en' || value === 'es') {
      setLanguage(value as Language);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Languages className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
      <ToggleGroup
        type="single"
        value={language}
        onValueChange={handleLanguageChange}
        aria-label={t.language.selectLanguage}
        className="gap-0 border border-border rounded-md overflow-hidden h-9"
      >
        <ToggleGroupItem
          value="en"
          aria-label="English"
          className="h-9 px-3 text-xs font-medium data-[state=on]:bg-primary data-[state=on]:text-primary-foreground rounded-none border-r border-border"
        >
          {t.language.english}
        </ToggleGroupItem>
        <ToggleGroupItem
          value="es"
          aria-label="Español"
          className="h-9 px-3 text-xs font-medium data-[state=on]:bg-primary data-[state=on]:text-primary-foreground rounded-none"
        >
          {t.language.spanish}
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
