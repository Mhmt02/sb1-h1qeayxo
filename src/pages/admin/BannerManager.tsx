import React, { useState, useEffect } from 'react';
import { Plus, ArrowUp, ArrowDown, Trash2, Pencil } from 'lucide-react';

interface Banner {
  id: number;
  image_url: string;
  title?: string;
  subtitle?: string;
  link_url?: string;
  is_active: boolean;
  order_num: number;
}

interface Category {
  id: number;
  name: string;
}

const BannerManager = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image_url: '',
    link_url: '',
    is_active: true,
  });

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
    const storedBanners = JSON.parse(localStorage.getItem('banners') || '[]');
    const storedCategories = JSON.parse(localStorage.getItem('categories') || '[]');
    
    // If no banners exist, initialize with sample banners
    if (storedBanners.length === 0) {
      setBanners(sampleBanners);
      localStorage.setItem('banners', JSON.stringify(sampleBanners));
    } else {
      setBanners(storedBanners);
    }
    
    setCategories(storedCategories);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingBanner) {
      const updatedBanners = banners.map(banner => 
        banner.id === editingBanner.id 
          ? { ...banner, ...formData }
          : banner
      );
      setBanners(updatedBanners);
      localStorage.setItem('banners', JSON.stringify(updatedBanners));
    } else {
      const newBanner = {
        id: Date.now(),
        ...formData,
        order_num: banners.length + 1
      };
      const updatedBanners = [...banners, newBanner];
      setBanners(updatedBanners);
      localStorage.setItem('banners', JSON.stringify(updatedBanners));
    }

    setIsModalOpen(false);
    setEditingBanner(null);
    setFormData({ 
      title: '', 
      subtitle: '', 
      image_url: '', 
      link_url: '', 
      is_active: true 
    });
  };

  const deleteBanner = (id: number) => {
    if (window.confirm('Bu banner\'ı silmek istediğinizden emin misiniz?')) {
      const updatedBanners = banners.filter(banner => banner.id !== id);
      setBanners(updatedBanners);
      localStorage.setItem('banners', JSON.stringify(updatedBanners));
    }
  };

  const editBanner = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      image_url: banner.image_url,
      link_url: banner.link_url || '',
      is_active: banner.is_active,
    });
    setIsModalOpen(true);
  };

  const moveOrder = (id: number, direction: 'up' | 'down') => {
    const index = banners.findIndex(banner => banner.id === id);
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === banners.length - 1)) return;

    const newBanners = [...banners];
    const temp = newBanners[index];
    if (direction === 'up') {
      newBanners[index] = newBanners[index - 1];
      newBanners[index - 1] = temp;
    } else {
      newBanners[index] = newBanners[index + 1];
      newBanners[index + 1] = temp;
    }

    // Update order numbers
    newBanners.forEach((banner, idx) => {
      banner.order_num = idx + 1;
    });

    setBanners(newBanners);
    localStorage.setItem('banners', JSON.stringify(newBanners));
  };

  const toggleActive = (id: number) => {
    const updatedBanners = banners.map(banner =>
      banner.id === id ? { ...banner, is_active: !banner.is_active } : banner
    );
    setBanners(updatedBanners);
    localStorage.setItem('banners', JSON.stringify(updatedBanners));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Banner Yönetimi</h1>
          <p className="text-gray-600 mt-1">Bannerlar 20 saniye aralıklarla otomatik değişir</p>
        </div>
        <button
          onClick={() => {
            setEditingBanner(null);
            setFormData({ 
              title: '', 
              subtitle: '', 
              image_url: '', 
              link_url: '', 
              is_active: true 
            });
            setIsModalOpen(true);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Yeni Banner
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {banners.map((banner, index) => (
          <div key={banner.id} className={`bg-white p-4 rounded-lg shadow-md border-l-4 ${
            banner.is_active ? 'border-green-500' : 'border-gray-300'
          }`}>
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={banner.image_url}
                  alt={banner.title}
                  className="w-40 h-24 object-cover rounded-lg"
                />
                {!banner.is_active && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-medium">Pasif</span>
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-lg">{banner.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    banner.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {banner.is_active ? 'Aktif' : 'Pasif'}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{banner.subtitle}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Sıra: {index + 1}</span>
                  {banner.link_url && (
                    <span>Link: {banner.link_url}</span>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <div className="flex gap-1">
                  <button
                    onClick={() => moveOrder(banner.id, 'up')}
                    disabled={index === 0}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Yukarı taşı"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => moveOrder(banner.id, 'down')}
                    disabled={index === banners.length - 1}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Aşağı taşı"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="flex gap-1">
                  <button
                    onClick={() => toggleActive(banner.id)}
                    className={`px-3 py-1 rounded text-xs font-medium ${
                      banner.is_active
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    {banner.is_active ? 'Pasifleştir' : 'Aktifleştir'}
                  </button>
                </div>
                
                <div className="flex gap-1">
                  <button
                    onClick={() => editBanner(banner)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                    title="Düzenle"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteBanner(banner.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                    title="Sil"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">
              {editingBanner ? 'Banner Düzenle' : 'Yeni Banner'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Başlık
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alt Başlık
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Görsel URL
                </label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link URL (Opsiyonel)
                </label>
                <input
                  type="text"
                  value={formData.link_url}
                  onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="/urunler veya /urunler?category=1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Örnek: /urunler, /urunler?category=1, /hakkimizda
                </p>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                  Aktif Banner
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  {editingBanner ? 'Güncelle' : 'Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerManager;