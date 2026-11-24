import { useEffect, useState } from 'react'
import './App.css'
import CustomCursor from './components/CustomCursor'
import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import ProjectGrids from './components/ProjectGrids'
import InteractiveQuoteSection from './components/InteractiveQuoteSection'
import Footer from './components/Footer'
import LanguageSwitcher from './components/LanguageSwitcher'
import { LanguageProvider } from './contexts/LanguageContext'
import { decodeQuoteToken, isShortQuoteId, type StoredQuotePayload } from './utils/quoteToken'
import { scrollToElementById } from './utils/scroll'

export interface RemoteQuoteState {
  status: 'idle' | 'loading' | 'ready' | 'not_found' | 'error';
  shortId: string | null;
  data?: StoredQuotePayload;
}

function App() {
  const searchParams =
    typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const quoteToken = searchParams?.get('q')?.trim() ?? null;
  const isLegacyToken = Boolean(quoteToken && decodeQuoteToken(quoteToken));
  const isRemoteShortId = Boolean(quoteToken && !isLegacyToken && isShortQuoteId(quoteToken));
  const isAdminEntry = searchParams?.get('admin') === '1';

  const [remoteQuoteState, setRemoteQuoteState] = useState<RemoteQuoteState>(() =>
    isRemoteShortId && quoteToken
      ? { status: 'loading', shortId: quoteToken.toLowerCase() }
      : { status: 'idle', shortId: null }
  );

  useEffect(() => {
    if (!isRemoteShortId || !quoteToken) return;
    const shortId = quoteToken.toLowerCase();
    const controller = new AbortController();

    fetch(`/api/quotes?id=${encodeURIComponent(shortId)}`, {
      signal: controller.signal,
      cache: 'no-store'
    })
      .then(async (res) => {
        if (res.status === 404 || res.status === 400) {
          setRemoteQuoteState({ status: 'not_found', shortId });
          return;
        }
        if (!res.ok) {
          setRemoteQuoteState({ status: 'error', shortId });
          return;
        }
        const json = (await res.json()) as { id?: string; quote?: StoredQuotePayload };
        if (json?.quote?.profile) {
          setRemoteQuoteState({
            status: 'ready',
            shortId: json.id || shortId,
            data: json.quote
          });
        } else {
          setRemoteQuoteState({ status: 'not_found', shortId });
        }
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setRemoteQuoteState({ status: 'error', shortId });
      });

    return () => controller.abort();
  }, [isRemoteShortId, quoteToken]);

  const isDedicatedClientQuote = Boolean(
    isLegacyToken ||
      (isRemoteShortId &&
        remoteQuoteState.status !== 'not_found' &&
        remoteQuoteState.status !== 'error')
  );

  const modeParam = searchParams?.get('mode')?.trim().toLowerCase();
  const initialHash = typeof window !== 'undefined' ? window.location.hash : '';
  const initialMode: 'agency' | 'cv' =
    !isDedicatedClientQuote &&
    !isAdminEntry &&
    !initialHash.startsWith('#section-') &&
    (modeParam === 'cv' || modeParam === 'builder')
      ? 'cv'
      : 'agency';

  const [profileMode, setProfileMode] = useState<'agency' | 'cv'>(initialMode);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.length >= 2) {
      const targetId = decodeURIComponent(hash.slice(1));
      const timer = window.setTimeout(() => {
        void scrollToElementById(
          targetId,
          targetId === 'section-Pricing & Services' ? 0 : undefined,
          true
        );
      }, 60);
      return () => window.clearTimeout(timer);
    }
    if (isAdminEntry && !isDedicatedClientQuote) {
      const timer = window.setTimeout(() => {
        void scrollToElementById('section-Pricing & Services', 0, true);
      }, 60);
      return () => window.clearTimeout(timer);
    }
  }, [isAdminEntry, isDedicatedClientQuote]);

  const scrollToPortfolio = () => {
    void scrollToElementById('section-Videography');
  };

  return (
    <LanguageProvider>
      <div className="app-container">
        <CustomCursor />
        <main>
          {isDedicatedClientQuote && (
            <InteractiveQuoteSection
              isDedicatedClientMode={true}
              remoteQuoteState={remoteQuoteState}
              onScrollToPortfolio={scrollToPortfolio}
            />
          )}
          <HeroSection profileMode={profileMode} />
          <AboutSection profileMode={profileMode} onProfileModeChange={setProfileMode} />
          {profileMode === 'agency' && <ProjectGrids />}
          {!isDedicatedClientQuote && profileMode === 'agency' && (
            <InteractiveQuoteSection remoteQuoteState={remoteQuoteState} />
          )}
          <Footer />
        </main>
        <LanguageSwitcher
          showQuoteButton={profileMode === 'agency' || isDedicatedClientQuote}
          backToTopTargetId={profileMode === 'agency' ? 'portfolio-nav-dock' : 'about-studio'}
        />
      </div>
    </LanguageProvider>
  )
}

export default App
