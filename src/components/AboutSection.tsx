import React, { useState } from 'react';

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
);

const LocationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
);

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
);

const CameraIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
);

const CapCutIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

const BatteryIcon = () => (
  <svg width="20" height="12" viewBox="0 0 24 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign: 'middle', marginRight: '4px'}}>
    <rect x="1" y="1" width="20" height="12" rx="2" ry="2"></rect>
    <line x1="23" y1="5" x2="23" y2="9"></line>
    <rect x="3" y="3" width="12" height="8" fill="currentColor"></rect>
  </svg>
);

import { useLanguage } from '../contexts/LanguageContext';

export default function AboutSection() {
  const { t } = useLanguage();
  const [scrollState, setScrollState] = useState<'start' | 'middle' | 'end'>('start');
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

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
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollLeft, scrollWidth, clientWidth } = e.currentTarget;
    if (scrollLeft <= 10) {
      setScrollState('start');
    } else if (Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 10) {
      setScrollState('end');
    } else {
      setScrollState('middle');
    }
  };

  return (
    <section className="about-viewfinder-section relative">
      {/* Transition Gradient from Hero (Black) to About (Transparent Sơn Thuỷ) */}
      <div className="section-transition-gradient"></div>

      {/* Viewfinder Overlay Elements */}
      <div className="viewfinder-overlay">
        <div className="vf-top-left">
          <span>ISO 400</span>
          <span>F3.3</span>
          <span className="battery-stat"><BatteryIcon /> 65%</span>
          <span className="auto-mode">AUTO</span>
        </div>
        <div className="vf-top-right">
          <span className="rec-dot"></span> REC
        </div>
        
        {/* Frame Corners */}
        <div className="vf-corner vf-tl"></div>
        <div className="vf-corner vf-tr"></div>
        <div className="vf-corner vf-bl"></div>
        <div className="vf-corner vf-br"></div>
        
        {/* Focusing marks */}
        <div className="vf-focus-center">
          <div className="focus-bracket left"></div>
          <div className="focus-bracket right"></div>
        </div>
      </div>

      <div className="container relative z-10">
        <div className="mobile-swipe-indicator" style={{ marginBottom: '1rem', justifyContent: 'flex-start' }}>
          {scrollState !== 'start' && <span className="swipe-arrow-left">←</span>}
          <span>{t('projects.swipeToExplore')}</span>
          {scrollState !== 'end' && <span className="swipe-arrow">→</span>}
        </div>
        <div className="about-grid-3" onScroll={handleScroll}>
          
          {/* Column 1: Bio */}
          <div className="about-col-1">
            <h3 className="section-title">{t('about.bioTitle')}</h3>
            <div className="about-bio">
              <p>{t('about.bio.p1')}</p>
              <p>{t('about.bio.p2')}</p>
              <p>{t('about.bio.p3')}</p>
            </div>
            
            <h3 className="section-title mt-8">{t('about.techStack')}</h3>
            
            <div className="creative-portrait-container">
              <div className="film-strip-decoration"></div>
              <img 
                src={"/Media/AI GRaphic design + photo shoot/Project 10 - food photography and ai poster create/June_17_2023_-_SHUSHU_202607251246.jpeg".split('/').map(segment => encodeURIComponent(segment)).join('/')} 
                alt="Portrait" 
                className="film-portrait-new"
                loading="lazy"
              />
            </div>
          </div>

          {/* Column 2: Contact, Education, Tools */}
          <div className="about-col-2" id="contact-section">
            <h3 className="section-title">{t('about.contact')}</h3>
            <ul className="contact-list">
              <li>
                <PhoneIcon /> 
                <a href="sms:+14389857846" onClick={handleCopyPhone} style={{ color: 'inherit', textDecoration: 'none' }}>
                  <span>{copiedPhone ? t('about.copiedPhone') : t('about.sendSms')}</span>
                </a>
              </li>
              <li><LocationIcon /> <span>Longueuil, Quebec, Canada</span></li>
              <li>
                <MailIcon /> 
                <a href="mailto:lebachanhtruc@gmail.com" onClick={handleCopyEmail} style={{ color: 'inherit', textDecoration: 'none' }}>
                  <span className="highlight-box">{copiedEmail ? t('about.copiedEmail') : t('about.sendEmail')}</span>
                </a>
              </li>
            </ul>

            <h3 className="section-title">{t('about.education')}</h3>
            <div className="edu-block">
              <h4>PSPO I Certification</h4>
              <p>Scrum.org (Score: 91.3%)</p>
            </div>
            <div className="edu-block mt-2">
              <h4>DEP Graphic Design</h4>
              <p>Rosemont Technology Center</p>
            </div>
            <div className="edu-block mt-2">
              <h4>Bachelor of Marketing</h4>
              <p>International University (VNU HCMC)</p>
            </div>

            <h3 className="section-title">{t('about.tools')}</h3>
            <div className="tools-icon-grid">
              <div className="tool-box capcut"><CapCutIcon /></div>
              <div className="tool-box adobe">Lr</div>
              <div className="tool-box adobe">Ps</div>
              <div className="tool-box adobe">Ai</div>
              <div className="tool-box adobe">Pr</div>
              <div className="tool-box camera"><CameraIcon /></div>
            </div>

            <h3 className="section-title">{t('about.coreCompetencies')}</h3>
            <ul className="soft-skill-list">
              <li className="active-tag">Scrum (PSPO I)</li>
              <li className="active-tag">Rapid Prototyping (GenAI)</li>
              <li className="active-tag">POS Migration & Setup</li>
              <li className="active-tag">Workflow Automation</li>
              <li className="active-tag">UX/UI Friction Analysis</li>
              <li className="active-tag">Database (Supabase)</li>
            </ul>
          </div>

          {/* Column 3: Experience & Hobby */}
          <div className="about-col-3">
            <h3 className="section-title">{t('about.experience')}</h3>
            
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
                  <h4>Lime Griffintown & Shushu</h4>
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
                  <h4>TYM Production & LXR</h4>
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
                  <h4>Sakos LLC & ARCHCAFÉ</h4>
                  <p className="role">{t('about.timeline.t4.role')}</p>
                  <p className="desc">{t('about.timeline.t4.desc')}</p>
                </div>
              </div>
            </div>

            <h3 className="section-title">{t('about.languages')}</h3>
            <ul className="hobby-list">
              <li>{t('about.proficiencies.vi')}</li>
              <li>{t('about.proficiencies.en')}</li>
              <li>{t('about.proficiencies.fr')}</li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  )
}
