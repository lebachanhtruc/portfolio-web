import { useLanguage } from '../contexts/LanguageContext';
import { useEffect, useId, useRef, useState } from 'react';
import { scrollToElementById } from '../utils/scroll';
import { encodeMediaPath } from '../utils/media';

interface KilnCardCopy {
  eyebrow: string;
  title: string;
  desc: string;
  cta: string;
}

const KILN_CARDS = [
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
    objectPosition: '84% 58%',
    width: 1280,
    height: 800,
    priority: false
  },
  {
    id: 'print',
    targetId: 'section-Print',
    image: '/Media/print-archive/print-taydo-trifold-mockup.webp',
    objectPosition: '26% 36%',
    width: 1800,
    height: 1200,
    priority: false
  }
] as const;

export default function HeroSection({
  profileMode = 'agency',
  onNavigatePillar
}: {
  profileMode?: 'agency' | 'cv';
  onNavigatePillar?: (targetId: string) => void;
}) {
  const { t, translations } = useLanguage();
  const [isInView, setIsInView] = useState(false);
  const [isShowreelOpen, setIsShowreelOpen] = useState(false);
  const [activeKiln, setActiveKiln] = useState(0);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const showreelDialogRef = useRef<HTMLDialogElement>(null);
  const showreelVideoRef = useRef<HTMLVideoElement>(null);
  const showreelTitleId = useId();
  const kilnBaseId = useId();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    if (titleRef.current) {
      observer.observe(titleRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = (prefersReduced: boolean) => {
      const video = videoRef.current;
      if (!video) return;
      if (prefersReduced) {
        video.removeAttribute('autoplay');
        video.pause();
      }
    };

    syncMotion(reducedMotionQuery.matches);
    const handler = (e: MediaQueryListEvent) => syncMotion(e.matches);
    reducedMotionQuery.addEventListener('change', handler);
    return () => reducedMotionQuery.removeEventListener('change', handler);
  }, []);

  // Light-dismiss fallback for browsers without native closedBy (e.g., Safari)
  useEffect(() => {
    const dialog = showreelDialogRef.current;
    if (!dialog || 'closedBy' in HTMLDialogElement.prototype) return;

    const outside = (e: PointerEvent) => {
      const r = dialog.getBoundingClientRect();
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    };
    let pressedOutside = false;
    const onPointerDown = (e: PointerEvent) => {
      pressedOutside = outside(e);
    };
    const onPointerUp = (e: PointerEvent) => {
      if (pressedOutside && outside(e)) dialog.close();
      pressedOutside = false;
    };

    dialog.addEventListener('pointerdown', onPointerDown);
    dialog.addEventListener('pointerup', onPointerUp);
    return () => {
      dialog.removeEventListener('pointerdown', onPointerDown);
      dialog.removeEventListener('pointerup', onPointerUp);
    };
  }, []);

  const openShowreel = () => {
    setIsShowreelOpen(true);
    showreelDialogRef.current?.showModal();
  };

  const chapterStartSeconds = [3.6, 11.0, 18.6, 26.4, 34.2];
  const jumpToChapter = (chapterIndex: number) => {
    const vid = showreelVideoRef.current;
    const sec = chapterStartSeconds[chapterIndex];
    if (!vid || sec === undefined) return;
    vid.currentTime = sec;
    void vid.play().catch(() => {});
  };

  const handleShowreelClose = () => {
    const vid = showreelVideoRef.current;
    if (vid) {
      vid.pause();
      vid.currentTime = 0;
    }
    if (showreelDialogRef.current) {
      showreelDialogRef.current.returnValue = '';
    }
    setIsShowreelOpen(false);
  };

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

  const roleText = profileMode === 'agency' ? t('hero.agencyRole') : t('hero.role');
  const showreelChapters: string[] = translations.hero.showreelChapters || [];
  const kilnItems: KilnCardCopy[] = (translations as any)?.hero?.kiln || [];

  return (
    <section className="hero-masterpiece hero-editorial-split">
      <div className="hero-top-masthead">
        <div className="hero-title-wrapper">
          <h1
            ref={titleRef}
            className={`massive-portfolio-text ${isInView ? 'in-view' : ''}`}
          >
            PORTF
            <span className="tv-mask">
              <video
                ref={videoRef}
                src="/Media/hero-tv-loop.mp4"
                poster="/Media/hero-tv-poster.jpg"
                width={360}
                height={640}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="tv-video"
              />
            </span>
            LIO
          </h1>
        </div>

        <div className="hero-meta-bar">
          <div className="hero-identity-cluster">
            <span className="hero-left-label">TRUC LE</span>
            <span className="hero-meta-sep" aria-hidden="true">·</span>
            <span className="hero-right-label">{roleText}</span>
          </div>

          <button
            type="button"
            className="hero-showreel-btn"
            onClick={openShowreel}
          >
            <span className="showreel-play-icon" aria-hidden="true">▶</span>
            <span>{t('hero.showreelCta')}</span>
            <span className="showreel-pill-tag">{t('hero.showreelBadge')}</span>
          </button>
        </div>
      </div>

      {/* Editorial 4-Pillar Spring Accordion (Kiln-inspired, native CSS linear() spring + no text re-wrap) */}
      <div
        className="hero-kiln-stage"
        role="region"
        aria-label={t('hero.kilnAria')}
      >
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
                  className="kiln-card-img"
                  style={{ objectPosition: card.objectPosition }}
                />
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

      {/* Native <dialog closedby="any"> Showreel Modal */}
      <dialog
        ref={showreelDialogRef}
        {...({ closedby: 'any' } as any)}
        onClose={handleShowreelClose}
        aria-labelledby={showreelTitleId}
        className="quote-native-dialog showreel-dialog"
      >
        <div className="dialog-inner-box showreel-dialog-box">
          <div className="dialog-top-bar">
            <div className="showreel-header-meta">
              <h1 id={showreelTitleId} className="showreel-dialog-title">
                {t('hero.showreelTitle')}
              </h1>
              <p className="showreel-dialog-sub">{t('hero.showreelSubtitle')}</p>
            </div>
            <form method="dialog">
              <button type="submit" value="close" autoFocus className="dialog-close-btn">
                ✕ {t('hero.showreelClose')}
              </button>
            </form>
          </div>

          <div className="dialog-media-stage showreel-video-stage">
            {isShowreelOpen && (
              <video
                ref={showreelVideoRef}
                src="/Media/showreel-60s.mp4"
                poster="/Media/posters/showreel-poster.jpg"
                controls
                autoPlay
                playsInline
                preload="metadata"
                className="showreel-video"
              />
            )}
          </div>

          {showreelChapters.length > 0 && (
            <div className="showreel-chapters-bar" aria-label="Showreel chapters">
              {showreelChapters.map((chapter, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="showreel-chapter-chip"
                  onClick={() => jumpToChapter(idx)}
                >
                  {chapter}
                </button>
              ))}
            </div>
          )}
        </div>
      </dialog>
    </section>
  );
}
