import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const MessageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

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
        className="floating-contact-btn icon-btn"
        title={t('about.textMe')}
        aria-label={t('about.textMe')}
      >
        <MessageIcon />
      </a>
      <button 
        className="floating-contact-btn icon-btn"
        onClick={() => document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' })}
        title={t('about.contact')}
        aria-label={t('about.contact')}
      >
        <MailIcon />
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
