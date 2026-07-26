import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', label: 'EN', name: 'English' },
    { code: 'vi', label: 'VI', name: 'Tiếng Việt' },
    { code: 'fr', label: 'FR', name: 'Français' }
  ];

  return (
    <div className="bottom-floating-controls">
      <a 
        href="sms:+14389857846"
        className="floating-contact-btn"
        style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
      >
        {t('about.textMe')}
      </a>
      <button 
        className="floating-contact-btn"
        onClick={() => document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' })}
      >
        {t('about.contact')}
      </button>

      <div className={`lang-switcher-container ${isOpen ? 'open' : ''}`}>
        <div className="lang-menu">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`lang-option ${language === lang.code ? 'active' : ''}`}
              onClick={() => {
                setLanguage(lang.code as any);
                setIsOpen(false);
              }}
              title={lang.name}
            >
              {lang.label}
            </button>
          ))}
        </div>
        <button 
          className="lang-toggle-btn"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Switch Language"
        >
          <span>{language.toUpperCase()}</span>
        </button>
      </div>
    </div>
  );
}
