import React, { useState, useEffect, useRef, Fragment } from 'react';
import projectsData from '../data/projects.json';
import BeforeAfterSlider from './BeforeAfterSlider';
import { useLanguage } from '../contexts/LanguageContext';

function ProjectGroup({ project, animClass }: { project: any, animClass: string }) {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [cachedHeight, setCachedHeight] = useState<string>('auto');
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
    const mountObserver = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        setIsVisible(true);
      } else {
        // Cache height before unmounting to prevent scroll jumping
        if (containerRef.current && containerRef.current.offsetHeight > 300) {
          setCachedHeight(`${containerRef.current.offsetHeight}px`);
        }
        setIsVisible(false);
      }
    }, { rootMargin: '1200px 0px 1200px 0px' }); // Load early, unmount late

    if (containerRef.current) mountObserver.observe(containerRef.current);
    return () => mountObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || !containerRef.current) return;
    
    const animObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('out-view');
          entry.target.classList.add('in-view');
        } else {
          entry.target.classList.remove('in-view');
          entry.target.classList.add('out-view');
        }
      });
    }, { rootMargin: '-10% 0px -10% 0px' }); // Trigger animation when crossing 10% viewport edges

    const cards = containerRef.current.querySelectorAll('.project-card');
    cards.forEach(card => {
      // Add out-view initially so it can animate in when observed
      card.classList.add('out-view');
      animObserver.observe(card);
    });

    return () => animObserver.disconnect();
  }, [isVisible]);

  const encodePath = (path: string) => {
    return path.normalize('NFC').split('/').map(segment => encodeURIComponent(segment)).join('/');
  };

  const getObjectPosition = (src: string) => {
    const lowerSrc = src.toLowerCase();
    if (lowerSrc.includes('103846843_687281425460136_2423623817171570336_n')) {
      return 'left center'; // Show the poster on the glass
    }
    if (lowerSrc.includes('general tao chicken')) {
      return 'left bottom';
    }
    return undefined;
  };

  const renderMedia = (src: string) => {
    const safeSrc = encodePath(src);
    if (src.toLowerCase().endsWith('.mp4') || src.toLowerCase().endsWith('.mov')) {
      return <video src={safeSrc} autoPlay loop muted playsInline className="project-media" />;
    }
    const position = getObjectPosition(src);
    return <img src={safeSrc} alt="Media" loading="lazy" className="project-media" style={position ? { objectPosition: position } : undefined} />;
  };

  const itemCount = (project.pairs?.length || 0) + (project.standalone?.length || 0);
  
  let gridClass = 'vertical-grid';
  if (project.category === 'Photography') {
    gridClass = 'masonry-grid';
  } else {
    if (itemCount === 10) {
      gridClass = 'grid-5x2'; // 5x2 without stagger
    } else if (itemCount === 5) {
      gridClass = 'grid-5-cols'; // 5x1 grid with stagger
    } else if (itemCount === 3) {
      gridClass = 'grid-3-cols-center-high'; // Pyramid style for 3 items
    } else if (itemCount % 3 === 0) {
      gridClass = 'grid-3-cols'; // Standard stagger (middle lower) for 6, 9 items
    } else if (itemCount === 2) {
      gridClass = 'grid-2-cols';
    } else if (itemCount === 1) {
      gridClass = 'grid-1-col';
    }
  }

  const generateCreativeTitle = (path: string, project: any) => {
    const foodTitles = [
      "Gastronomic Excellence", "Culinary Perspective", "The Art of Plating", 
      "Taste in Motion", "Epicurean Delights", "Savor the Moment", 
      "Visual Feast", "Signature Dish", "Modern Cuisine", 
      "Aesthetic Flavors", "Heritage Recipe", "Chef's Masterpiece", 
      "Ambient Dining", "Sensory Experience", "The Perfect Bite"
    ];
    
    const luxuryFashionTitles = [
      "Timeless Elegance", "Luxury Redefined", "Classic Heritage",
      "Modern Chic", "Boutique Collection", "Vintage Premium",
      "Signature Style", "Exclusive Accessory", "Haute Couture",
      "Premium Leather", "Iconic Design", "Sartorial Excellence"
    ];

    const perfumeTitles = [
      "Aromatic Essence", "Scent of Elegance", "Perfume Collection", 
      "Sensory Journey", "Olfactory Art", "Signature Scent"
    ];

    const videographyTitles = [
      "Cinematic Moments", "Visual Narrative", "Motion Sequence",
      "Dynamic Storytelling", "The Director's Cut", "Urban Rhythms",
      "Fluid Transitions", "Atmospheric Frames", "Creative Direction"
    ];
    
    const photographyTitles = [
      "Urban Exploration", "Portrait of Time", "Light and Shadow",
      "Captured Emotion", "Minimalist Vision", "Candid Frame",
      "Symmetry in Focus", "Ethereal Beauty", "Timeless Capture"
    ];

    let titlesList = photographyTitles; // fallback
    
    // Smart selection based on brand and title
    if (project.brand === 'LXR' || project.title.toLowerCase().includes('product')) {
      titlesList = luxuryFashionTitles;
    } else if (project.brand === 'Verites' || project.title.toLowerCase().includes('perfum')) {
      titlesList = perfumeTitles;
    } else if (project.title === 'The Culinary Art' || project.title.toLowerCase().includes('food')) {
      titlesList = foodTitles;
    } else if (project.category === 'Videography') {
      titlesList = videographyTitles;
    } else if (project.category === 'Photography') {
      titlesList = photographyTitles;
    }
    
    // Hash path for deterministic pseudo-random title
    let hash = 0;
    for (let i = 0; i < path.length; i++) {
      hash = path.charCodeAt(i) + ((hash << 5) - hash);
    }
    const safeHash = Math.abs(hash);
    
    return titlesList[safeHash % titlesList.length];
  };

  // getCategoryAnimClass removed, we now use the passed animClass prop

  return (
    <div className="project-group" ref={containerRef} style={{ minHeight: cachedHeight, contentVisibility: 'auto' }}>
      <h2 className="project-group-title">{t(`projects.titles.${project.title}`)} - <span className="highlight-text">{project.brand}</span></h2>
      <div className="mobile-swipe-indicator">
        {scrollState !== 'start' && <span className="swipe-arrow-left">←</span>}
        <span>{t('projects.swipeToExplore')}</span>
        {scrollState !== 'end' && <span className="swipe-arrow">→</span>}
      </div>
      
      {isVisible && (
        <div className={`projects-grid ${gridClass} ${animClass}`} onScroll={handleScroll}>
          {/* Render Before/After Pairs */}
          {project.pairs && project.pairs.map((pair: any, index: number) => (
            <div key={`pair-${index}`} className="project-card">
              <div className="card-inner">
                <div className="media-wrapper slider-wrapper">
                  <BeforeAfterSlider original={pair.original} edited={pair.edited} />
                </div>
                <div className="card-info">
                  <div className="card-info-left">
                    <h3 className="card-title">{t('projects.slider.retouch')}</h3>
                    <p className="card-subtitle">{t(`projects.tabs.${project.category}`)}</p>
                  </div>
                  <div className="card-badge">{project.brand}</div>
                </div>
              </div>
            </div>
          ))}

          {/* Render Standalone Media */}
          {project.standalone && project.standalone.map((src: string, index: number) => {
            let easterEggVideo: string | undefined = undefined;
            if (src.includes('Set0229.jpg')) {
              easterEggVideo = encodePath("/Media/Proof of work/IMG_4950.MOV");
            } else if (src.includes('Set0280.jpg')) {
              easterEggVideo = encodePath("/Media/Proof of work/IMG_4955.MOV");
            }
            const isEasterEggTarget = easterEggVideo !== undefined;
            
            return (
              <div key={`standalone-${index}`} className={`project-card ${isEasterEggTarget ? 'easter-egg-desktop' : ''}`} style={{ order: (index + 1) * 10 }}>
                <div className="card-inner">
                  <div className="media-wrapper">
                    {renderMedia(src)}
                    {isEasterEggTarget && (
                      <>
                        <div className="play-icon-overlay">▶️</div>
                        <div className="easter-egg-video-container">
                          <video src={easterEggVideo} autoPlay loop muted playsInline className="hover-video" />
                        </div>
                      </>
                    )}
                  </div>
                  <div className="card-info">
                    <div className="card-info-left">
                      <h3 className="card-title">{generateCreativeTitle(src, project)}</h3>
                      <p className="card-subtitle">{project.category}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Render Mobile Injected Videos AT THE END of DOM to preserve nth-child, ordered visually via CSS */}
          {project.standalone && project.standalone.map((src: string, index: number) => {
            let easterEggVideo: string | undefined = undefined;
            if (src.includes('Set0229.jpg')) {
              easterEggVideo = encodePath("/Media/Proof of work/IMG_4950.MOV");
            } else if (src.includes('Set0280.jpg')) {
              easterEggVideo = encodePath("/Media/Proof of work/IMG_4955.MOV");
            }
            if (!easterEggVideo) return null;
            
            return (
              <div key={`mobile-inject-${index}`} className="project-card easter-egg-mobile-only" style={{ order: (index + 1) * 10 + 5 }}>
                <div className="card-inner">
                  <div className="media-wrapper">
                    <video src={easterEggVideo} autoPlay loop muted playsInline className="project-media" />
                  </div>
                  <div className="card-info">
                    <div className="card-info-left">
                      <h3 className="card-title">Behind the Scenes</h3>
                      <p className="card-subtitle">Creative Process</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ProjectGrids() {
  const { t } = useLanguage();
  const tabs = ['AI x Photography', 'Videography', 'Photography'];
  const [showBackToTop, setShowBackToTop] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Refs for each section to implement ScrollSpy and click-to-scroll
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 1000) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (tab: string) => {
    const el = sectionRefs.current[tab];
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const scrollToMenu = () => {
    if (menuRef.current) {
      const y = menuRef.current.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section className="projects-masterpiece container" style={{ position: 'relative' }}>
      <div className="projects-container" ref={menuRef}>
        {tabs.map(tab => {
          const tabProjects = projectsData.filter(p => p.category === tab);
          if (tabProjects.length === 0) return null;
          
          return (
            <div 
              key={tab} 
              id={`section-${tab}`} 
              ref={(el) => { sectionRefs.current[tab] = el; }}
              className="category-section"
            >
              {/* Repeated Section Menu Divider */}
              <div className="filter-menu-wrapper">
                <div className="pill-menu">
                  {tabs.map(menuTab => (
                    <button 
                      key={menuTab} 
                      className={`pill-btn ${tab === menuTab ? 'active' : ''}`}
                      onClick={() => scrollToSection(menuTab)}
                    >
                      {t(`projects.tabs.${menuTab}`)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Projects for this section */}
              {tabProjects.map((project: any) => {
                const globalIndex = projectsData.findIndex(p => p.id === project.id);
                return (
                  <ProjectGroup 
                    key={project.id} 
                    project={project} 
                    animClass={project.disableAnimation ? '' : `scroll-anim-${(globalIndex % 13) + 1}`} 
                  />
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Floating Back to Top Button */}
      <button 
        className={`back-to-top-btn ${showBackToTop ? 'visible' : ''}`}
        onClick={scrollToMenu}
        aria-label="Back to filters"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19V5M5 12l7-7 7 7"/>
        </svg>
      </button>
    </section>
  )
}
