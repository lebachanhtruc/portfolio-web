import { useEffect } from 'react'
import './App.css'
import CustomCursor from './components/CustomCursor'
import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import ProjectGrids from './components/ProjectGrids'
import InteractiveQuoteSection from './components/InteractiveQuoteSection'
import Footer from './components/Footer'
import LanguageSwitcher from './components/LanguageSwitcher'
import { LanguageProvider } from './contexts/LanguageContext'
import { decodeQuoteToken } from './utils/quoteToken'

function App() {
  const searchParams =
    typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const quoteToken = searchParams?.get('q');
  const isDedicatedClientQuote = Boolean(quoteToken && decodeQuoteToken(quoteToken));
  const isAdminEntry = searchParams?.get('admin') === '1';

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.length >= 2) {
      const targetId = decodeURIComponent(hash.slice(1));
      const timer = window.setTimeout(() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'auto' });
      }, 60);
      return () => window.clearTimeout(timer);
    }
    if (isAdminEntry && !isDedicatedClientQuote) {
      const timer = window.setTimeout(() => {
        document.getElementById('section-Pricing & Services')?.scrollIntoView({ behavior: 'auto' });
      }, 60);
      return () => window.clearTimeout(timer);
    }
  }, [isAdminEntry, isDedicatedClientQuote]);

  const scrollToPortfolio = () => {
    const el = document.getElementById('section-AI x Photography');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <LanguageProvider>
      <div className="app-container">
        <CustomCursor />
        <main>
          {isDedicatedClientQuote && (
            <InteractiveQuoteSection
              isDedicatedClientMode={true}
              onScrollToPortfolio={scrollToPortfolio}
            />
          )}
          <HeroSection />
          <AboutSection />
          <ProjectGrids />
          {!isDedicatedClientQuote && <InteractiveQuoteSection />}
          <Footer />
        </main>
        <LanguageSwitcher />
      </div>
    </LanguageProvider>
  )
}

export default App
