import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const pointerQuery = window.matchMedia('(pointer: fine)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateEnabled = () => setEnabled(pointerQuery.matches && !motionQuery.matches);
    updateEnabled();

    pointerQuery.addEventListener('change', updateEnabled);
    motionQuery.addEventListener('change', updateEnabled);
    return () => {
      pointerQuery.removeEventListener('change', updateEnabled);
      motionQuery.removeEventListener('change', updateEnabled);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let rafId = 0;
    let latestX = -100;
    let latestY = -100;
    let hoveredState = false;

    const commitFrame = () => {
      rafId = 0;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${latestX}px, ${latestY}px, 0) translate(-50%, -50%)`;
      }
    };

    const moveCursor = (e: PointerEvent) => {
      latestX = e.clientX;
      latestY = e.clientY;
      if (!rafId) {
        rafId = window.requestAnimationFrame(commitFrame);
      }
    };

    const handlePointerOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      const isInteractive = Boolean(
        target?.closest(
          'a, button, summary, [role="button"], .project-media-trigger, .before-after-container, .service-item, .collection-item'
        )
      );
      if (isInteractive !== hoveredState) {
        hoveredState = isInteractive;
        setHovered(isInteractive);
      }
    };

    window.addEventListener('pointermove', moveCursor, { passive: true });
    window.addEventListener('pointerover', handlePointerOver, { passive: true });

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', moveCursor);
      window.removeEventListener('pointerover', handlePointerOver);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className={`custom-cursor ${hovered ? 'hovered' : ''}`}
      style={{ transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)' }}
    >
      {hovered && <span className="cursor-text">EXPLORE</span>}
    </div>
  );
}
