import React, { createContext, useState, useContext, useEffect } from 'react';
import en from '../locales/en.json';
import vi from '../locales/vi.json';
import fr from '../locales/fr.json';

type Language = 'en' | 'vi' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = { en, vi, fr };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('app_language') as Language;
    if (savedLang && ['en', 'vi', 'fr'].includes(savedLang)) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app_language', lang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let result: any = translations[language];
    
    // Support default English fallback if key is missing in other languages
    let fallbackResult: any = translations['en'];

    for (const k of keys) {
      if (result !== undefined) result = result[k];
      if (fallbackResult !== undefined) fallbackResult = fallbackResult[k];
    }
    
    if (result !== undefined) return result;
    if (fallbackResult !== undefined) return fallbackResult;
    
    // If not found in any language, return the last part of the key (e.g. "Broadcast Vision" instead of "projects.titles.Broadcast Vision")
    return keys[keys.length - 1];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
