import React, { useState, useEffect } from 'react';
import { Trash2, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      if (window.confirm('Favorileri görüntülemek için üye olmanız gerekmektedir. Üye olmak ister misiniz?')) {
        navigate('/kayit');
      } else {
        navigate('/');
      }
      return;
    }

    setIsAuthenticated(true);
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, [navigate]);

  const removeFromFavorites = (productId: number) => {
    const updatedFavorites = favorites.filter(item => item.id !== productId);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  if (!isAuthenticated) {
    return null;
  }

  if (favorites.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center mb-8">Favorilerim</h1>
        <div className="text-center text-gray-500">
          <p>Favori listenizde henüz ürün bulunmamaktadır.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Favorilerim</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {favorites.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              {product.discountPercentage > 0 && (
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded">
                  %{product.discountPercentage} İndirim
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              <div className="flex justify-between items-center">
                <div>
                  {product.discountPercentage > 0 ? (
                    <>
                      <span className="text-gray-500 line-through">
                        {product.price} TL
                      </span>
                      <span className="text-xl font-bold text-red-500 ml-2">
                        {product.price * (1 - product.discountPercentage / 100)} TL
                      </span>
                    </>
                  ) : (
                    <span className="text-xl font-bold">{product.price} TL</span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => removeFromFavorites(product.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full">
                    <ShoppingCart className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;