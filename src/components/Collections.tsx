import { useRef } from 'react';

export default function Collections() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const collections = [
    {
      id: 'p1',
      title: 'Project 1: Food & AI',
      imgSrc: '/Media/AI GRaphic design + photo shoot/Project 1 - food photography and ai poster create/2024 Jun 05 - SHUSHUTO x Singapore9185.jpg',
    },
    {
      id: 'p2',
      title: 'Project 2: Real Poster',
      imgSrc: '/Media/AI GRaphic design + photo shoot/Project 2 - photography and real poster/103846843_687281425460136_2423623817171570336_n.jpg',
    },
    {
      id: 'p3',
      title: 'Project 3: Fine Dining',
      imgSrc: '/Media/AI GRaphic design + photo shoot/Project 3 - food photography and ai poster create/Fine_dining_advertisement_tastin…_4K_202607251056.jpeg',
    },
    {
      id: 'p4',
      title: 'Project 4: Spring Menu',
      imgSrc: '/Media/AI GRaphic design + photo shoot/Project 4 - food photography and ai poster create/2025 Nov 06 - SHUSHUTO Spring Menu Set0229.jpg',
    },
    {
      id: 'p5',
      title: 'Project 5: Valentine',
      imgSrc: '/Media/AI GRaphic design + photo shoot/Project 5 - food photography and ai poster create/VALENTINE_01.png_4K_202607251157.jpeg',
    },
    {
      id: 'p6',
      title: 'Project 6: Food Series',
      imgSrc: '/Media/AI GRaphic design + photo shoot/Project 6 - food photography and ai poster create/I_want_to_2k_202512192022.jpeg',
    },
    {
      id: 'p7',
      title: 'Project 7: Cafe',
      imgSrc: '/Media/AI GRaphic design + photo shoot/Project 7 - food photography and ai poster create/2021_Jul_04_-_Cafe_202607251226.jpeg',
    },
    {
      id: 'p8',
      title: 'Project 8: SHUSHU',
      imgSrc: '/Media/AI GRaphic design + photo shoot/Project 8 - food photography and ai poster create/Nov_02_2022_-_SHUSHU_202607251231 (1).jpeg',
    },
    {
      id: 'p9',
      title: 'Project 9: AI TV Commercial',
      isVideo: true,
      imgSrc: '/Media/videography and editing/Project 9 - Ai generated Video for public Screen TV/House Grill Vermicelli Chicken 4k.mp4',
    },
    {
      id: 'p10',
      title: 'Project 10: AI Poster',
      imgSrc: '/Media/AI GRaphic design + photo shoot/Project 10 - food photography and ai poster create/June_17_2023_-_SHUSHU_202607251246.jpeg',
    },
    {
      id: 'p11',
      title: 'Project 11: Videography LXR',
      isVideo: true,
      imgSrc: '/Media/AI GRaphic design + photo shoot/project 11 - videography and editing worked at LXR/a BTS for Mother day last year for #lxrco #montreal #quebec.mp4',
    },
    {
      id: 'p12',
      title: 'Project 12: Product Photography LXR',
      imgSrc: '/Media/AI GRaphic design + photo shoot/Project 12 - product photography at LXR and ai poster create/1 góc ảnh cho công ty #lxrcoChúc mừng năm mới 2021- năm con Trâu.———---———A creative shot for #l.jpg',
    },
    {
      id: 'p13',
      title: 'Project 13: Still Life',
      imgSrc: '/Media/still life photography/project 13 - still life photography/637688407_18565730620015789_8102977794793220654_n..jpg',
    }
  ];

  return (
    <section id="collections" className="collections-section">
      <div className="section-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 className="text-massive text-outline">Exhibition</h2>
      </div>
      <div className="collections-horizontal-wrapper" ref={scrollRef}>
        {collections.map((item) => (
          <div 
            key={item.id} 
            className="collection-item-horizontal glass-panel" 
          >
            {item.isVideo ? (
              <video src={item.imgSrc} autoPlay loop muted playsInline style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(30%)'}} className="collection-media" />
            ) : (
              <img src={item.imgSrc} alt={item.title} loading="lazy" className="collection-media" />
            )}
            <div className="collection-info">
              <h3>{item.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
