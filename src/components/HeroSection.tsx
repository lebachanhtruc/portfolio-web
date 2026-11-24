import { useLanguage } from '../contexts/LanguageContext';
import { useEffect, useRef, useState } from 'react';
import { scrollToElementById } from '../utils/scroll';

export default function HeroSection({
  profileMode = 'agency'
}: {
  profileMode?: 'agency' | 'cv';
}) {
  const { t } = useLanguage();
  const [isInView, setIsInView] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  const roleText = profileMode === 'agency' ? t('hero.agencyRole') : t('hero.role');

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
