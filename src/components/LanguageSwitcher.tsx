import { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { scrollToElementById } from '../utils/scroll';

const MessageIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const MailIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const ArrowUpIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
);

export default function LanguageSwitcher({
  showQuoteButton = true,
  onOpenQuote,
  backToTopTargetId = 'portfolio-nav-dock'
}: {
  showQuoteButton?: boolean;
  onOpenQuote?: () => void;
  backToTopTargetId?: string;
}) {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    let rafId = 0;
    const handleScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        const shouldShow = window.scrollY > 750;
        setShowBackToTop((prev) => (prev !== shouldShow ? shouldShow : prev));
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const languages = [
    { code: 'en', label: 'EN', name: 'English' },
    { code: 'vi', label: 'VI', name: 'Tiếng Việt' },
    { code: 'fr', label: 'FR', name: 'Français' }
  ];

  const handleScrollUp = () => {
    const targetEl = document.getElementById(backToTopTargetId);
    if (targetEl) {
      void scrollToElementById(backToTopTargetId, 24);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="bottom-floating-controls no-print">
      <div className="floating-utility-dock">
        {showQuoteButton && (
          <button
            type="button"
            className="floating-contact-btn icon-btn quote-float-btn"
            onClick={() => {
              if (onOpenQuote) {
                onOpenQuote();
                return;
              }
              void scrollToElementById('section-Pricing & Services', 16);
            }}
            title={t('projects.tabs.Pricing & Services')}
            aria-label={t('projects.tabs.Pricing & Services')}
          >
            <span style={{ fontWeight: 800, fontSize: '14px' }}>$</span>
          </button>
        )}
        <a
          href="sms:+14389857846"
          className="floating-contact-btn icon-btn"
          title={t('about.textMe')}
          aria-label={t('about.textMe')}
        >
          <MessageIcon />
        </a>
        <button
          type="button"
          className="floating-contact-btn icon-btn"
          onClick={() => {
            void scrollToElementById('contact-section', 32);
          }}
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
                type="button"
                className={`lang-option ${language === lang.code ? 'active' : ''}`}
                onClick={() => {
                  setLanguage(lang.code as 'en' | 'vi' | 'fr');
                  setIsOpen(false);
                }}
                title={lang.name}
              >
                {lang.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="lang-toggle-btn"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Switch Language"
            aria-expanded={isOpen}
          >
            <span>{language.toUpperCase()}</span>
          </button>
        </div>

        {showBackToTop && (
          <button
            type="button"
            className="floating-contact-btn icon-btn back-to-top-pill"
            onClick={handleScrollUp}
            aria-label="Back to navigation"
            title="Back to navigation"
          >
            <ArrowUpIcon />
          </button>
        )}
      </div>
    </div>
  );
}
