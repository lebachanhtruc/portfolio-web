import { useLanguage } from '../contexts/LanguageContext';
import { useId, useState } from 'react';
import { scrollToElementById } from '../utils/scroll';
import { encodeMediaPath } from '../utils/media';

interface KilnCardCopy {
  eyebrow: string;
  title: string;
  desc: string;
  cta: string;
}

interface KilnCardSpec {
  id: string;
  targetId: string;
  image: string;
  objectPosition: string;
  collapsedImage?: string;
  collapsedObjectPosition?: string;
  width: number;
  height: number;
  collapsedWidth?: number;
  collapsedHeight?: number;
  priority: boolean;
}

const KILN_CARDS: readonly KilnCardSpec[] = [
  {
    id: 'luxury',
    targetId: 'section-Luxury',
    image: '/Media/lxr-editorial/lxr-cny-dior-saddle.webp',
    objectPosition: 'center 78%',
    width: 1067,
    height: 1600,
    priority: true
  },
  {
    id: 'culinary',
    targetId: 'section-Culinary',
    image:
      '/Media/AI Graphic Design and Photo Shoot/Project 4 - food photography and ai poster create/2025 Nov 06 - SHUSHUTO Spring Menu Set0280.jpg',
    objectPosition: 'center 52%',
    width: 1200,
    height: 1800,
    priority: false
  },
  {
    id: 'web',
    targetId: 'section-Web',
    image: '/Media/quote-showcase/patisserie-dzung-home.jpg',
    objectPosition: '4% top',
    collapsedImage: '/Media/quote-showcase/patisserie-dzung-mobile-hero.webp',
    collapsedObjectPosition: 'center top',
    width: 1280,
    height: 800,
    collapsedWidth: 720,
    collapsedHeight: 1580,
    priority: false
  },
  {
    id: 'print',
    targetId: 'section-Print',
    image: '/Media/print-archive/hero-print-film-separations.webp',
    objectPosition: '64% center',
    collapsedImage: '/Media/print-archive/hero-print-pantone-press.webp',
    collapsedObjectPosition: 'center 52%',
    width: 1500,
    height: 1080,
    collapsedWidth: 1080,
    collapsedHeight: 1440,
    priority: false
  }
];

export default function HeroSection({
  onNavigatePillar
}: {
  onNavigatePillar?: (targetId: string) => void;
}) {
  const { t, translations } = useLanguage();
  const [activeKiln, setActiveKiln] = useState(0);
  const kilnBaseId = useId();

  const handleKilnHover = (idx: number) => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
      setActiveKiln(idx);
    }
  };

  const handlePillarNavigate = (targetId: string) => {
    if (onNavigatePillar) {
      onNavigatePillar(targetId);
      return;
    }
    void scrollToElementById(targetId);
  };

  const kilnItems: KilnCardCopy[] = (translations as any)?.hero?.kiln || [];

  return (
    <section className="hero-masterpiece hero-editorial-split">
      <header className="hero-micro-header">
        <span className="hero-identity-name">TRUC LE</span>
        <span className="hero-identity-meta">MONTRÉAL · 2026</span>
      </header>

      {/* Editorial 4-Pillar Spring Accordion backed by translucent peeking PORTFOLIO wordmark */}
      <div
        className="hero-kiln-stage"
        role="region"
        aria-label={t('hero.kilnAria')}
      >
        <h1 className="hero-ghost-wordmark" aria-label="Truc Le — Portfolio">
          PORTFOLIO
        </h1>

        <div className="kiln-strip">
          {KILN_CARDS.map((card, idx) => {
            const copy = kilnItems[idx] || {
              eyebrow: `0${idx + 1}`,
              title: card.id,
              desc: '',
              cta: 'Explore →'
            };
            const isActive = activeKiln === idx;
            const panelId = `${kilnBaseId}-panel-${card.id}`;

            return (
              <article
                key={card.id}
                data-pillar={card.id}
                className={`kiln-card ${isActive ? 'is-active' : ''}`}
                onMouseEnter={() => handleKilnHover(idx)}
              >
                <img
                  src={encodeMediaPath(card.image)}
                  alt={`${copy.title} — ${copy.desc}`}
                  width={card.width}
                  height={card.height}
                  {...(card.priority ? { fetchPriority: 'high' as const, decoding: 'sync' as const } : {})}
                  className={`kiln-card-img ${card.collapsedImage ? 'kiln-card-img--expanded' : ''}`.trim()}
                  style={{ objectPosition: card.objectPosition }}
                />
                {card.collapsedImage && (
                  <img
                    src={encodeMediaPath(card.collapsedImage)}
                    alt=""
                    aria-hidden="true"
                    width={card.collapsedWidth ?? card.width}
                    height={card.collapsedHeight ?? card.height}
                    decoding="async"
                    className="kiln-card-img kiln-card-img--collapsed"
                    style={{ objectPosition: card.collapsedObjectPosition || 'center top' }}
                  />
                )}
                <div className="kiln-card-scrim" aria-hidden="true" />

                <button
                  type="button"
                  className="kiln-card-trigger"
                  aria-expanded={isActive}
                  aria-controls={panelId}
                  aria-label={`${copy.eyebrow} — ${copy.title}`}
                  onClick={() => setActiveKiln(idx)}
                  onFocus={() => setActiveKiln(idx)}
                />

                <div className="kiln-card-chrome">
                  <div className="kiln-card-top">
                    <span className="kiln-card-eyebrow">{copy.eyebrow}</span>
                    <span className="kiln-card-toggle" aria-hidden="true">
                      +
                    </span>
                  </div>

                  <div className="kiln-card-bottom">
                    <h2 className="kiln-card-title">{copy.title}</h2>
                    <div
                      id={panelId}
                      className="kiln-card-reveal"
                      aria-hidden={!isActive}
                    >
                      <div className="kiln-card-details">
                        <p className="kiln-card-desc">{copy.desc}</p>
                        <button
                          type="button"
                          className="kiln-card-cta"
                          tabIndex={isActive ? 0 : -1}
                          onClick={() => handlePillarNavigate(card.targetId)}
                        >
                          {copy.cta}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        className="hero-scroll-cue"
        onClick={() => void scrollToElementById('about-studio', 0)}
        aria-label={t('hero.scrollAria')}
      >
        <span className="hero-scroll-label">{t('hero.scrollCue')}</span>
        <span className="hero-scroll-track" aria-hidden="true">
          <span className="hero-scroll-thumb" />
        </span>
      </button>
    </section>
  );
}
