import { useLanguage } from '../contexts/LanguageContext';
import { useEffect, useId, useRef, useState } from 'react';
import { scrollToElementById } from '../utils/scroll';

export default function HeroSection({
  profileMode = 'agency'
}: {
  profileMode?: 'agency' | 'cv';
}) {
  const { t, translations } = useLanguage();
  const [isInView, setIsInView] = useState(false);
  const [isShowreelOpen, setIsShowreelOpen] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const showreelDialogRef = useRef<HTMLDialogElement>(null);
  const showreelVideoRef = useRef<HTMLVideoElement>(null);
  const showreelTitleId = useId();

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

  const roleText = profileMode === 'agency' ? t('hero.agencyRole') : t('hero.role');
  const showreelChapters: string[] = translations.hero.showreelChapters || [];

  return (
    <section className="hero-masterpiece">
      <div className="hero-text-container" style={{ flexDirection: 'column' }}>
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
        <div
          className="hero-labels"
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0 5vw',
            marginTop: 'clamp(0.75rem, 1.4vw, 1.5rem)',
            zIndex: 10
          }}
        >
          <div className="hero-left-label">TRUC LE</div>
          <div className="hero-right-label">{roleText}</div>
        </div>

        <div className="hero-showreel-row">
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
