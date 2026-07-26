import { useState, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function BeforeAfterSlider({ original, edited }: { original: string, edited: string }) {
  const { t } = useLanguage();
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let clientX = 0;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = (e as React.MouseEvent).clientX;
    }
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setSliderPos(percentage);
  };

  return (
    <div 
      className="before-after-container"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
    >
      <img src={original} alt="Original" className="slider-img original-img" loading="lazy" />
      <div 
        className="slider-edited-wrapper" 
        style={{ width: `${sliderPos}%` }}
      >
        <img src={edited} alt="Edited" className="slider-img edited-img" loading="lazy" />
      </div>
      <div className="slider-line" style={{ left: `${sliderPos}%` }}>
        <div className="slider-handle">↔</div>
      </div>
      <div className="slider-label original-label">{t('projects.slider.before')}</div>
      <div className="slider-label edited-label">{t('projects.slider.after')}</div>
    </div>
  );
}
