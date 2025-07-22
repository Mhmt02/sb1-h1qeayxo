import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Image as ImageIcon, Video, FileText } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPercentage: number;
  categoryId: number;
  imageUrl: string;
  additionalImages: string[];
  videoUrls: string[];
  pdfUrls: string[];
  featured: boolean;
}

interface Category {
  id: number;
  name: string;
}

const ProductManager = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountPercentage: '',
    categoryId: '',
    imageUrl: '',
    additionalImages: [] as string[],
    videoUrls: [] as string[],
    pdfUrls: [] as string[],
    featured: false,
  });
  const [tempImageUrl, setTempImageUrl] = useState('');
  const [tempVideoUrl, setTempVideoUrl] = useState('');
  const [tempPdfUrl, setTempPdfUrl] = useState('');

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    const storedCategories = JSON.parse(localStorage.getItem('categories') || '[]');
    setProducts(storedProducts);
    setCategories(storedCategories);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate slug from name
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    
    const productData = {
      ...formData,
      slug,
      price: parseFloat(formData.price),
      discountPercentage: parseInt(formData.discountPercentage) || 0,
      categoryId: parseInt(formData.categoryId),
      stockQuantity: parseInt(formData.stockQuantity) || 0,
      ratingAvg: parseFloat(formData.ratingAvg) || 0,
      ratingCount: parseInt(formData.ratingCount) || 0,
      additionalImages: formData.additionalImages,
      videoUrls: formData.videoUrls,
      pdfUrls: formData.pdfUrls,
    };

    if (editingProduct) {
      const updatedProducts = products.map(product => 
        product.id === editingProduct.id 
          ? { ...product, ...productData }
          : product
      );
      setProducts(updatedProducts);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
    } else {
      const newProduct = {
        id: Date.now(),
        ...productData,
      };
      const updatedProducts = [...products, newProduct];
      setProducts(updatedProducts);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
    }

    setIsModalOpen(false);
    setEditingProduct(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      shortDescription: '',
      price: '',
      discountPercentage: '',
      categoryId: '',
      imageUrl: '',
      additionalImages: [],
      videoUrls: [],
      pdfUrls: [],
      featured: false,
      sku: '',
      stockQuantity: '',
      ratingAvg: '',
      ratingCount: '',
    });
    setTempImageUrl('');
    setTempVideoUrl('');
    setTempPdfUrl('');
  };

  const deleteProduct = (id: number) => {
    if (window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      const updatedProducts = products.filter(product => product.id !== id);
      setProducts(updatedProducts);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
    }
  };

  const editProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug || '',
      description: product.description,
      shortDescription: product.shortDescription || '',
      price: product.price.toString(),
      discountPercentage: product.discountPercentage.toString(),
      categoryId: product.categoryId.toString(),
      imageUrl: product.imageUrl,
      additionalImages: product.additionalImages || [],
      videoUrls: product.videoUrls || [],
      pdfUrls: product.pdfUrls || [],
      featured: product.featured,
      sku: product.sku || '',
      stockQuantity: product.stockQuantity?.toString() || '',
      ratingAvg: product.ratingAvg?.toString() || '',
      ratingCount: product.ratingCount?.toString() || '',
    });
    setIsModalOpen(true);
  };

  const addAdditionalImage = () => {
    if (tempImageUrl && !formData.additionalImages.includes(tempImageUrl)) {
      setFormData({
        ...formData,
        additionalImages: [...formData.additionalImages, tempImageUrl]
      });
      setTempImageUrl('');
    }
  };

  const removeAdditionalImage = (index: number) => {
    setFormData({
      ...formData,
      additionalImages: formData.additionalImages.filter((_, i) => i !== index)
    });
  };

  const addVideoUrl = () => {
    if (tempVideoUrl && !formData.videoUrls.includes(tempVideoUrl)) {
      setFormData({
        ...formData,
        videoUrls: [...formData.videoUrls, tempVideoUrl]
      });
      setTempVideoUrl('');
    }
  };

  const removeVideoUrl = (index: number) => {
    setFormData({
      ...formData,
      videoUrls: formData.videoUrls.filter((_, i) => i !== index)
    });
  };

  const addPdfUrl = () => {
    if (tempPdfUrl && !formData.pdfUrls.includes(tempPdfUrl)) {
      setFormData({
        ...formData,
        pdfUrls: [...formData.pdfUrls, tempPdfUrl]
      });
      setTempPdfUrl('');
    }
  };

  const removePdfUrl = (index: number) => {
    setFormData({
      ...formData,
      pdfUrls: formData.pdfUrls.filter((_, i) => i !== index)
    });
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Kategori Bulunamadı';
  };

  const getVideoThumbnail = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1].split('&')[0];
      return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    }
    return 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=150&fit=crop';
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Ürün Yönetimi</h1>
        <button
          onClick={() => {
            setEditingProduct(null);
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Yeni Ürün
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ürün
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kategori
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fiyat
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                İndirim
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Medya
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={product.imageUrl}
                        alt={product.name}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {product.featured && <span className="text-green-600">Öne Çıkan</span>}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {getCategoryName(product.categoryId)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{product.price} TL</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {product.discountPercentage > 0 ? `%${product.discountPercentage}` : '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-4 text-sm text-gray-900">
                    <div className="flex items-center">
                      <ImageIcon className="h-4 w-4 mr-1 text-blue-600" />
                      <span>{1 + (product.additionalImages?.length || 0)}</span>
                    </div>
                    <div className="flex items-center">
                      <Video className="h-4 w-4 mr-1 text-green-600" />
                      <span>{product.videoUrls?.length || 0}</span>
                    </div>
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-1 text-red-600" />
                      <span>{product.pdfUrls?.length || 0}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => editProduct(product)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ürün Adı
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategori
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  >
                    <option value="">Kategori Seçin</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Açıklama
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fiyat (TL)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    İndirim Yüzdesi
                  </label>
                  <input
                    type="number"
                    value={formData.discountPercentage}
                    onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ana Görsel URL
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ürün Slug (URL)
                </label>
                <input
                  type="text"
                  value={formData.slug || ''}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md bg-gray-50"
                  placeholder="Otomatik oluşturulur"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stok Miktarı
                </label>
                <input
                  type="number"
                  value={formData.stockQuantity || ''}
                  onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  min="0"
                  placeholder="Stok adedi"
                           />
              </div>   
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kısa Açıklama
                  </label>
                  <textarea
                    value={formData.shortDescription || ''}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    rows={2}
                    placeholder="Ürün için kısa açıklama"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SKU (Stok Kodu)
                  </label>
                  <input
                    type="text"
                    value={formData.sku || ''}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Örn: PRD-001"
                  />
                </div>
              </div>

              {/* Additional Images Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ek Görseller
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="url"
                    value={tempImageUrl}
                    onChange={(e) => setTempImageUrl(e.target.value)}
                    placeholder="Görsel URL'si"
                    className="flex-1 px-3 py-2 border rounded-md"
                  />
                  <button
                    type="button"
                    onClick={addAdditionalImage}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 flex items-center"
                  >
                    <ImageIcon className="h-5 w-5 mr-1" />
                    Ekle
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {formData.additionalImages.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt=""
                        className="w-full h-24 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeAdditionalImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Video URLs Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video URL'leri
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="url"
                    value={tempVideoUrl}
                    onChange={(e) => setTempVideoUrl(e.target.value)}
                    placeholder="Video URL'si (YouTube, Vimeo, vb.)"
                    className="flex-1 px-3 py-2 border rounded-md"
                  />
                  <button
                    type="button"
                    onClick={addVideoUrl}
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 flex items-center"
                  >
                    <Video className="h-5 w-5 mr-1" />
                    Ekle
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.videoUrls.map((url, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                      <img
                        src={getVideoThumbnail(url)}
                        alt=""
                        className="w-16 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <Video className="h-5 w-5 text-green-600 inline mr-2" />
                        <span className="text-sm truncate">{url}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeVideoUrl(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* PDF URLs Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PDF URL'leri
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="url"
                    value={tempPdfUrl}
                    onChange={(e) => setTempPdfUrl(e.target.value)}
                    placeholder="PDF URL'si (Katalog, Kullanım Kılavuzu, vb.)"
                    className="flex-1 px-3 py-2 border rounded-md"
                  />
                  <button
                    type="button"
                    onClick={addPdfUrl}
                    className="px-4 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 flex items-center"
                  >
                    <FileText className="h-5 w-5 mr-1" />
                    Ekle
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.pdfUrls.map((url, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                      <div className="bg-red-100 p-2 rounded">
                        <FileText className="h-5 w-5 text-red-600" />
                      </div>
                      <span className="flex-1 text-sm truncate">{url}</span>
                      <button
                        type="button"
                        onClick={() => removePdfUrl(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                  Öne Çıkan Ürün
                </label>
              </div>

              {/* Rating Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ortalama Puan (1-5)
                  </label>
                  <input
                    type="number"
                    value={formData.ratingAvg || ''}
                    onChange={(e) => setFormData({ ...formData, ratingAvg: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    min="0"
                    max="5"
                    step="0.1"
                    placeholder="4.7"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Değerlendirme Sayısı
                  </label>
                  <input
                    type="number"
                    value={formData.ratingCount || ''}
                    onChange={(e) => setFormData({ ...formData, ratingCount: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    min="0"
                    placeholder="356"
                  />
                </div>
              </div>
          
              <div className="flex justify-end gap-2 pt-4 border-t">
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
                  {editingProduct ? 'Güncelle' : 'Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManager;
