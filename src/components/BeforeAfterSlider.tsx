import React, { useRef, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { encodeMediaPath } from '../utils/media';

interface BeforeAfterSliderProps {
  original: string;
  edited: string;
  onExpand?: () => void;
  className?: string;
  priorityLoad?: boolean;
  impactBadge?: string;
}

export default function BeforeAfterSlider({
  original,
  edited,
  onExpand,
  className = '',
  priorityLoad = false,
  impactBadge
}: BeforeAfterSliderProps) {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderValue, setSliderValue] = useState(50);

  const updateSliderPosition = (clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = Math.round((x / rect.width) * 1000) / 10;
    el.style.setProperty('--slider-pos', `${percentage}%`);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateSliderPosition(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    // Slide smoothly on pointer drag (touch & mouse) or fine-pointer hover
    if (e.buttons > 0 || e.pointerType === 'mouse') {
      updateSliderPosition(e.clientX);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    const el = containerRef.current;
    if (!el) return;
    const current = parseFloat(el.style.getPropertyValue('--slider-pos') || '50');
    if (!Number.isNaN(current)) setSliderValue(Math.round(current));
  };

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setSliderValue(val);
    containerRef.current?.style.setProperty('--slider-pos', `${val}%`);
  };

  const originalSrc = encodeMediaPath(original);
  const editedSrc = encodeMediaPath(edited);

  return (
    <div
      className={`before-after-container ${className}`}
      ref={containerRef}
      style={{ '--slider-pos': `${sliderValue}%` } as React.CSSProperties}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <img
        src={originalSrc}
        alt={t('projects.slider.before')}
        className="slider-img original-img"
        width={540}
        height={960}
        loading={priorityLoad ? undefined : 'lazy'}
        decoding="async"
      />
      <img
        src={editedSrc}
        alt={t('projects.slider.after')}
        className="slider-img edited-img"
        width={540}
        height={960}
        loading={priorityLoad ? undefined : 'lazy'}
        decoding="async"
      />

      <div className="slider-line" aria-hidden="true">
        <div className="slider-handle">↔</div>
      </div>

      {/* Keyboard-accessible range control overlay */}
      <input
        type="range"
        min={0}
        max={100}
        value={sliderValue}
        onChange={handleRangeChange}
        aria-label={t('projects.slider.ariaLabel')}
        className="slider-a11y-range"
      />

      <div className="slider-bottom-dock">
        <div className="slider-labels-row">
          <span className="slider-label edited-label">{t('projects.slider.after')}</span>
          <span className="slider-label original-label">{t('projects.slider.before')}</span>
        </div>

        {impactBadge && (
          <div className="slider-impact-badge" aria-label={impactBadge}>
            <span className="slider-impact-dot" aria-hidden="true" />
            <span>{impactBadge}</span>
          </div>
        )}
      </div>

      {onExpand && (
        <button
          type="button"
          className="slider-expand-pill"
          onClick={(e) => {
            e.stopPropagation();
            onExpand();
          }}
          aria-label={t('projects.slider.expand')}
          title={t('projects.slider.expand')}
        >
          ⤢
        </button>
      )}
    </div>
  );
}
