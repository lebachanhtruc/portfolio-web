import React, { useState, useEffect, useRef, useId } from 'react';
import projectsData from '../data/projects.json';
import BeforeAfterSlider from './BeforeAfterSlider';
import ViewportVideo from './ViewportVideo';
import { useLanguage } from '../contexts/LanguageContext';
import { encodeMediaPath } from '../utils/media';

export interface GalleryItem {
  kind: 'pair' | 'image' | 'video';
  src: string;
  original?: string;
  edited?: string;
  btsVideo?: string;
  title: string;
  subtitle: string;
  brand: string;
}

const getPosterPath = (videoPath: string): string | undefined => {
  const filename = videoPath.split('/').pop() || '';
  if (filename.startsWith('menu-dong-demo')) return '/Media/posters/menu-dong-demo.jpg';
  if (filename.startsWith('clip-influencer-demo')) return '/Media/posters/clip-influencer-demo.jpg';
  if (filename.startsWith('clip-co-ban-demo')) return '/Media/posters/clip-co-ban-demo.jpg';
  if (filename.startsWith('real-tv-demo')) return '/Media/posters/real-tv-demo.jpg';
  if (filename.startsWith('sample-loop-clip')) return '/Media/posters/sample-loop-clip.jpg';
  if (filename.startsWith('Animated_Curry_Maison')) return '/Media/posters/Animated_Curry_Maison_720p.jpg';
  if (filename.startsWith('House Grill Rice Pork')) return '/Media/posters/House Grill Rice Pork 720p.jpg';
  if (filename.startsWith('House Grill Vermicelli Chicken')) return '/Media/posters/House Grill Vermicelli Chicken 720p.jpg';
  if (filename.startsWith('Pho_Soupe_720p')) return '/Media/posters/Pho_Soupe_720p.jpg';
  if (filename.includes('Mother day')) return '/Media/posters/lxr-bts.jpg';
  if (filename.startsWith('IMG_4950')) return '/Media/posters/IMG_4950_web.jpg';
  if (filename.startsWith('IMG_4955')) return '/Media/posters/IMG_4955_web.jpg';
  return undefined;
};

const getObjectPosition = (src: string) => {
  const lowerSrc = src.toLowerCase();
  if (lowerSrc.includes('103846843_687281425460136_2423623817171570336_n')) {
    return 'left center';
  }
  if (lowerSrc.includes('general tao chicken')) {
    return 'left bottom';
  }
  return undefined;
};

function ProjectGroup({
  project,
  animClass,
  onOpenLightbox
}: {
  project: any;
  animClass: string;
  onOpenLightbox: (items: GalleryItem[], startIndex: number) => void;
}) {
  const { t, translations } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState<'start' | 'middle' | 'end'>('start');

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollLeft, scrollWidth, clientWidth } = e.currentTarget;
    if (scrollLeft <= 10) {
      setScrollState('start');
    } else if (Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 10) {
      setScrollState('end');
    } else {
      setScrollState('middle');
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const animObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove('out-view');
            entry.target.classList.add('in-view');
          }
        });
      },
      { rootMargin: '-4% 0px -4% 0px' }
    );

    const cards = containerRef.current.querySelectorAll('.project-card');
    cards.forEach((card) => {
      card.classList.add('out-view');
      animObserver.observe(card);
    });

    return () => animObserver.disconnect();
  }, [project.id]);

  const getLocalizedCardTitle = (path: string) => {
    const cardTitlesObj = (translations as any)?.projects?.cardTitles;
    const baseName = (path.split('/').pop() || '').replace(/\.[^/.]+$/, '');
    if (cardTitlesObj?.showcaseMap?.[baseName]) {
      return cardTitlesObj.showcaseMap[baseName] as string;
    }

    let list: string[] = cardTitlesObj?.photography || ['Captured Frame'];
    if (project.brand === 'LXR' || project.title.toLowerCase().includes('product')) {
      list = cardTitlesObj?.luxury || list;
    } else if (project.title === 'The Culinary Art' || project.title.toLowerCase().includes('food')) {
      list = cardTitlesObj?.food || list;
    } else if (project.category === 'Videography') {
      list = cardTitlesObj?.videography || list;
    }

    let hash = 0;
    for (let i = 0; i < path.length; i++) {
      hash = path.charCodeAt(i) + ((hash << 5) - hash);
    }
    return list[Math.abs(hash) % list.length];
  };

  const localizedCategory = t(`projects.tabs.${project.category}`);

  // Build ordered gallery items array for lightbox Next/Prev navigation inside this group
  const galleryItems: GalleryItem[] = [
    ...(project.pairs || []).map((pair: any) => ({
      kind: 'pair' as const,
      src: encodeMediaPath(pair.edited),
      original: pair.original,
      edited: pair.edited,
      title: t('projects.slider.retouch'),
      subtitle: localizedCategory,
      brand: project.brand
    })),
    ...(project.standalone || []).map((src: string) => {
      let btsVideo: string | undefined;
      if (src.includes('Set0229.jpg')) {
        btsVideo = encodeMediaPath('/Media/Proof of work/IMG_4950_web.mp4');
      } else if (src.includes('Set0280.jpg')) {
        btsVideo = encodeMediaPath('/Media/Proof of work/IMG_4955_web.mp4');
      }
      const isVideo = src.toLowerCase().endsWith('.mp4') || src.toLowerCase().endsWith('.mov');
      return {
        kind: isVideo ? ('video' as const) : ('image' as const),
        src: encodeMediaPath(src),
        btsVideo,
        title: getLocalizedCardTitle(src),
        subtitle: localizedCategory,
        brand: project.brand
      };
    })
  ];

  const pairCount = project.pairs?.length || 0;
  const itemCount = pairCount + (project.standalone?.length || 0);

  let gridClass = 'vertical-grid';
  if (project.category === 'Photography') {
    gridClass = 'masonry-grid';
  } else if (itemCount === 10) {
    gridClass = 'grid-5x2';
  } else if (itemCount === 5) {
    gridClass = 'grid-5-cols';
  } else if (itemCount === 3) {
    gridClass = 'grid-3-cols-center-high';
  } else if (itemCount % 3 === 0) {
    gridClass = 'grid-3-cols';
  } else if (itemCount === 2) {
    gridClass = 'grid-2-cols';
  } else if (itemCount === 1) {
    gridClass = 'grid-1-col';
  }

  const isContainItem = (src: string) => Boolean(project.containMedia || src.includes('menu-dong-demo'));

  const renderMedia = (src: string) => {
    const safeSrc = encodeMediaPath(src);
    const containClass = isContainItem(src) ? 'contain-fit' : '';
    if (src.toLowerCase().endsWith('.mp4') || src.toLowerCase().endsWith('.mov')) {
      const rawPoster = getPosterPath(src);
      return (
        <ViewportVideo
          src={safeSrc}
          poster={rawPoster ? encodeMediaPath(rawPoster) : undefined}
          className={`project-media ${containClass}`.trim()}
        />
      );
    }
    const position = getObjectPosition(src);
    return (
      <img
        src={safeSrc}
        alt={getLocalizedCardTitle(src)}
        loading="lazy"
        decoding="async"
        width={540}
        height={960}
        className={`project-media ${containClass}`.trim()}
        style={position ? { objectPosition: position } : undefined}
      />
    );
  };

  return (
    <div className="project-group" ref={containerRef}>
      <h2 className="project-group-title">
        {t(`projects.titles.${project.title}`)} -{' '}
        <span className="highlight-text">{project.brand}</span>
      </h2>
      <div className="mobile-swipe-indicator">
        {scrollState !== 'start' && <span className="swipe-arrow-left">←</span>}
        <span>{t('projects.swipeToExplore')}</span>
        {scrollState !== 'end' && <span className="swipe-arrow">→</span>}
      </div>

      <div className={`projects-grid ${gridClass} ${animClass}`} onScroll={handleScroll}>
        {/* Render Before/After Interactive Pairs */}
        {project.pairs &&
          project.pairs.map((pair: any, index: number) => (
            <div key={`pair-${index}`} className="project-card">
              <div className="card-inner">
                <div className="media-wrapper slider-wrapper">
                  <BeforeAfterSlider
                    original={pair.original}
                    edited={pair.edited}
                    onExpand={() => onOpenLightbox(galleryItems, index)}
                  />
                </div>
                <div className="card-info">
                  <div className="card-info-left">
                    <h3 className="card-title">{t('projects.slider.retouch')}</h3>
                    <p className="card-subtitle">{localizedCategory}</p>
                  </div>
                  <div className="card-badge">{project.brand}</div>
                </div>
              </div>
            </div>
          ))}

        {/* Render Standalone Media */}
        {project.standalone &&
          project.standalone.map((src: string, index: number) => {
            let easterEggVideo: string | undefined;
            let easterEggPoster: string | undefined;
            if (src.includes('Set0229.jpg')) {
              easterEggVideo = encodeMediaPath('/Media/Proof of work/IMG_4950_web.mp4');
              easterEggPoster = '/Media/posters/IMG_4950_web.jpg';
            } else if (src.includes('Set0280.jpg')) {
              easterEggVideo = encodeMediaPath('/Media/Proof of work/IMG_4955_web.mp4');
              easterEggPoster = '/Media/posters/IMG_4955_web.jpg';
            }
            const isEasterEggTarget = easterEggVideo !== undefined;
            const galleryIndex = pairCount + index;

            return (
              <div
                key={`standalone-${index}`}
                className={`project-card ${isEasterEggTarget ? 'easter-egg-desktop' : ''}`}
                style={{ '--mobile-order': (index + 1) * 10 } as React.CSSProperties}
                onMouseEnter={(e) => {
                  if (!isEasterEggTarget) return;
                  const vid = e.currentTarget.querySelector('video.hover-video') as HTMLVideoElement | null;
                  if (vid && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    vid.play().catch(() => {});
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isEasterEggTarget) return;
                  const vid = e.currentTarget.querySelector('video.hover-video') as HTMLVideoElement | null;
                  vid?.pause();
                }}
              >
                <div className="card-inner">
                  <button
                    type="button"
                    className={`media-wrapper project-media-trigger ${isContainItem(src) ? 'contain-media' : ''}`}
                    onClick={() => onOpenLightbox(galleryItems, galleryIndex)}
                    aria-label={`${getLocalizedCardTitle(src)} — ${t('projects.slider.expand')}`}
                  >
                    {renderMedia(src)}
                    <span className="card-zoom-hint" aria-hidden="true">
                      ⤢
                    </span>
                    {isEasterEggTarget && easterEggVideo && (
                      <>
                        <span className="play-icon-overlay" aria-hidden="true">
                          ▶ {t('projects.cardTitles.behindScenesTag')}
                        </span>
                        <div className="easter-egg-video-container">
                          <video
                            src={easterEggVideo}
                            poster={easterEggPoster}
                            width={540}
                            height={960}
                            preload="none"
                            loop
                            muted
                            playsInline
                            className="hover-video"
                          />
                        </div>
                      </>
                    )}
                  </button>
                  <div className="card-info">
                    <div className="card-info-left">
                      <h3 className="card-title">{getLocalizedCardTitle(src)}</h3>
                      <p className="card-subtitle">{localizedCategory}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

        {/* Mobile Injected BTS Videos */}
        {project.standalone &&
          project.standalone.map((src: string, index: number) => {
            let easterEggVideo: string | undefined;
            let easterEggPoster: string | undefined;
            if (src.includes('Set0229.jpg')) {
              easterEggVideo = encodeMediaPath('/Media/Proof of work/IMG_4950_web.mp4');
              easterEggPoster = '/Media/posters/IMG_4950_web.jpg';
            } else if (src.includes('Set0280.jpg')) {
              easterEggVideo = encodeMediaPath('/Media/Proof of work/IMG_4955_web.mp4');
              easterEggPoster = '/Media/posters/IMG_4955_web.jpg';
            }
            if (!easterEggVideo) return null;

            return (
              <div
                key={`mobile-inject-${index}`}
                className="project-card easter-egg-mobile-only"
                style={{ '--mobile-order': (index + 1) * 10 + 5 } as React.CSSProperties}
              >
                <div className="card-inner">
                  <button
                    type="button"
                    className="media-wrapper project-media-trigger"
                    onClick={() =>
                      onOpenLightbox(
                        [
                          {
                            kind: 'video',
                            src: easterEggVideo!,
                            title: t('projects.cardTitles.bts'),
                            subtitle: t('projects.cardTitles.btsSub'),
                            brand: project.brand
                          }
                        ],
                        0
                      )
                    }
                    aria-label={t('projects.cardTitles.bts')}
                  >
                    <ViewportVideo src={easterEggVideo} poster={easterEggPoster} />
                  </button>
                  <div className="card-info">
                    <div className="card-info-left">
                      <h3 className="card-title">{t('projects.cardTitles.bts')}</h3>
                      <p className="card-subtitle">{t('projects.cardTitles.btsSub')}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default function ProjectGrids() {
  const { t } = useLanguage();
  const tabs = ['AI x Photography', 'Videography', 'Photography'];
  const [showBackToTop, setShowBackToTop] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Lightbox <dialog closedby="any"> state
  const lightboxRef = useRef<HTMLDialogElement>(null);
  const lightboxTitleId = useId();
  const [lightboxState, setLightboxState] = useState<{
    items: GalleryItem[];
    index: number;
    showingBts: boolean;
  } | null>(null);

  useEffect(() => {
    let rafId = 0;
    const handleScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        const shouldShow = window.scrollY > 1000;
        setShowBackToTop((prev) => (prev !== shouldShow ? shouldShow : prev));
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Light-dismiss fallback for browsers without native closedBy (e.g., Safari)
  useEffect(() => {
    const dialog = lightboxRef.current;
    if (!dialog || 'closedBy' in HTMLDialogElement.prototype) return;

    const handleClick = (event: MouseEvent) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const isDialogContent =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;
      if (isDialogContent) return;
      dialog.close();
    };

    dialog.addEventListener('click', handleClick);
    return () => dialog.removeEventListener('click', handleClick);
  }, []);

  const isLightboxOpen = lightboxState !== null;

  // Prev/Next keyboard shortcuts inside opened gallery modal
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setLightboxState((prev) =>
          prev ? { ...prev, index: (prev.index + 1) % prev.items.length, showingBts: false } : null
        );
      } else if (e.key === 'ArrowLeft') {
        setLightboxState((prev) =>
          prev
            ? {
                ...prev,
                index: (prev.index - 1 + prev.items.length) % prev.items.length,
                showingBts: false
              }
            : null
        );
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isLightboxOpen]);

  const openLightbox = (items: GalleryItem[], startIndex: number) => {
    setLightboxState({ items, index: startIndex, showingBts: false });
    lightboxRef.current?.showModal();
  };

  const scrollToSection = (tab: string) => {
    const el = sectionRefs.current[tab] || document.getElementById(`section-${tab}`);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const scrollToMenu = () => {
    if (menuRef.current) {
      const y = menuRef.current.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const menuTabs = ['AI x Photography', 'Videography', 'Photography', 'Pricing & Services'];
  const activeLightboxItem = lightboxState ? lightboxState.items[lightboxState.index] : null;

  return (
    <section className="projects-masterpiece container" style={{ position: 'relative' }}>
      <div className="projects-container" ref={menuRef}>
        {tabs.map((tab) => {
          const tabProjects = projectsData.filter((p) => p.category === tab);
          if (tabProjects.length === 0) return null;

          return (
            <div
              key={tab}
              id={`section-${tab}`}
              ref={(el) => {
                sectionRefs.current[tab] = el;
              }}
              className="category-section"
            >
              <div className="filter-menu-wrapper">
                <div className="pill-menu">
                  {menuTabs.map((menuTab) => (
                    <button
                      key={menuTab}
                      type="button"
                      className={`pill-btn ${tab === menuTab ? 'active' : ''}`}
                      onClick={() => scrollToSection(menuTab)}
                    >
                      {t(`projects.tabs.${menuTab}`)}
                    </button>
                  ))}
                </div>
              </div>

              {tabProjects.map((project: any) => {
                const globalIndex = projectsData.findIndex((p) => p.id === project.id);
                return (
                  <ProjectGroup
                    key={project.id}
                    project={project}
                    animClass={project.disableAnimation ? '' : `scroll-anim-${(globalIndex % 13) + 1}`}
                    onOpenLightbox={openLightbox}
                  />
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Floating Back to Top Button */}
      <button
        type="button"
        className={`back-to-top-btn ${showBackToTop ? 'visible' : ''}`}
        onClick={scrollToMenu}
        aria-label="Back to filters"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>

      {/* Portfolio Fullscreen Lightbox Dialog (following light-dismiss-a-dialog guidance) */}
      <dialog
        ref={lightboxRef}
        {...({ closedby: 'any' } as any)}
        onClose={() => setLightboxState(null)}
        aria-labelledby={lightboxTitleId}
        className="quote-native-dialog portfolio-lightbox-dialog"
      >
        {activeLightboxItem && (
          <div className="dialog-inner-box">
            <div className="dialog-top-bar">
              <div>
                <h3 id={lightboxTitleId}>{activeLightboxItem.title}</h3>
                <span className="lightbox-meta-sub">
                  {activeLightboxItem.subtitle} • {activeLightboxItem.brand} ({lightboxState!.index + 1}/
                  {lightboxState!.items.length})
                </span>
              </div>
              <div className="lightbox-header-actions">
                {activeLightboxItem.btsVideo && (
                  <button
                    type="button"
                    className="lightbox-nav-btn bts-toggle"
                    onClick={() =>
                      setLightboxState((prev) =>
                        prev ? { ...prev, showingBts: !prev.showingBts } : null
                      )
                    }
                  >
                    {lightboxState!.showingBts
                      ? t('projects.lightbox.viewPhoto')
                      : t('projects.lightbox.viewBts')}
                  </button>
                )}
                {lightboxState!.items.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="lightbox-nav-btn"
                      onClick={() =>
                        setLightboxState((prev) =>
                          prev
                            ? {
                                ...prev,
                                index: (prev.index - 1 + prev.items.length) % prev.items.length,
                                showingBts: false
                              }
                            : null
                        )
                      }
                    >
                      {t('projects.lightbox.prev')}
                    </button>
                    <button
                      type="button"
                      className="lightbox-nav-btn"
                      onClick={() =>
                        setLightboxState((prev) =>
                          prev
                            ? {
                                ...prev,
                                index: (prev.index + 1) % prev.items.length,
                                showingBts: false
                              }
                            : null
                        )
                      }
                    >
                      {t('projects.lightbox.next')}
                    </button>
                  </>
                )}
                <form method="dialog">
                  <button type="submit" className="dialog-close-btn">
                    ✕ {t('projects.lightbox.close')}
                  </button>
                </form>
              </div>
            </div>

            <div className="dialog-media-stage portfolio-lightbox-stage">
              {lightboxState!.showingBts && activeLightboxItem.btsVideo ? (
                <video
                  key={activeLightboxItem.btsVideo}
                  src={activeLightboxItem.btsVideo}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="dialog-full-video"
                />
              ) : activeLightboxItem.kind === 'pair' &&
                activeLightboxItem.original &&
                activeLightboxItem.edited ? (
                <div className="lightbox-slider-box">
                  <BeforeAfterSlider
                    original={activeLightboxItem.original}
                    edited={activeLightboxItem.edited}
                    priorityLoad={true}
                  />
                </div>
              ) : activeLightboxItem.kind === 'video' ? (
                <video
                  key={activeLightboxItem.src}
                  src={activeLightboxItem.src}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="dialog-full-video"
                />
              ) : (
                <img
                  src={activeLightboxItem.src}
                  alt={activeLightboxItem.title}
                  className="dialog-full-img"
                />
              )}
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
