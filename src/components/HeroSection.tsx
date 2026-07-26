import { useLanguage } from '../contexts/LanguageContext';
import { useEffect, useRef, useState } from 'react';

export default function HeroSection() {
  const { t } = useLanguage();
  const [isInView, setIsInView] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);

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

  return (
    <section className="hero-masterpiece">
      <div className="hero-text-container" style={{flexDirection: 'column'}}>
        <div className="hero-title-wrapper">
          <h1 
            ref={titleRef}
            className={`massive-portfolio-text ${isInView ? 'in-view' : ''}`}
          >
            PORTF
            <span className="tv-mask">
              <video 
                src={"/Media/videography and editing/Project 9 - Ai generated Video for public Screen TV/House Grill Vermicelli Chicken 4k.mp4".split('/').map(segment => encodeURIComponent(segment)).join('/')}
                autoPlay loop muted playsInline 
                className="tv-video"
                onTimeUpdate={(e) => {
                  const video = e.target as HTMLVideoElement;
                  if (video.currentTime >= 6) {
                    video.currentTime = 0;
                    video.play();
                  }
                }}
              />
            </span>
            LIO
          </h1>
        </div>
        <div className="hero-labels" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '0 5vw', marginTop: '-1vw', zIndex: 10 }}>
          <div className="hero-left-label">TRUC LE</div>
          <div className="hero-right-label">{t('hero.role')}</div>
        </div>
      </div>
    </section>
  )
}
