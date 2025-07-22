import React, { useState, useEffect } from 'react';
import { Filter, Heart, ShoppingCart, Search, Grid, List, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const navigate = useNavigate();

  useEffect(() => {
    const storedCategories = JSON.parse(localStorage.getItem('categories') || '[]');
    const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    
    // Build hierarchical category structure for display
    const buildCategoryTree = (flatCategories) => {
      const categoryMap = new Map();
      const rootCategories = [];

      flatCategories.forEach(cat => {
        categoryMap.set(cat.id, { ...cat, children: [] });
      });

      flatCategories.forEach(cat => {
        const category = categoryMap.get(cat.id);
        if (cat.parent_id) {
          const parent = categoryMap.get(cat.parent_id);
          if (parent) {
            parent.children.push(category);
          }
        } else {
          rootCategories.push(category);
        }
      });

      return rootCategories;
    };

    setCategories(buildCategoryTree(storedCategories));
    setProducts(storedProducts);

    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const filteredProducts = products
    .filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.categoryId === parseInt(selectedCategory);
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'newest':
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        default:
          return 0;
      }
    });

  const addToFavorites = (product) => {
    if (!isAuthenticated) {
      if (window.confirm('Favorilere eklemek için üye olmanız gerekmektedir. Üye olmak ister misiniz?')) {
        navigate('/kayit');
      }
      return;
    }

    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const isAlreadyFavorite = favorites.some((fav) => fav.id === product.id);
    
    if (!isAlreadyFavorite) {
      const updatedFavorites = [...favorites, product];
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      alert('Ürün favorilere eklendi!');
    } else {
      const updatedFavorites = favorites.filter((fav) => fav.id !== product.id);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      alert('Ürün favorilerden çıkarıldı!');
    }
  };

  const isFavorite = (productId) => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    return favorites.some((fav) => fav.id === productId);
  };

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      const newItem = { ...product, quantity: 1 };
      localStorage.setItem('cart', JSON.stringify([...cart, newItem]));
    }

    alert('Ürün sepete eklendi!');
  };

  const getFinalPrice = (product) => {
    return product.discountPercentage > 0 
      ? product.price * (1 - product.discountPercentage / 100)
      : product.price;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Ürünlerimiz
          </h1>
          
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Ürün ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
              />
            </div>
            
            <div className="flex gap-4 items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
              >
                <option value="name">İsme Göre</option>
                <option value="price-low">Fiyat (Düşük-Yüksek)</option>
                <option value="price-high">Fiyat (Yüksek-Düşük)</option>
                <option value="newest">En Yeni</option>
              </select>
              
              <div className="flex border-2 border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 transition-all ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 transition-all ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8">
              <div className="flex items-center mb-6">
                <Filter className="h-6 w-6 text-indigo-600 mr-3" />
                <h2 className="text-xl font-bold text-gray-900">Kategoriler</h2>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-6 py-4 rounded-xl font-medium transition-all transform hover:scale-105 ${
                    selectedCategory === 'all'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Tüm Ürünler
                  <span className="float-right bg-white/20 px-2 py-1 rounded-full text-sm">
                    {products.length}
                  </span>
                </button>
                {categories.map(category => (
                  <div key={category.id}>
                    <button
                      onClick={() => setSelectedCategory(category.id.toString())}
                      className={`w-full text-left px-6 py-4 rounded-xl font-medium transition-all transform hover:scale-105 ${
                        selectedCategory === category.id.toString()
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {category.name}
                      <span className="float-right bg-white/20 px-2 py-1 rounded-full text-sm">
                        {products.filter(p => p.categoryId === category.id).length}
                      </span>
                    </button>
                    {category.children && category.children.length > 0 && (
                      <div className="ml-4 mt-2 space-y-2">
                        {category.children.map(subCategory => (
                          <button
                            key={subCategory.id}
                            onClick={() => setSelectedCategory(subCategory.id.toString())}
                            className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all transform hover:scale-105 ${
                              selectedCategory === subCategory.id.toString()
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            └─ {subCategory.name}
                            <span className="float-right bg-white/20 px-2 py-1 rounded-full text-xs">
                              {products.filter(p => p.categoryId === subCategory.id).length}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            <div className="mb-6">
              <p className="text-gray-600 text-lg">
                <span className="font-semibold text-indigo-600">{filteredProducts.length}</span> ürün bulundu
              </p>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredProducts.map(product => (
                  <div key={product.id} className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 group">
                    <div className="relative overflow-hidden">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-64 object-cover cursor-pointer group-hover:scale-110 transition-transform duration-500"
                        onClick={() => navigate(`/urun/${product.id}`)}
                      />
                      {product.discountPercentage > 0 && (
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-2 rounded-full font-bold shadow-lg">
                          %{product.discountPercentage} İndirim
                        </div>
                      )}
                      <div className="absolute top-4 left-4 flex gap-2">
                        <button 
                          onClick={() => addToFavorites(product)}
                          className={`p-3 rounded-full transition-all transform hover:scale-110 shadow-lg ${
                            isFavorite(product.id)
                              ? 'bg-red-500 text-white'
                              : 'bg-white/90 text-gray-600 hover:bg-white'
                          }`}
                        >
                          <Heart className="h-5 w-5" fill={isFavorite(product.id) ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 
                        className="text-xl font-bold mb-3 cursor-pointer hover:text-indigo-600 transition-colors line-clamp-2"
                        onClick={() => navigate(`/urun/${product.id}`)}
                      >
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center mb-4">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= (product.rating_avg || 0)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-gray-600 text-sm">
                          ({product.rating_count || 0})
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          {product.discountPercentage > 0 ? (
                            <div className="flex flex-col">
                              <span className="text-gray-500 line-through text-sm">
                                {product.price.toFixed(2)} TL
                              </span>
                              <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                                {getFinalPrice(product).toFixed(2)} TL
                              </span>
                            </div>
                          ) : (
                            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                              {product.price.toFixed(2)} TL
                            </span>
                          )}
                        </div>
                        <button 
                          onClick={() => addToCart(product)}
                          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-110 shadow-lg"
                        >
                          <ShoppingCart className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredProducts.map(product => (
                  <div key={product.id} className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.02] transition-all duration-300">
                    <div className="flex flex-col md:flex-row">
                      <div className="relative md:w-80 h-64 md:h-auto overflow-hidden">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform duration-500"
                          onClick={() => navigate(`/urun/${product.id}`)}
                        />
                        {product.discountPercentage > 0 && (
                          <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-2 rounded-full font-bold shadow-lg">
                            %{product.discountPercentage} İndirim
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 p-8">
                        <div className="flex justify-between items-start mb-4">
                          <h3 
                            className="text-2xl font-bold cursor-pointer hover:text-indigo-600 transition-colors"
                            onClick={() => navigate(`/urun/${product.id}`)}
                          >
                            {product.name}
                          </h3>
                          <button 
                            onClick={() => addToFavorites(product)}
                            className={`p-3 rounded-full transition-all transform hover:scale-110 ${
                              isFavorite(product.id)
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            <Heart className="h-5 w-5" fill={isFavorite(product.id) ? 'currentColor' : 'none'} />
                          </button>
                        </div>
                        
                        <div className="flex items-center mb-4">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-5 w-5 ${
                                  star <= (product.rating_avg || 0)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="ml-3 text-gray-600">
                            ({product.rating_count || 0} değerlendirme)
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-6 line-clamp-3">{product.description}</p>
                        
                        <div className="flex justify-between items-center">
                          <div>
                            {product.discountPercentage > 0 ? (
                              <div className="flex items-center gap-4">
                                <span className="text-gray-500 line-through text-lg">
                                  {product.price.toFixed(2)} TL
                                </span>
                                <span className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                                  {getFinalPrice(product).toFixed(2)} TL
                                </span>
                              </div>
                            ) : (
                              <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                {product.price.toFixed(2)} TL
                              </span>
                            )}
                          </div>
                          <button 
                            onClick={() => addToCart(product)}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg flex items-center font-semibold"
                          >
                            <ShoppingCart className="h-5 w-5 mr-2" />
                            Sepete Ekle
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Ürün bulunamadı</h3>
                <p className="text-gray-600">Arama kriterlerinizi değiştirmeyi deneyin.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;