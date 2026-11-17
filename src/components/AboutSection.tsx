import React, { useRef, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const PhoneIcon = () => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const LocationIcon = () => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const MailIcon = () => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const LinkIcon = () => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>
);

const BatteryIcon = () => (
  <svg aria-hidden="true" width="20" height="12" viewBox="0 0 24 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '4px' }}>
    <rect x="1" y="1" width="20" height="12" rx="2" ry="2"></rect>
    <line x1="23" y1="5" x2="23" y2="9"></line>
    <rect x="3" y="3" width="12" height="8" fill="currentColor"></rect>
  </svg>
);

interface ContactBlockProps {
  areaText: string;
  copiedPhone: boolean;
  copiedEmail: boolean;
  onCopyPhone: () => void;
  onCopyEmail: () => void;
  smsLabel: string;
  copiedPhoneLabel: string;
  emailLabel: string;
  copiedEmailLabel: string;
  linkedinLabel?: string;
  githubLabel?: string;
}

function DirectContactList({
  areaText,
  copiedPhone,
  copiedEmail,
  onCopyPhone,
  onCopyEmail,
  smsLabel,
  copiedPhoneLabel,
  emailLabel,
  copiedEmailLabel,
  linkedinLabel,
  githubLabel
}: ContactBlockProps) {
  return (
    <ul className="contact-list">
      <li>
        <PhoneIcon />
        <a
          href="sms:+14389857846"
          onClick={onCopyPhone}
          style={{ color: 'inherit', textDecoration: 'none' }}
        >
          <span>{copiedPhone ? copiedPhoneLabel : smsLabel}</span>
        </a>
      </li>
      <li>
        <LocationIcon />
        <span>{areaText}</span>
      </li>
      <li>
        <MailIcon />
        <a
          href="mailto:lebachanhtruc@gmail.com"
          onClick={onCopyEmail}
          style={{ color: 'inherit', textDecoration: 'none' }}
        >
          <span className="highlight-box">
            {copiedEmail ? copiedEmailLabel : emailLabel}
          </span>
        </a>
      </li>
      {linkedinLabel && githubLabel && (
        <li className="builder-social-links">
          <LinkIcon />
          <div className="builder-social-row">
            <a
              href="https://www.linkedin.com/in/lebachanhtruc/"
              target="_blank"
              rel="noopener noreferrer"
              className="builder-inline-chip"
            >
              {linkedinLabel}
            </a>
            <a
              href="https://github.com/lebachanhtruc"
              target="_blank"
              rel="noopener noreferrer"
              className="builder-inline-chip"
            >
              {githubLabel}
            </a>
          </div>
        </li>
      )}
    </ul>
  );
}

const LIVE_DEMO_URL = 'https://enterprise-payroll.vercel.app/';
const NOTION_CASE_URL =
  'https://helix-saffron-268.notion.site/Ba-Chanh-Truc-Le-Product-Owner-Portfolio-3a59fce0d40680e3981bea63e19586e2';
const LOOM_WALKTHROUGH_URL = 'https://www.loom.com/share/1e467bf8ae8043ccbd5027abcdcb82c0';

interface AboutSectionProps {
  profileMode: 'agency' | 'cv';
  onProfileModeChange: (mode: 'agency' | 'cv') => void;
}

export default function AboutSection({ profileMode, onProfileModeChange }: AboutSectionProps) {
  const { t, translations } = useLanguage();
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const agencyTabRef = useRef<HTMLButtonElement>(null);
  const cvTabRef = useRef<HTMLButtonElement>(null);

  const handleCopyPhone = () => {
    navigator.clipboard.writeText('438-985-7846');
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('lebachanhtruc@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === 'Home' || e.key === 'End') {
      e.preventDefault();
      let nextMode: 'agency' | 'cv';
      if (e.key === 'Home') {
        nextMode = 'agency';
      } else if (e.key === 'End') {
        nextMode = 'cv';
      } else {
        nextMode = profileMode === 'agency' ? 'cv' : 'agency';
      }
      onProfileModeChange(nextMode);
      (nextMode === 'agency' ? agencyTabRef.current : cvTabRef.current)?.focus();
    }
  };

  const scrollToQuote = () => {
    document
      .getElementById('section-Pricing & Services')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  const agencyPillars = translations.about.modes.pillars;
  const builder = translations.about.builder;

  const portraitSrc =
    '/Media/AI Graphic Design and Photo Shoot/Project 10 - food photography and ai poster create/June_17_2023_-_SHUSHU_202607251246.jpeg'
      .split('/')
      .map((segment) => encodeURIComponent(segment))
      .join('/');

  return (
    <section className="about-viewfinder-section relative" id="about-studio">
      <div className="section-transition-gradient"></div>

      {/* Viewfinder Overlay Elements */}
      <div className="viewfinder-overlay">
        <div className="vf-top-left">
          <span>ISO 400</span>
          <span>F3.3</span>
          <span className="battery-stat">
            <BatteryIcon /> 65%
          </span>
          <span className="auto-mode">AUTO</span>
        </div>
        <div className="vf-top-right">
          <span className="rec-dot"></span> REC
        </div>

        <div className="vf-corner vf-tl"></div>
        <div className="vf-corner vf-tr"></div>
        <div className="vf-corner vf-bl"></div>
        <div className="vf-corner vf-br"></div>

        <div className="vf-focus-center">
          <div className="focus-bracket left"></div>
          <div className="focus-bracket right"></div>
        </div>
      </div>

      <div className="container relative z-10">
        {/* Clean Separation Toggle between F&B Studio Agency and Product Builder Resume */}
        <div className="profile-mode-bar">
          <div className="profile-mode-pills" role="tablist" aria-label="Profile mode">
            <button
              ref={agencyTabRef}
              id="profile-tab-agency"
              type="button"
              role="tab"
              aria-selected={profileMode === 'agency'}
              tabIndex={profileMode === 'agency' ? 0 : -1}
              className={`profile-mode-btn ${profileMode === 'agency' ? 'active' : ''}`}
              onClick={() => onProfileModeChange('agency')}
              onKeyDown={handleTabKeyDown}
            >
              🎬 {t('about.modes.agency')}
            </button>
            <button
              ref={cvTabRef}
              id="profile-tab-cv"
              type="button"
              role="tab"
              aria-selected={profileMode === 'cv'}
              tabIndex={profileMode === 'cv' ? 0 : -1}
              className={`profile-mode-btn ${profileMode === 'cv' ? 'active' : ''}`}
              onClick={() => onProfileModeChange('cv')}
              onKeyDown={handleTabKeyDown}
            >
              🛠️ {t('about.modes.cv')}
            </button>
          </div>
        </div>

        {profileMode === 'agency' ? (
          <div
            id="profile-panel-agency"
            role="tabpanel"
            aria-labelledby="profile-tab-agency"
          >
            <div className="agency-overview-grid" id="contact-section">
              <div className="agency-hero-column">
                <span className="agency-kicker">{t('about.modes.badgeAgency')}</span>
                <h2 className="agency-headline">{t('about.modes.agencyHeadline')}</h2>
                <p className="agency-lead">{t('about.modes.agencyLead')}</p>

                <div className="agency-pillars-grid">
                  {agencyPillars.map((item, idx) => (
                    <div key={idx} className="agency-pillar-card">
                      <span className="pillar-num">0{idx + 1}</span>
                      <h3>{item.title}</h3>
                      <p>{item.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="agency-cta-row">
                  <button type="button" className="agency-btn-primary" onClick={scrollToQuote}>
                    {t('about.modes.ctaViewQuote')}
                  </button>
                  <button
                    type="button"
                    className="agency-btn-secondary"
                    onClick={() => onProfileModeChange('cv')}
                  >
                    {t('about.modes.ctaSwitchCv')}
                  </button>
                </div>
              </div>

              <div className="agency-contact-column">
                <div className="creative-portrait-container agency-portrait-box">
                  <div className="film-strip-decoration"></div>
                  <img
                    src={portraitSrc}
                    alt="TYM Production Showcase"
                    className="film-portrait-new"
                    width={1071}
                    height={1920}
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                <div className="agency-direct-box">
                  <h3 className="section-title" style={{ marginTop: '1.5rem' }}>
                    {t('about.contact')}
                  </h3>
                  <DirectContactList
                    areaText={t('about.modes.agencyAreasValue')}
                    copiedPhone={copiedPhone}
                    copiedEmail={copiedEmail}
                    onCopyPhone={handleCopyPhone}
                    onCopyEmail={handleCopyEmail}
                    smsLabel={t('about.sendSms')}
                    copiedPhoneLabel={t('about.copiedPhone')}
                    emailLabel={t('about.sendEmail')}
                    copiedEmailLabel={t('about.copiedEmail')}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            id="profile-panel-cv"
            role="tabpanel"
            aria-labelledby="profile-tab-cv"
            className="builder-profile-shell"
          >
            <div className="cv-switch-banner">
              <span className="agency-kicker">{t('about.modes.badgeCv')}</span>
              <button
                type="button"
                className="agency-btn-secondary"
                onClick={() => onProfileModeChange('agency')}
              >
                {t('about.modes.ctaSwitchAgency')}
              </button>
            </div>

            {/* 1. Positioning Header & Impact Metrics */}
            <div className="builder-intro-block">
              <h2 className="agency-headline">{builder.headline}</h2>
              <p className="agency-lead">{builder.lead}</p>

              <aside className="builder-honest-callout">
                <span className="builder-callout-label">{builder.approachLabel}</span>
                <p>{builder.approachText}</p>
              </aside>

              <ul className="builder-metrics-grid">
                {builder.metrics.map((metric, idx) => (
                  <li key={idx} className="builder-metric-card">
                    <span className="builder-metric-value">{metric.value}</span>
                    <span className="builder-metric-label">{metric.label}</span>
                    <span className="builder-metric-sub">{metric.sub}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 2. Flagship Work Sample Spotlight: Lime Payroll Enterprise */}
            <article className="builder-flagship-card">
              <header className="builder-flagship-header">
                <div className="builder-flagship-title-wrap">
                  <span className="builder-flagship-badge">{builder.spotlight.badge}</span>
                  <h3>{builder.spotlight.title}</h3>
                  <span className="builder-flagship-period">{builder.spotlight.period}</span>
                </div>
                <p className="builder-flagship-summary">{builder.spotlight.summary}</p>
              </header>

              <div className="builder-arch-grid">
                {builder.spotlight.cards.map((card, idx) => (
                  <article key={idx} className="builder-arch-card">
                    <span className="builder-arch-tag">{card.tag}</span>
                    <h4>{card.title}</h4>
                    <p>{card.desc}</p>
                  </article>
                ))}
              </div>

              <footer className="builder-flagship-footer">
                <div className="builder-flagship-actions">
                  <a
                    href={LIVE_DEMO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="agency-btn-primary builder-link-btn"
                  >
                    {builder.spotlight.ctaDemo}
                  </a>
                  <a
                    href={NOTION_CASE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="agency-btn-secondary builder-link-btn"
                  >
                    {builder.spotlight.ctaNotion}
                  </a>
                  <a
                    href={LOOM_WALKTHROUGH_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="agency-btn-secondary builder-link-btn"
                  >
                    {builder.spotlight.ctaLoom}
                  </a>
                </div>
                <p className="builder-demo-hint">{builder.spotlight.demoHint}</p>
              </footer>
            </article>

            {/* 3. Subgrid-aligned 3-Column Capabilities Matrix */}
            <div className="builder-capabilities-section">
              <h3 className="section-title builder-section-heading">
                {builder.capabilitiesTitle}
              </h3>
              <div className="builder-cap-grid">
                {builder.capabilityCols.map((col, idx) => (
                  <article key={idx} className="builder-cap-card">
                    <header className="builder-cap-header">
                      <span className="builder-cap-badge">{col.badge}</span>
                      <h4>{col.title}</h4>
                    </header>
                    <ul className="builder-cap-list">
                      {col.items.map((item, itemIdx) => (
                        <li key={itemIdx}>{item}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>

            {/* 4. Experience Timeline + Contact / Education / Languages */}
            <div className="builder-dossier-grid">
              <div className="builder-experience-col">
                <h3 className="section-title" style={{ marginTop: 0 }}>
                  {t('about.experience')}
                </h3>

                <div className="timeline">
                  <div className="timeline-item">
                    <div className="timeline-year">
                      <span>02/2026</span>
                      <span>{t('about.present')}</span>
                    </div>
                    <div className="timeline-node"></div>
                    <div className="timeline-content">
                      <h4>Lime Payroll Enterprise</h4>
                      <p className="role">{t('about.timeline.t1.role')}</p>
                      <p className="desc">{t('about.timeline.t1.desc')}</p>
                    </div>
                  </div>

                  <div className="timeline-item">
                    <div className="timeline-year">
                      <span>06/2022</span>
                      <span>01/2026</span>
                    </div>
                    <div className="timeline-node"></div>
                    <div className="timeline-content">
                      <h4>Lime Griffintown &amp; Shushu Group</h4>
                      <p className="role">{t('about.timeline.t2.role')}</p>
                      <p className="desc">{t('about.timeline.t2.desc')}</p>
                    </div>
                  </div>

                  <div className="timeline-item">
                    <div className="timeline-year">
                      <span>10/2020</span>
                      <span>{t('about.present')}</span>
                    </div>
                    <div className="timeline-node"></div>
                    <div className="timeline-content">
                      <h4>TYM Production &amp; LXR</h4>
                      <p className="role">{t('about.timeline.t3.role')}</p>
                      <p className="desc">{t('about.timeline.t3.desc')}</p>
                    </div>
                  </div>

                  <div className="timeline-item">
                    <div className="timeline-year">
                      <span>08/2015</span>
                      <span>03/2017</span>
                    </div>
                    <div className="timeline-node"></div>
                    <div className="timeline-content">
                      <h4>Sakos LLC &amp; ARCHCAFÉ</h4>
                      <p className="role">{t('about.timeline.t4.role')}</p>
                      <p className="desc">{t('about.timeline.t4.desc')}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="builder-meta-col" id="contact-section">
                <div className="builder-meta-card">
                  <h3 className="section-title" style={{ marginTop: 0 }}>
                    {t('about.contact')}
                  </h3>
                  <DirectContactList
                    areaText={builder.locationValue}
                    copiedPhone={copiedPhone}
                    copiedEmail={copiedEmail}
                    onCopyPhone={handleCopyPhone}
                    onCopyEmail={handleCopyEmail}
                    smsLabel={t('about.sendSms')}
                    copiedPhoneLabel={t('about.copiedPhone')}
                    emailLabel={t('about.sendEmail')}
                    copiedEmailLabel={t('about.copiedEmail')}
                    linkedinLabel={builder.linkedinLabel}
                    githubLabel={builder.githubLabel}
                  />
                </div>

                <div className="builder-meta-card">
                  <h3 className="section-title" style={{ marginTop: 0 }}>
                    {t('about.education')}
                  </h3>
                  <ul className="builder-edu-list">
                    {builder.educationItems.map((edu, idx) => (
                      <li key={idx} className="edu-block builder-edu-item">
                        <div className="builder-edu-top">
                          <h4>{edu.title}</h4>
                          <span className="builder-edu-date">{edu.date}</span>
                        </div>
                        <p>{edu.org}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="builder-meta-card">
                  <h3 className="section-title" style={{ marginTop: 0 }}>
                    {t('about.languages')}
                  </h3>
                  <ul className="hobby-list">
                    <li>{t('about.proficiencies.vi')}</li>
                    <li>{t('about.proficiencies.en')}</li>
                    <li>{t('about.proficiencies.fr')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
