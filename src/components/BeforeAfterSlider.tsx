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
  const posRef = useRef(50);
  const activePointerIdRef = useRef<number | null>(null);
  const grabOffsetXRef = useRef(0);
  const [sliderValue, setSliderValue] = useState(50);

  const applyPercentage = (rawPct: number) => {
    const el = containerRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(100, rawPct));
    const rounded = Math.round(clamped * 10) / 10;
    posRef.current = rounded;
    el.style.setProperty('--slider-pos', `${rounded}%`);
  };

  const updateFromClientX = (clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    applyPercentage((x / rect.width) * 100);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    const el = containerRef.current;
    if (!el) return;

    activePointerIdRef.current = e.pointerId;
    el.classList.add('is-dragging');
    try {
      el.setPointerCapture(e.pointerId);
    } catch {
      // Fallback safely if capture is unavailable
    }

    const grabbedRail = Boolean((e.target as HTMLElement).closest('.slider-rail'));
    if (grabbedRail) {
      // Preserve grab offset along the full-height divider rail so the line never jumps under the thumb
      const rect = el.getBoundingClientRect();
      const dividerX = rect.left + (posRef.current / 100) * rect.width;
      grabOffsetXRef.current = e.clientX - dividerX;
    } else {
      grabOffsetXRef.current = 0;
      updateFromClientX(e.clientX);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current === e.pointerId) {
      updateFromClientX(e.clientX - grabOffsetXRef.current);
      return;
    }
    // Fine-pointer desktop hover scrub when not actively dragging
    if (e.pointerType === 'mouse' && activePointerIdRef.current === null) {
      updateFromClientX(e.clientX);
    }
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current !== null && e.pointerId !== activePointerIdRef.current) return;
    const el = containerRef.current;
    if (el) {
      el.classList.remove('is-dragging');
      if (el.hasPointerCapture(e.pointerId)) {
        try {
          el.releasePointerCapture(e.pointerId);
        } catch {
          // Ignore if already released
        }
      }
    }
    activePointerIdRef.current = null;
    grabOffsetXRef.current = 0;
    setSliderValue(Math.round(posRef.current));
  };

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setSliderValue(val);
    applyPercentage(val);
  };

  const originalSrc = encodeMediaPath(original);
  const editedSrc = encodeMediaPath(edited);

  return (
    <div
      className={`before-after-container ${className}`}
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onLostPointerCapture={endDrag}
    >
      <img
        src={originalSrc}
        alt={t('projects.slider.before')}
        className="slider-img original-img"
        width={540}
        height={960}
        loading={priorityLoad ? undefined : 'lazy'}
        decoding="async"
        draggable={false}
      />
      <img
        src={editedSrc}
        alt={t('projects.slider.after')}
        className="slider-img edited-img"
        width={540}
        height={960}
        loading={priorityLoad ? undefined : 'lazy'}
        decoding="async"
        draggable={false}
      />

      {/* Full-height 48px touch rail centered on the divider line so dragging works seamlessly anywhere top-to-bottom */}
      <div className="slider-rail" aria-hidden="true">
        <div className="slider-line" />
        <div className="slider-handle">↔</div>
      </div>

      {/* Keyboard & screen-reader native range control (pointer-events: none prevents iOS Safari center-thumb touch conflicts) */}
      <input
        type="range"
        min={0}
        max={100}
        value={sliderValue}
        onChange={handleRangeChange}
        aria-label={t('projects.slider.ariaLabel')}
        aria-valuetext={`${sliderValue}%`}
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
