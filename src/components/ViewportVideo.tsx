import { useEffect, useRef } from 'react';

interface ViewportVideoProps {
  src: string;
  poster?: string;
  className?: string;
  width?: number;
  height?: number;
  eager?: boolean;
}

/**
 * Shared performance-aware looping background preview video:
 * - Applies `loading="lazy"` + `preload="none"` below the fold (with IntersectionObserver fallback)
 * - Reserves explicit `width`/`height` dimensions to prevent CLS
 * - Pauses offscreen playback automatically and honors `prefers-reduced-motion`
 */
export default function ViewportVideo({
  src,
  poster,
  className = 'project-media',
  width = 540,
  height = 960,
  eager = false
}: ViewportVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const supportsNativeLazy =
      typeof HTMLMediaElement !== 'undefined' &&
      Object.hasOwn(HTMLMediaElement.prototype, 'loading');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let deferredSrc: string | null = null;
    let deferredPoster: string | null = null;

    if (!eager && !supportsNativeLazy) {
      deferredSrc = src;
      video.removeAttribute('src');
      if (poster) {
        deferredPoster = poster;
        video.removeAttribute('poster');
      }
      video.preload = 'none';
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (deferredSrc) {
              if (deferredPoster) {
                video.poster = deferredPoster;
                deferredPoster = null;
              }
              video.src = deferredSrc;
              deferredSrc = null;
              video.preload = 'metadata';
              video.load();
            }
            if (!reducedMotionQuery.matches) {
              video.play().catch(() => {
                // Autoplay may be blocked by strict browser policies; poster remains visible.
              });
            }
          } else {
            video.pause();
          }
        }
      },
      { rootMargin: eager ? '200px 0px' : '160px 0px' }
    );

    observer.observe(video);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        video.removeAttribute('autoplay');
        video.pause();
      }
    };
    reducedMotionQuery.addEventListener('change', handleMotionChange);

    return () => {
      observer.disconnect();
      reducedMotionQuery.removeEventListener('change', handleMotionChange);
    };
  }, [src, poster, eager]);

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      width={width}
      height={height}
      {...(!eager ? ({ loading: 'lazy' } as any) : {})}
      preload={eager ? 'metadata' : 'none'}
      autoPlay={!eager ? undefined : true}
      muted
      loop
      playsInline
      className={className}
    />
  );
}
