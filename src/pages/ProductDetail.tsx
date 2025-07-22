import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  ShoppingCart, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  FileText, 
  Download,
  Image as ImageIcon,
  Video,
  Eye,
  ArrowLeft,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  ChevronDown,
  Check,
  Info,
  Package,
  Clock,
  MapPin,
  CreditCard
} from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('images');
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [categories, setCategories] = useState([]);

  // Sample colors and sizes
  const colors = [
    { name: 'Siyah', value: 'black', hex: '#000000' },
    { name: 'Beyaz', value: 'white', hex: '#FFFFFF' },
    { name: 'Lacivert', value: 'navy', hex: '#1e3a8a' },
    { name: 'Gri', value: 'gray', hex: '#6b7280' }
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);

    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const storedCategories = JSON.parse(localStorage.getItem('categories') || '[]');
    setCategories(storedCategories);
    
    const foundProduct = products.find((p: any) => p.id === parseInt(id || '0'));
    
    if (foundProduct) {
      setProduct(foundProduct);
      setSelectedColor(colors[0].value);
      setSelectedSize(sizes[2]); // Default to M
      
      // Check if product is in favorites
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setIsFavorite(favorites.some((fav: any) => fav.id === foundProduct.id));
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      alert('Lütfen renk ve beden seçin');
      return;
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartItem = {
      ...product,
      quantity,
      selectedColor,
      selectedSize,
      cartId: `${product.id}-${selectedColor}-${selectedSize}`
    };

    const existingItem = cart.find((item: any) => 
      item.id === product.id && 
      item.selectedColor === selectedColor && 
      item.selectedSize === selectedSize
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      localStorage.setItem('cart', JSON.stringify([...cart, cartItem]));
    }

    alert(`${quantity} adet ürün sepete eklendi!`);
  };

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      if (window.confirm('Favorilere eklemek için üye olmanız gerekmektedir. Üye olmak ister misiniz?')) {
        navigate('/kayit');
      }
      return;
    }

    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (isFavorite) {
      const updatedFavorites = favorites.filter((fav: any) => fav.id !== product.id);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setIsFavorite(false);
      alert('Ürün favorilerden çıkarıldı!');
    } else {
      localStorage.setItem('favorites', JSON.stringify([...favorites, product]));
      setIsFavorite(true);
      alert('Ürün favorilere eklendi!');
    }
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? (product.additionalImages?.length || 0) : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === (product.additionalImages?.length || 0) ? 0 : prev + 1
    );
  };

  const getCategoryPath = (categoryId: number) => {
    const category = categories.find((c: any) => c.id === categoryId);
    if (!category) return [];
    
    const path = [category];
    let parent = categories.find((c: any) => c.id === category.parent_id);
    
    while (parent) {
      path.unshift(parent);
      parent = categories.find((c: any) => c.id === parent.parent_id);
    }
    
    return path;
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Ürün yükleniyor...</p>
        </div>
      </div>
    );
  }

  const allImages = [product.imageUrl, ...(product.additionalImages || [])];
  const hasVideos = product.videoUrls && product.videoUrls.length > 0;
  const hasPdfs = product.pdfUrls && product.pdfUrls.length > 0;
  const finalPrice = product.discountPercentage > 0 
    ? product.price * (1 - product.discountPercentage / 100) 
    : product.price;
  const categoryPath = getCategoryPath(product.categoryId);

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <button
              onClick={() => navigate('/')}
              className="text-gray-500 hover:text-indigo-600 transition-colors"
            >
              Trendyol
            </button>
            <span className="text-gray-400">›</span>
            <button
              onClick={() => navigate('/urunler')}
              className="text-gray-500 hover:text-indigo-600 transition-colors"
            >
              Men
            </button>
            {categoryPath.map((cat, index) => (
              <React.Fragment key={cat.id}>
                <span className="text-gray-400">›</span>
                <button
                  onClick={() => navigate(`/urunler?category=${cat.id}`)}
                  className="text-gray-500 hover:text-indigo-600 transition-colors"
                >
                  {cat.name}
                </button>
              </React.Fragment>
            ))}
            <span className="text-gray-400">›</span>
            <span className="text-gray-900 font-medium">Etikmen Men Shirts</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="relative">
              <div className="aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg">
                <img
                  src={allImages[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Navigation */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all transform hover:scale-105 ${
                      currentImageIndex === index 
                        ? 'border-orange-500 ring-2 ring-orange-200 shadow-lg' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand and Title */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                  BEST SELLER
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                <span className="text-blue-600">Etikmen</span> Easy-Iron Dakron Plain Black Slimfit Men's Shirt with Gift Box
              </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <span className="text-2xl font-bold mr-2">4.7</span>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= 4.7 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-600">(356)</span>
              </div>
            </div>

            {/* Customer Love */}
            <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <span className="text-2xl">😍</span>
              <div>
                <div className="font-semibold text-yellow-800">Customers love it!</div>
                <div className="text-sm text-yellow-600">8k people favorited this</div>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-orange-600">27,99€</span>
                <span className="text-xl text-gray-500 line-through">79,99€</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-red-600" />
                <span className="text-red-600 font-medium">Only 1 left</span>
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Color</h3>
              <div className="flex gap-3">
                {colors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setSelectedColor(color.value)}
                    className={`w-12 h-12 rounded-lg border-2 transition-all transform hover:scale-110 ${
                      selectedColor === color.value
                        ? 'border-orange-500 ring-2 ring-orange-200'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {color.hex === '#FFFFFF' && (
                      <div className="w-full h-full rounded-lg border border-gray-200"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Size</h3>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
              >
                <option value="">Please select your size</option>
                {sizes.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            {/* Add to Cart */}
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 px-6 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                ADD TO CART
              </button>
              
              <button
                onClick={handleToggleFavorite}
                className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg border-2 transition-all ${
                  isFavorite
                    ? 'bg-red-50 border-red-300 text-red-600'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Heart className="h-5 w-5" fill={isFavorite ? 'currentColor' : 'none'} />
                <span className="font-medium">1.5K</span>
              </button>
            </div>

            {/* Payment Methods */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-3 flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Payment methods
              </h4>
              <div className="flex gap-2">
                <div className="bg-red-600 text-white px-3 py-2 rounded text-sm font-bold">MC</div>
                <div className="bg-blue-600 text-white px-3 py-2 rounded text-sm font-bold">VISA</div>
                <div className="bg-blue-500 text-white px-3 py-2 rounded text-sm font-bold">AMEX</div>
                <div className="bg-gray-600 text-white px-3 py-2 rounded text-sm font-bold">TROY</div>
                <div className="bg-blue-700 text-white px-3 py-2 rounded text-sm font-bold">PayPal</div>
              </div>
            </div>

            {/* Shipping & Delivery */}
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold mb-3 flex items-center text-green-800">
                <Truck className="h-5 w-5 mr-2" />
                Shipping & Delivery
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-green-700">
                  <span className="font-medium">Delivery: 31 July - 6 August</span>
                </div>
                <div className="text-green-600">Shipped from Poland</div>
              </div>
            </div>

            {/* Trendyol Commitments */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold mb-3 flex items-center text-blue-800">
                <Shield className="h-5 w-5 mr-2" />
                Trendyol commitments
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center text-blue-700">
                  <Check className="h-4 w-4 mr-2 text-blue-600" />
                  <span>Shopping security</span>
                </div>
                <div className="flex items-center text-blue-700">
                  <Check className="h-4 w-4 mr-2 text-blue-600" />
                  <span>Safe delivery</span>
                </div>
                <div className="flex items-center text-blue-700">
                  <Check className="h-4 w-4 mr-2 text-blue-600" />
                  <span>Privacy protection</span>
                </div>
                <div className="flex items-center text-blue-700">
                  <Check className="h-4 w-4 mr-2 text-blue-600" />
                  <span>Easy return</span>
                </div>
              </div>
            </div>

            {/* Free Returns */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <RotateCcw className="h-5 w-5 mr-2 text-green-600" />
                  <span className="font-medium">Free returns</span>
                </div>
                <span className="text-sm text-gray-600">Easy and free return in 30 days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16 bg-white rounded-lg border overflow-hidden">
          <div className="border-b">
            <div className="flex">
              <button className="px-6 py-4 border-b-2 border-orange-500 text-orange-600 font-semibold">
                Product details
              </button>
              <button className="px-6 py-4 text-gray-600 hover:text-gray-900">
                Product information
              </button>
              <button className="px-6 py-4 text-gray-600 hover:text-gray-900">
                Additional info
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-bold text-lg mb-4">Product details</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>The mannequin body is medium(m).</div>
                  <div>Height: 180; weight: 81</div>
                  <div className="mt-4">
                    Our detailed label is size chart. The product images are 
                    included, if you have an intermediate size, you can ask 
                    the seller a question or get help from the support section.
                  </div>
                  <div className="mt-4">
                    You can watch the premium craftsmanship and sewing 
                    quality of our products by clicking on the product video.
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-lg mb-4">Product information</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div><strong>Color:</strong> Black</div>
                  <div><strong>Sold and fulfilled by:</strong> Trendyol</div>
                  <div><strong>A maximum of 3 units:</strong> You can order 3 units of this product</div>
                  <div><strong>Cargo reserve:</strong> Trendyol reserves the right to cancel</div>
                  <div><strong>EU Responsible details:</strong> here</div>
                  <div><strong>Origin:</strong> TR</div>
                  <div><strong>Barcode No:</strong> PRA-4653358461839-1</div>
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-lg mb-4">Additional info</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>Sold and shipped by Trendyol</div>
                  <div>Maximum 3 units can be ordered</div>
                  <div>Cargo reserve right is reserved</div>
                  <div>Free return within 30 days</div>
                  <div>Secure payment options</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;