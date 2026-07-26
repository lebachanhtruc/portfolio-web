import { useState } from 'react';

export default function Atelier() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [modalVideo, setModalVideo] = useState<string | null>(null);

  const services = [
    { 
      id: '01', 
      name: 'AI Commercial Video', 
      videoSrc: '/Media/videography and editing/Project 9 - Ai generated Video for public Screen TV/Animated_Curry_Maison_Special_Dish_Precise_Proteus.mp4' 
    },
    { 
      id: '02', 
      name: 'Videography & Editing', 
      videoSrc: '/Media/videography and editing/Project 9 - Ai generated Video for public Screen TV/House Grill Vermicelli Chicken 4k.mp4' 
    },
    { 
      id: '03', 
      name: 'Food Photography', 
      videoSrc: '/Media/videography and editing/Project 9 - Ai generated Video for public Screen TV/Pho Soupe 1080p.mp4' 
    },
    { 
      id: '04', 
      name: 'AI x Photo Poster', 
      videoSrc: '/Media/videography and editing/Project 9 - Ai generated Video for public Screen TV/House Grill Rice Pork 720p.mp4' 
    }
  ];

  return (
    <>
      <section id="atelier" className="atelier-section">
        {/* Background Videos */}
        {services.map((svc) => (
          <video
            key={`bg-${svc.id}`}
            className={`atelier-bg-video ${activeVideo === svc.id ? 'active' : ''}`}
            src={svc.videoSrc}
            autoPlay
            loop
            muted
            playsInline
          />
        ))}

        <div className="atelier-content container">
          <div className="section-header" style={{ textAlign: 'left', marginBottom: '4rem' }}>
            <h2>The Atelier</h2>
          </div>
          <div className="services-list">
            {services.map((svc) => (
              <div 
                key={svc.id} 
                className="service-item"
                onMouseEnter={() => setActiveVideo(svc.id)}
                onMouseLeave={() => setActiveVideo(null)}
                onClick={() => setModalVideo(svc.videoSrc)}
              >
                <h3>{svc.name}</h3>
                <span>{svc.id}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fullscreen Video Modal */}
      <div className={`video-modal ${modalVideo ? 'open' : ''}`}>
        {modalVideo && (
          <>
            <button className="close-btn" onClick={() => setModalVideo(null)}>Close</button>
            <video src={modalVideo} autoPlay controls playsInline />
          </>
        )}
      </div>
    </>
  )
}
