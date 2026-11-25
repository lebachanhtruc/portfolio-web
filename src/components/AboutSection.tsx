import React, { useRef, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { scrollToElementById } from '../utils/scroll';

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
  'https://helix-saffron-268.notion.site/Ba-Chanh-Truc-Le-Operations-AI-Systems-Builder-3a59fce0d40680e3981bea63e19586e2';
const LOOM_WALKTHROUGH_URL = 'https://www.loom.com/share/1e467bf8ae8043ccbd5027abcdcb82c0';
const PATISSERIE_LIVE_URL = 'https://www.patisseriedzung.ca/';
const PATISSERIE_MAPS_URL =
  'https://www.google.com/maps/place/Patisserie+Dzung/@45.4714654,-73.4587648,17z/data=!3m1!4b1!4m6!3m5!1s0x4cc9054ca9b665f5:0x451da51af4413046!8m2!3d45.4714654!4d-73.4587648!16s%2Fg%2F11zx0_530d';
const PATISSERIE_IG_URL = 'https://www.instagram.com/patisseriedzung/';
const PATISSERIE_QR_URL = 'https://www.patisseriedzung.ca/goi-bo';
const PATISSERIE_REPO_URL = 'https://github.com/lebachanhtruc/patisserie-dzung';

interface AboutSectionProps {
  profileMode: 'agency' | 'cv';
  onProfileModeChange: (mode: 'agency' | 'cv') => void;
  onOpenQuote?: (targetId?: string, offset?: number) => void;
}

export default function AboutSection({
  profileMode,
  onProfileModeChange,
  onOpenQuote
}: AboutSectionProps) {
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
    if (onOpenQuote) {
      onOpenQuote('section-Pricing & Services', 0);
      return;
    }
    void scrollToElementById('section-Pricing & Services', 0);
  };

  const proofStats: { value: string; label: string }[] =
    (translations as any)?.about?.modes?.proofStats || [];
  const scopeTags: string[] = (translations as any)?.about?.modes?.scopeTags || [];
  const builder = translations.about.builder;

  const portraitSrc = '/Media/posters/IMG_4950_web.jpg';

  return (
    <section className="about-editorial-section relative" id="about-studio">
      <div className="container relative z-10">
        {/* Obsidian Editorial Segmented Mode Switch (Agency Studio vs Profile/CV) */}
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
              {t('about.modes.agency')}
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
              {t('about.modes.cv')}
            </button>
          </div>
        </div>

        {profileMode === 'agency' ? (
          <div
            id="profile-panel-agency"
            role="tabpanel"
            aria-labelledby="profile-tab-agency"
          >
            <div className="studio-editorial-grid" id="contact-section">
              <div className="studio-editorial-copy">
                <span className="studio-editorial-kicker">{t('about.modes.badgeAgency')}</span>
                <h2 className="studio-editorial-headline">{t('about.modes.agencyHeadline')}</h2>
                <p className="studio-editorial-lead">{t('about.modes.agencyLead')}</p>

                {proofStats.length > 0 && (
                  <dl className="studio-proof-strip">
                    {proofStats.map((stat, idx) => (
                      <div key={idx} className="studio-proof-cell">
                        <dt className="studio-proof-value">{stat.value}</dt>
                        <dd className="studio-proof-label">{stat.label}</dd>
                      </div>
                    ))}
                  </dl>
                )}

                {scopeTags.length > 0 && (
                  <ul className="studio-scope-tags" aria-label="Studio capabilities">
                    {scopeTags.map((tag, idx) => (
                      <li key={idx} className="studio-scope-tag">
                        {tag}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="agency-cta-row">
                  <button type="button" className="studio-btn-primary" onClick={scrollToQuote}>
                    {t('about.modes.ctaViewQuote')}
                  </button>
                  <button
                    type="button"
                    className="studio-btn-ghost"
                    onClick={() => onProfileModeChange('cv')}
                  >
                    {t('about.modes.ctaSwitchCv')}
                  </button>
                </div>
              </div>

              <aside className="studio-editorial-aside">
                <figure className="studio-bts-frame">
                  <img
                    src={portraitSrc}
                    alt="TYM Production Behind-the-Scenes Studio Shoot"
                    className="studio-bts-img"
                    width={540}
                    height={675}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="studio-bts-scrim" aria-hidden="true" />
                  <figcaption className="studio-bts-caption">
                    <span>{t('about.modes.btsCaption')}</span>
                  </figcaption>
                </figure>

                <div className="studio-contact-strip">
                  <div className="studio-contact-actions">
                    <a
                      href="sms:+14389857846"
                      onClick={handleCopyPhone}
                      className="studio-contact-chip"
                    >
                      <PhoneIcon />
                      <span>{copiedPhone ? t('about.copiedPhone') : t('about.sendSms')}</span>
                    </a>
                    <a
                      href="mailto:lebachanhtruc@gmail.com"
                      onClick={handleCopyEmail}
                      className="studio-contact-chip"
                    >
                      <MailIcon />
                      <span>{copiedEmail ? t('about.copiedEmail') : t('about.sendEmail')}</span>
                    </a>
                  </div>
                  <p className="studio-contact-area">
                    <LocationIcon />
                    <span>{t('about.modes.agencyAreasValue')}</span>
                  </p>
                </div>
              </aside>
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

            {/* 2. Flagship Work Samples: Pâtisserie Dzung Growth/CRO Lab + Lime Payroll Enterprise */}
            <div className="builder-spotlights-stack">
              <article className="builder-flagship-card builder-flagship-card--growth">
                <header className="builder-flagship-header">
                  <div className="builder-flagship-title-wrap">
                    <span className="builder-flagship-badge builder-flagship-badge--growth">
                      {builder.growthSpotlight.badge}
                    </span>
                    <h3>{builder.growthSpotlight.title}</h3>
                    <span className="builder-flagship-period">{builder.growthSpotlight.period}</span>
                  </div>
                  <p className="builder-flagship-summary">{builder.growthSpotlight.summary}</p>
                </header>

                <div className="builder-arch-grid">
                  {builder.growthSpotlight.cards.map((card, idx) => (
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
                      href={PATISSERIE_LIVE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="agency-btn-primary builder-link-btn"
                    >
                      {builder.growthSpotlight.ctaLive}
                    </a>
                    <a
                      href={PATISSERIE_MAPS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="agency-btn-secondary builder-link-btn"
                    >
                      {builder.growthSpotlight.ctaMaps}
                    </a>
                    {builder.growthSpotlight.ctaIg && (
                      <a
                        href={PATISSERIE_IG_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="agency-btn-secondary builder-link-btn"
                      >
                        {builder.growthSpotlight.ctaIg}
                      </a>
                    )}
                    <a
                      href={PATISSERIE_QR_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="agency-btn-secondary builder-link-btn"
                    >
                      {builder.growthSpotlight.ctaQr}
                    </a>
                    <a
                      href={PATISSERIE_REPO_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="agency-btn-secondary builder-link-btn"
                    >
                      {builder.growthSpotlight.ctaRepo}
                    </a>
                  </div>
                  <p className="builder-demo-hint">{builder.growthSpotlight.demoHint}</p>
                </footer>
              </article>

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
            </div>

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
                      <span>12/2019</span>
                      <span>{t('about.present')}</span>
                    </div>
                    <div className="timeline-node"></div>
                    <div className="timeline-content">
                      <h4>TYM Production</h4>
                      <p className="role">{t('about.timeline.t2.role')}</p>
                      <p className="desc">{t('about.timeline.t2.desc')}</p>
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
                      <p className="role">{t('about.timeline.t3.role')}</p>
                      <p className="desc">{t('about.timeline.t3.desc')}</p>
                    </div>
                  </div>

                  <div className="timeline-item">
                    <div className="timeline-year">
                      <span>10/2020</span>
                      <span>06/2022</span>
                    </div>
                    <div className="timeline-node"></div>
                    <div className="timeline-content">
                      <h4>LXR (LXRandCo)</h4>
                      <p className="role">{t('about.timeline.t4.role')}</p>
                      <p className="desc">{t('about.timeline.t4.desc')}</p>
                    </div>
                  </div>

                  <div className="timeline-item">
                    <div className="timeline-year">
                      <span>08/2015</span>
                      <span>08/2019</span>
                    </div>
                    <div className="timeline-node"></div>
                    <div className="timeline-content">
                      <h4>Montréal Print · SaKos LLC · ARCHCAFÉ</h4>
                      <p className="role">{t('about.timeline.t5.role')}</p>
                      <p className="desc">{t('about.timeline.t5.desc')}</p>
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
