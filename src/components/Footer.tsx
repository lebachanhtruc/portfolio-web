import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Footer({
  onOpenCvProfile,
  onOpenQuote
}: {
  onOpenCvProfile?: () => void;
  onOpenQuote?: () => void;
}) {
  const { t } = useLanguage();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('lebachanhtruc@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText('438-985-7846');
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  return (
    <footer className="footer-masterpiece footer-editorial">
      <div className="container footer-editorial-inner">
        <div className="footer-editorial-hero">
          <span className="footer-editorial-eyebrow">{t('footer.eyebrow')}</span>
          <h2 className="footer-editorial-headline">{t('footer.headline')}</h2>

          <div className="footer-editorial-actions">
            <a
              href="mailto:lebachanhtruc@gmail.com"
              onClick={handleCopyEmail}
              className="studio-btn-primary"
            >
              {copiedEmail ? t('about.copiedEmail') : t('about.sendEmail')}
            </a>
            <a
              href="sms:+14389857846"
              onClick={handleCopyPhone}
              className="studio-btn-ghost"
            >
              {copiedPhone ? t('about.copiedPhone') : t('about.sendSms')}
            </a>
          </div>
        </div>

        <div className="footer-editorial-bar">
          <p className="footer-editorial-copy">{t('footer.copy')}</p>
          <nav className="footer-editorial-links" aria-label="Footer navigation">
            <a
              href="https://www.linkedin.com/in/lebachanhtruc/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn ↗
            </a>
            <a
              href="https://github.com/lebachanhtruc"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub ↗
            </a>
            {onOpenCvProfile && (
              <button type="button" onClick={onOpenCvProfile}>
                {t('about.modes.cv')}
              </button>
            )}
            {onOpenQuote && (
              <button type="button" onClick={onOpenQuote}>
                {t('footer.rateCard')}
              </button>
            )}
          </nav>
        </div>
      </div>
    </footer>
  );
}
