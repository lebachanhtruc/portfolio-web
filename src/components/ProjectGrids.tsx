import React, { useState, useEffect, useRef, useId } from 'react';
import projectsData from '../data/projects.json';
import BeforeAfterSlider from './BeforeAfterSlider';
import ViewportVideo from './ViewportVideo';
import { useLanguage } from '../contexts/LanguageContext';
import { encodeMediaPath } from '../utils/media';
import { scrollToElement, scrollToElementById } from '../utils/scroll';

export interface GalleryItem {
  kind: 'pair' | 'image' | 'video';
  src: string;
  original?: string;
  edited?: string;
  btsVideo?: string;
  impactBadge?: string;
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
  if (lowerSrc.includes('lxr-cny-dior-saddle')) {
    return 'center 88%';
  }
  return undefined;
};

function ProjectGroup({
  project,
  animClass,
  onOpenLightbox,
  onOpenCvProfile,
  onOpenQuote
}: {
  project: any;
  animClass: string;
  onOpenLightbox: (items: GalleryItem[], startIndex: number) => void;
  onOpenCvProfile?: () => void;
  onOpenQuote?: (targetId?: string, offset?: number) => void;
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
    if (project.brand?.includes('LXR') || project.category === 'Luxury' || project.title.toLowerCase().includes('product')) {
      list = cardTitlesObj?.luxury || list;
    } else if (project.category === 'Culinary' || project.category === 'AI x Photography' || project.title === 'The Culinary Art') {
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

  const isWebsiteShowcase = Boolean(project.websiteShowcase);
  const showcaseData = isWebsiteShowcase
    ? (translations as any)?.projects?.websiteShowcase
    : null;
  const localizedCategory = isWebsiteShowcase
    ? t('projects.websiteShowcase.cardCategory')
    : t(`projects.tabs.${project.category}`);

  const groupImpactBadge =
    project.id === 'CaseStudyLimeGriffintown' || project.id === 'CaseStudyShushuGastronomy'
      ? t('projects.slider.impactCulinary')
      : project.id === 'CaseStudyLXRLuxury'
        ? t('projects.slider.impactLuxury')
        : project.id === 'CaseStudySeasonalFineDining'
          ? t('projects.slider.impactCampaign')
          : project.id === 'MenuDesignAndStorefrontBranding'
            ? t('projects.slider.impactPrint')
            : project.id === 'CommercialPrintPrePressArchive'
              ? t('projects.slider.impactPrintShop')
              : project.id === 'CaseStudyLXRStudio'
                ? t('projects.slider.impactLuxuryStudio')
                : undefined;

  // Build ordered gallery items array for lightbox Next/Prev navigation inside this group
  const galleryItems: GalleryItem[] = [
    ...(project.pairs || []).map((pair: any) => ({
      kind: 'pair' as const,
      src: encodeMediaPath(pair.edited),
      original: pair.original,
      edited: pair.edited,
      impactBadge: groupImpactBadge,
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
  if (isWebsiteShowcase) {
    gridClass = 'website-showcase-grid';
  } else if (project.featuredLandscapeFirst) {
    gridClass = 'featured-landscape-grid';
  } else if (project.landscapeShowcase) {
    gridClass = 'landscape-showcase-grid';
  } else if (project.portraitShowcase) {
    gridClass = 'portrait-showcase-grid';
  } else if (project.category === 'Photography') {
    gridClass = 'masonry-grid';
  } else if (itemCount === 10) {
    gridClass = 'grid-5x2';
  } else if (itemCount === 5) {
    gridClass = 'grid-5-cols';
  } else if (itemCount === 3) {
    gridClass = 'grid-3-cols-center-high';
  } else if (itemCount === 4 || itemCount === 8) {
    gridClass = 'vertical-grid';
  } else if (itemCount % 3 === 0) {
    gridClass = 'grid-3-cols';
  } else if (itemCount === 2) {
    gridClass = 'grid-2-cols';
  } else if (itemCount === 1) {
    gridClass = 'grid-1-col';
  }

  const isContainItem = () => Boolean(project.containMedia);

  const renderMedia = (src: string, index = 0) => {
    const safeSrc = encodeMediaPath(src);
    const isFeaturedVideo = Boolean(project.featuredLandscapeFirst && index === 0);
    const containClass = isContainItem() ? 'contain-fit' : '';
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
    const position = isWebsiteShowcase ? 'top center' : getObjectPosition(src);
    return (
      <img
        src={safeSrc}
        alt={getLocalizedCardTitle(src)}
        loading="lazy"
        decoding="async"
        width={isWebsiteShowcase ? 1280 : isFeaturedVideo ? 1920 : project.landscapeShowcase ? 1200 : project.portraitShowcase ? 800 : 540}
        height={isWebsiteShowcase ? 800 : isFeaturedVideo ? 1080 : project.landscapeShowcase ? 800 : project.portraitShowcase ? 1000 : 960}
        className={`project-media ${containClass}`.trim()}
        style={position ? { objectPosition: position } : undefined}
      />
    );
  };

  return (
    <div id={`project-${project.id}`} className="project-group" ref={containerRef}>
      <h3 className="project-group-title">
        {t(`projects.titles.${project.title}`)} <span className="project-title-sep" aria-hidden="true">·</span>{' '}
        <span className="highlight-text">{project.brand}</span>
      </h3>
      {groupImpactBadge && (
        <div className="project-impact-banner">
          <span className="slider-impact-dot" aria-hidden="true" />
          <span>{groupImpactBadge}</span>
        </div>
      )}
      {showcaseData && (
        <div className="website-showcase-intro">
          <p className="website-showcase-subtitle">{showcaseData.subtitle}</p>
          <div className="website-showcase-tags">
            {(showcaseData.tags as string[]).map((tag, i) => (
              <span key={i} className="website-showcase-tag">
                {tag}
              </span>
            ))}
          </div>
          <div className="website-showcase-actions">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="website-showcase-live-btn"
              >
                {showcaseData.liveCta}
              </a>
            )}
            {showcaseData.mapsCta && (
              <a
                href="https://www.google.com/maps/place/Patisserie+Dzung/@45.4714654,-73.4587648,17z/data=!3m1!4b1!4m6!3m5!1s0x4cc9054ca9b665f5:0x451da51af4413046!8m2!3d45.4714654!4d-73.4587648!16s%2Fg%2F11zx0_530d"
                target="_blank"
                rel="noopener noreferrer"
                className="website-showcase-quote-btn"
              >
                {showcaseData.mapsCta}
              </a>
            )}
            <button
              type="button"
              className="website-showcase-quote-btn"
              onClick={() => {
                if (onOpenQuote) {
                  onOpenQuote('quote-website-card', 32);
                  return;
                }
                void scrollToElementById('quote-website-card', 32);
              }}
            >
              {showcaseData.quoteCta}
            </button>
            {onOpenCvProfile && showcaseData.cvSystemsCta && (
              <button
                type="button"
                className="website-showcase-quote-btn"
                onClick={onOpenCvProfile}
              >
                {showcaseData.cvSystemsCta}
              </button>
            )}
          </div>
        </div>
      )}
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
            const isLandscapeCenterpiece = Boolean(
              project.landscapeShowcase &&
                project.standalone.length % 2 === 1 &&
                index === project.standalone.length - 1
            );

            return (
              <div
                key={`standalone-${index}`}
                className={`project-card ${isEasterEggTarget ? 'easter-egg-desktop' : ''} ${project.featuredLandscapeFirst && index === 0 ? 'featured-landscape-card' : ''} ${isLandscapeCenterpiece ? 'landscape-centerpiece-card' : ''}`.trim()}
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
                    className={`media-wrapper project-media-trigger ${isContainItem() ? 'contain-media' : ''}`}
                    onClick={() => onOpenLightbox(galleryItems, galleryIndex)}
                    aria-label={`${getLocalizedCardTitle(src)} — ${t('projects.slider.expand')}`}
                  >
                    {renderMedia(src, index)}
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

const FEATURED_CULINARY_IDS = new Set([
  'CaseStudyShushuGastronomy',
  'DigitalMenu4KAndCommercialAds',
  'CaseStudyLimeGriffintown'
]);

export default function ProjectGrids({
  onOpenCvProfile,
  onOpenQuote
}: {
  onOpenCvProfile?: () => void;
  onOpenQuote?: (targetId?: string, offset?: number) => void;
}) {
  const { t, translations } = useLanguage();
  const tabs = ['Luxury', 'Culinary', 'Web', 'Print'];
  const [activeTab, setActiveTab] = useState('Luxury');
  const [showAllCulinary, setShowAllCulinary] = useState(false);
  const [isNavStuck, setIsNavStuck] = useState(false);
  const stickyShellRef = useRef<HTMLDivElement>(null);
  const stickySentinelRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Lightbox <dialog closedby="any"> state
  const lightboxRef = useRef<HTMLDialogElement>(null);
  const lightboxTitleId = useId();
  const [lightboxState, setLightboxState] = useState<{
    items: GalleryItem[];
    index: number;
    showingBts: boolean;
  } | null>(null);

  // Track sticky state (progressive fallback alongside @container scroll-state) & active section highlight
  useEffect(() => {
    const sentinel = stickySentinelRef.current;
    let stuckObserver: IntersectionObserver | null = null;
    if (sentinel) {
      stuckObserver = new IntersectionObserver(
        ([entry]) => {
          setIsNavStuck(!entry.isIntersecting && entry.boundingClientRect.top < 20);
        },
        { threshold: [0, 1] }
      );
      stuckObserver.observe(sentinel);
    }

    const sectionIds = ['Luxury', 'Culinary', 'Web', 'Print', 'Pricing & Services'];
    const handleScrollActive = () => {
      const probeY = 180;
      let current = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(`section-${id}`);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= probeY) {
          current = id;
        }
      }
      setActiveTab((prev) => (prev !== current ? current : prev));
    };

    let rafId = 0;
    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        handleScrollActive();
      });
    };

    handleScrollActive();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      stuckObserver?.disconnect();
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
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
    setActiveTab(tab);
    if (tab === 'Pricing & Services' && onOpenQuote) {
      onOpenQuote('section-Pricing & Services', 20);
      return;
    }
    const el = sectionRefs.current[tab] || document.getElementById(`section-${tab}`);
    const offset = tab === 'Pricing & Services' ? 20 : undefined;
    void scrollToElement(el, offset);
  };

  const chapterTabs = ['Luxury', 'Culinary', 'Web', 'Print'];
  const chaptersCopy = ((translations as any)?.projects?.chapters || {}) as Record<
    string,
    { index: string; title: string; subtitle: string }
  >;
  const activeLightboxItem = lightboxState ? lightboxState.items[lightboxState.index] : null;

  return (
    <section className="projects-masterpiece container" style={{ position: 'relative' }}>
      <div ref={stickySentinelRef} className="sticky-nav-sentinel" aria-hidden="true" />
      <div
        id="portfolio-nav-dock"
        ref={stickyShellRef}
        className={`sticky-nav-shell ${isNavStuck ? 'is-stuck' : ''}`}
      >
        <nav className="pill-menu sticky-pill-bar" aria-label="Portfolio chapters">
          {chapterTabs.map((menuTab) => (
            <button
              key={menuTab}
              type="button"
              className={`pill-btn ${activeTab === menuTab ? 'active' : ''}`}
              aria-current={activeTab === menuTab ? 'true' : undefined}
              onClick={() => scrollToSection(menuTab)}
            >
              {t(`projects.tabs.${menuTab}`)}
            </button>
          ))}
          <span className="sticky-pill-divider" aria-hidden="true" />
          <button
            type="button"
            className={`pill-btn pill-btn-quote ${activeTab === 'Pricing & Services' ? 'active' : ''}`}
            aria-current={activeTab === 'Pricing & Services' ? 'true' : undefined}
            onClick={() => scrollToSection('Pricing & Services')}
          >
            {t('projects.tabs.Pricing & Services')}
          </button>
        </nav>
      </div>

      <div className="projects-container">
        {tabs.map((tab) => {
          const allTabProjects = projectsData.filter((p) => p.category === tab);
          if (allTabProjects.length === 0) return null;
          const chapter = chaptersCopy[tab];
          const isCulinaryChapter = tab === 'Culinary';
          const visibleTabProjects =
            isCulinaryChapter && !showAllCulinary
              ? allTabProjects.filter((p) => FEATURED_CULINARY_IDS.has(p.id))
              : allTabProjects;
          const hasHiddenCulinary = isCulinaryChapter && allTabProjects.length > visibleTabProjects.length;

          return (
            <div
              key={tab}
              id={`section-${tab}`}
              ref={(el) => {
                sectionRefs.current[tab] = el;
              }}
              className="category-section"
            >
              {chapter && (
                <header className="editorial-chapter-header">
                  <div className="editorial-chapter-meta">
                    <span className="editorial-chapter-index">{chapter.index}</span>
                    <span className="editorial-chapter-rule" aria-hidden="true" />
                  </div>
                  <div className="editorial-chapter-copy">
                    <h2 className="editorial-chapter-title">{chapter.title}</h2>
                    <p className="editorial-chapter-subtitle">{chapter.subtitle}</p>
                  </div>
                </header>
              )}

              {visibleTabProjects.map((project: any) => {
                const globalIndex = projectsData.findIndex((p) => p.id === project.id);
                return (
                  <ProjectGroup
                    key={project.id}
                    project={project}
                    animClass={project.disableAnimation ? '' : `scroll-anim-${(globalIndex % 13) + 1}`}
                    onOpenLightbox={openLightbox}
                    onOpenCvProfile={onOpenCvProfile}
                    onOpenQuote={onOpenQuote}
                  />
                );
              })}

              {(hasHiddenCulinary || (isCulinaryChapter && showAllCulinary)) && (
                <div className="culinary-expand-wrap">
                  <button
                    type="button"
                    className="studio-btn-ghost culinary-expand-btn"
                    aria-expanded={showAllCulinary}
                    onClick={() => setShowAllCulinary((prev) => !prev)}
                  >
                    {showAllCulinary
                      ? t('projects.collapseCulinary')
                      : t('projects.expandCulinary')}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

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
                    impactBadge={activeLightboxItem.impactBadge}
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
