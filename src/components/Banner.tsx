import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Banner {
  id: number;
  image_url: string;
  title?: string;
  subtitle?: string;
  link_url?: string;
  is_active: boolean;
  order_num: number;
}

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const navigate = useNavigate();

  // Sample banners for demonstration
  const sampleBanners: Banner[] = [
    {
      id: 1,
      image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop',
      title: 'Yeni Sezon İndirimleri',
      subtitle: 'Tüm kategorilerde %50\'ye varan indirimler',
      link_url: '/urunler',
      is_active: true,
      order_num: 1
    },
    {
      id: 2,
      image_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=400&fit=crop',
      title: 'Ücretsiz Kargo',
      subtitle: '200 TL ve üzeri alışverişlerde',
      link_url: '/urunler',
      is_active: true,
      order_num: 2
    },
    {
      id: 3,
      image_url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=400&fit=crop',
      title: 'Teknoloji Ürünleri',
      subtitle: 'En yeni teknoloji ürünleri burada',
      link_url: '/urunler?category=1',
      is_active: true,
      order_num: 3
    },
    {
      id: 4,
      image_url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=400&fit=crop',
      title: 'Moda & Giyim',
      subtitle: 'Trend olan her şey',
      link_url: '/urunler?category=2',
      is_active: true,
      order_num: 4
    },
    {
      id: 5,
      image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=400&fit=crop',
      title: 'Ev & Yaşam',
      subtitle: 'Evinizi güzelleştirin',
      link_url: '/urunler?category=3',
      is_active: true,
      order_num: 5
    }
  ];

  useEffect(() => {
    // Load banners from localStorage or use sample banners
    const storedBanners = JSON.parse(localStorage.getItem('banners') || '[]');
    if (storedBanners.length === 0) {
      // If no banners in localStorage, use sample banners and save them
      setBanners(sampleBanners);
      localStorage.setItem('banners', JSON.stringify(sampleBanners));
    } else {
      setBanners(storedBanners.filter((banner: Banner) => banner.is_active));
    }
  }, []);

  // Auto-scroll functionality - 20 seconds interval
  useEffect(() => {
    if (banners.length === 0 || !isAutoPlaying) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 20000); // 20 seconds

    return () => clearInterval(timer);
  }, [banners.length, isAutoPlaying]);

  const handleBannerClick = (banner: Banner) => {
    if (banner.link_url) {
      navigate(banner.link_url);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 5 seconds
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  if (banners.length === 0) return null;

  return (
    <div className="relative h-[500px] overflow-hidden bg-gray-900 group">
      {/* Banner Container */}
      <div
        className="flex transition-transform duration-1000 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="min-w-full h-full relative cursor-pointer"
            onClick={() => handleBannerClick(banner)}
          >
            <img
              src={banner.image_url}
              alt={banner.title || 'Banner'}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent flex items-center">
              <div className="max-w-7xl mx-auto px-4 w-full">
                <div className="max-w-2xl">
                  {banner.title && (
                    <h2 className="text-white text-5xl font-bold mb-4 leading-tight">
                      {banner.title}
                    </h2>
                  )}
                  {banner.subtitle && (
                    <p className="text-white/90 text-xl mb-6 leading-relaxed">
                      {banner.subtitle}
                    </p>
                  )}
                  {banner.link_url && (
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300 transform hover:scale-105">
                      Keşfet
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === index 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      {/* Auto-play Indicator */}
      <div className="absolute top-4 right-4">
        <div className={`w-2 h-2 rounded-full ${isAutoPlaying ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
      </div>
    </div>
  );
};

export default Banner;