"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { en } from '@/locales/en';
import { es } from '@/locales/es';

// Supported languages
export type Language = 'en' | 'es';

// Translation dictionaries
const translations = {
  en,
  es,
} as const;

// Context type
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof en;
}

// Create context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Storage key
const STORAGE_KEY = 'chat-language';

/**
 * Detects the user's preferred language from browser settings
 * Falls back to English if no match found
 */
function detectBrowserLanguage(): Language {
  if (typeof window === 'undefined') return 'en';

  const browserLang = navigator.language.toLowerCase();

  // Check for Spanish variants (es, es-ES, es-MX, etc.)
  if (browserLang.startsWith('es')) {
    return 'es';
  }

  // Default to English
  return 'en';
}

/**
 * Loads saved language from localStorage or detects from browser
 */
function loadLanguage(): Language {
  if (typeof window === 'undefined') return 'en';

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'es') {
      return saved;
    }
  } catch (error) {
    console.warn('Failed to load language from localStorage:', error);
  }

  // If no saved language, detect from browser
  return detectBrowserLanguage();
}

/**
 * Saves language to localStorage
 */
function saveLanguage(lang: Language): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch (error) {
    console.warn('Failed to save language to localStorage:', error);
  }
}

/**
 * Language Provider Component
 * Manages language state and provides translations
 */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize language on mount (client-side only)
  useEffect(() => {
    const initialLanguage = loadLanguage();
    setLanguageState(initialLanguage);
    setIsInitialized(true);
  }, []);

  // Memoized setLanguage function that also persists to localStorage
  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    saveLanguage(lang);
  }, []);

  // Get current translations
  const currentTranslations = useMemo(() => translations[language], [language]);

  // Context value
  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: currentTranslations,
    }),
    [language, setLanguage, currentTranslations]
  );

  // Don't render until initialized to avoid hydration mismatch
  if (!isInitialized) {
    return null;
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * Hook to access language context
 * Must be used within LanguageProvider
 */
export function useLanguage() {
  const context = useContext(LanguageContext);

  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }

  return context;
}
