import './App.css'
import CustomCursor from './components/CustomCursor'
import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import ProjectGrids from './components/ProjectGrids'
import Footer from './components/Footer'
import LanguageSwitcher from './components/LanguageSwitcher'
import { LanguageProvider } from './contexts/LanguageContext'

function App() {
  return (
    <LanguageProvider>
      <div className="app-container">
        <CustomCursor />
        <main>
          <HeroSection />
          <AboutSection />
          <ProjectGrids />
          <Footer />
        </main>
        <LanguageSwitcher />
      </div>
    </LanguageProvider>
  )
}

export default App
