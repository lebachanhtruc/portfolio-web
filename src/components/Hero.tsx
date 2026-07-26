export default function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-video-wrapper">
        <video 
          className="hero-video" 
          autoPlay 
          loop 
          muted 
          playsInline
        >
          <source src="/Media/videography and editing/Project 9 - Ai generated Video for public Screen TV/House Grill Vermicelli Chicken 4k.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="hero-content animate-fade-in">
        <h1 className="hero-title text-gradient">Where Reality Meets AI</h1>
        <p className="hero-subtitle">Visual Excellence & Gastronomy</p>
      </div>
    </section>
  )
}
