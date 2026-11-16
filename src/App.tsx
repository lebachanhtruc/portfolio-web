import './App.css'
import CustomCursor from './components/CustomCursor'
import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import ProjectGrids from './components/ProjectGrids'
import InteractiveQuoteSection from './components/InteractiveQuoteSection'
import Footer from './components/Footer'
import LanguageSwitcher from './components/LanguageSwitcher'
import { LanguageProvider } from './contexts/LanguageContext'

function App() {
  const isDedicatedClientQuote =
    typeof window !== 'undefined' &&
    (new URLSearchParams(window.location.search).has('quote') ||
      new URLSearchParams(window.location.search).has('client'));

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
