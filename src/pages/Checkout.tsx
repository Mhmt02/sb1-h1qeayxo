import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, ShoppingCart, MapPin, User, Phone, Mail, Package, Shield, Clock } from 'lucide-react';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [total, setTotal] = useState(0);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(items);

    const cartTotal = items.reduce((sum, item) => {
      const price = item.discountPercentage > 0
        ? item.price * (1 - item.discountPercentage / 100)
        : item.price;
      return sum + (price * item.quantity);
    }, 0);
    setTotal(cartTotal);
  }, []);

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
  };

  const handleContinue = () => {
    if (!paymentMethod) {
      alert('Lütfen bir ödeme yöntemi seçin');
      return;
    }

    if (!shippingInfo.fullName || !shippingInfo.email || !shippingInfo.phone || !shippingInfo.address) {
      alert('Lütfen tüm teslimat bilgilerini doldurun');
      return;
    }

    // Store shipping info for payment pages
    localStorage.setItem('shippingInfo', JSON.stringify(shippingInfo));
    localStorage.setItem('cartTotal', total.toString());

    switch (paymentMethod) {
      case 'credit-card':
        navigate('/odeme/kredi-karti');
        break;
      case 'cash-on-delivery':
        navigate('/odeme/kapida-odeme');
        break;
      case 'paypal':
        navigate('/odeme/paypal');
        break;
      default:
        break;
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-12 max-w-md">
          <div className="text-6xl mb-6">🛒</div>
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Sepetiniz Boş</h2>
          <p className="text-gray-600 mb-8">Alışverişe devam etmek için ürünler sayfasını ziyaret edin.</p>
          <button
            onClick={() => navigate('/urunler')}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg font-semibold"
          >
            Ürünlere Git
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Ödeme
          </h1>
          <div className="flex items-center mt-4 space-x-4">
            <div className="flex items-center text-green-600">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold mr-2">1</div>
              <span className="font-medium">Sepet</span>
            </div>
            <div className="w-12 h-1 bg-green-600 rounded"></div>
            <div className="flex items-center text-indigo-600">
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold mr-2">2</div>
              <span className="font-medium">Ödeme</span>
            </div>
            <div className="w-12 h-1 bg-gray-300 rounded"></div>
            <div className="flex items-center text-gray-400">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold mr-2">3</div>
              <span className="font-medium">Tamamlandı</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Information */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center mb-6">
                <MapPin className="h-6 w-6 text-indigo-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Teslimat Bilgileri</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="h-4 w-4 inline mr-2" />
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    value={shippingInfo.fullName}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                    placeholder="Adınız ve soyadınız"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="h-4 w-4 inline mr-2" />
                    E-posta
                  </label>
                  <input
                    type="email"
                    value={shippingInfo.email}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                    placeholder="E-posta adresiniz"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="h-4 w-4 inline mr-2" />
                    Telefon
                  </label>
                  <input
                    type="tel"
                    value={shippingInfo.phone}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                    placeholder="Telefon numaranız"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Şehir
                  </label>
                  <input
                    type="text"
                    value={shippingInfo.city}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                    placeholder="Şehir"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adres
                  </label>
                  <textarea
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                    rows={3}
                    placeholder="Tam adresiniz"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Posta Kodu
                  </label>
                  <input
                    type="text"
                    value={shippingInfo.zipCode}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                    placeholder="Posta kodu"
                  />
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Ödeme Yöntemi Seçin</h2>
              <div className="space-y-4">
                <div
                  className={`border-2 rounded-xl p-6 cursor-pointer transition-all transform hover:scale-105 ${
                    paymentMethod === 'credit-card' 
                      ? 'border-indigo-600 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-lg' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handlePaymentMethodSelect('credit-card')}
                >
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-xl mr-4">
                      <CreditCard className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Kredi Kartı</h3>
                      <p className="text-gray-600">Güvenli SSL ile korumalı ödeme</p>
                    </div>
                    <div className="ml-auto">
                      <div className={`w-6 h-6 rounded-full border-2 ${
                        paymentMethod === 'credit-card' 
                          ? 'border-indigo-600 bg-indigo-600' 
                          : 'border-gray-300'
                      }`}>
                        {paymentMethod === 'credit-card' && (
                          <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={`border-2 rounded-xl p-6 cursor-pointer transition-all transform hover:scale-105 ${
                    paymentMethod === 'cash-on-delivery' 
                      ? 'border-green-600 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handlePaymentMethodSelect('cash-on-delivery')}
                >
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-3 rounded-xl mr-4">
                      <Truck className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Kapıda Ödeme</h3>
                      <p className="text-gray-600">Nakit veya kart ile kapıda ödeme (+14.90 TL)</p>
                    </div>
                    <div className="ml-auto">
                      <div className={`w-6 h-6 rounded-full border-2 ${
                        paymentMethod === 'cash-on-delivery' 
                          ? 'border-green-600 bg-green-600' 
                          : 'border-gray-300'
                      }`}>
                        {paymentMethod === 'cash-on-delivery' && (
                          <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={`border-2 rounded-xl p-6 cursor-pointer transition-all transform hover:scale-105 ${
                    paymentMethod === 'paypal' 
                      ? 'border-blue-600 bg-gradient-to-r from-blue-50 to-cyan-50 shadow-lg' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handlePaymentMethodSelect('paypal')}
                >
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-3 rounded-xl mr-4">
                      <ShoppingCart className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">PayPal</h3>
                      <p className="text-gray-600">PayPal ile güvenli ödeme</p>
                    </div>
                    <div className="ml-auto">
                      <div className={`w-6 h-6 rounded-full border-2 ${
                        paymentMethod === 'paypal' 
                          ? 'border-blue-600 bg-blue-600' 
                          : 'border-gray-300'
                      }`}>
                        {paymentMethod === 'paypal' && (
                          <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-8">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-8">
              <div className="flex items-center mb-6">
                <Package className="h-6 w-6 text-indigo-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Sipariş Özeti</h2>
              </div>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">Adet: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      {item.discountPercentage > 0 ? (
                        <div>
                          <p className="text-sm text-gray-500 line-through">
                            {(item.price * item.quantity).toFixed(2)} TL
                          </p>
                          <p className="font-bold text-red-600">
                            {(item.price * (1 - item.discountPercentage / 100) * item.quantity).toFixed(2)} TL
                          </p>
                        </div>
                      ) : (
                        <p className="font-bold text-gray-900">
                          {(item.price * item.quantity).toFixed(2)} TL
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-6 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Ara Toplam</span>
                  <span>{total.toFixed(2)} TL</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Kargo</span>
                  <span className="text-green-600 font-medium">Ücretsiz</span>
                </div>
                {paymentMethod === 'cash-on-delivery' && (
                  <div className="flex justify-between text-gray-600">
                    <span>Kapıda Ödeme Ücreti</span>
                    <span>14.90 TL</span>
                  </div>
                )}
                <div className="border-t pt-3">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Toplam</span>
                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      {(total + (paymentMethod === 'cash-on-delivery' ? 14.90 : 0)).toFixed(2)} TL
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleContinue}
                disabled={!paymentMethod || !shippingInfo.fullName || !shippingInfo.email}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl mt-8 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg font-bold text-lg"
              >
                Ödemeye Geç
              </button>
            </div>

            {/* Security Features */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
              <h3 className="font-bold text-green-800 mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Güvenlik Özellikleri
              </h3>
              <div className="space-y-3 text-sm text-green-700">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  SSL Sertifikası ile korumalı
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  256-bit şifreleme
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  PCI DSS uyumlu
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
              <h3 className="font-bold text-blue-800 mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Teslimat Bilgileri
              </h3>
              <div className="space-y-3 text-sm text-blue-700">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  1-3 iş günü içinde teslimat
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  200 TL üzeri ücretsiz kargo
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  SMS ile kargo takibi
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;