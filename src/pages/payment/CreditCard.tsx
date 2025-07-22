import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard as CreditCardIcon, Lock, Shield, ArrowLeft, CheckCircle } from 'lucide-react';

const CreditCard = () => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const [orderSummary, setOrderSummary] = useState({
    items: [],
    total: 0,
    shippingInfo: {}
  });
  const navigate = useNavigate();

  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    const total = parseFloat(localStorage.getItem('cartTotal') || '0');
    const shippingInfo = JSON.parse(localStorage.getItem('shippingInfo') || '{}');
    
    setOrderSummary({
      items: cartItems,
      total: total,
      shippingInfo: shippingInfo
    });
  }, []);

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = 'Geçerli bir kart numarası girin';
    }
    
    if (!formData.cardHolder || formData.cardHolder.length < 3) {
      newErrors.cardHolder = 'Kart üzerindeki ismi girin';
    }
    
    if (!formData.expiryDate || formData.expiryDate.length < 5) {
      newErrors.expiryDate = 'Geçerli bir tarih girin (MM/YY)';
    }
    
    if (!formData.cvv || formData.cvv.length < 3) {
      newErrors.cvv = 'Geçerli bir CVV girin';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      // Clear cart after successful payment
      const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
      localStorage.setItem('cart', '[]');
      
      // Add to orders
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      const total = orderSummary.total;
      
      const newOrder = {
        id: Date.now(),
        date: new Date().toLocaleDateString('tr-TR'),
        total: total.toFixed(2),
        status: 'Ödeme Alındı',
        paymentMethod: 'Kredi Kartı',
        cardLastFour: formData.cardNumber.slice(-4),
        items: cartItems
      };
      orders.push(newOrder);
      localStorage.setItem('orders', JSON.stringify(orders));

      setIsProcessing(false);
      navigate('/hesabim');
      alert('Ödeme başarıyla tamamlandı!');
    }, 2000);
  };

  const handleInputChange = (field, value) => {
    let formattedValue = value;
    
    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (field === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    } else if (field === 'cvv') {
      formattedValue = value.replace(/[^0-9]/g, '').substring(0, 3);
    }
    
    setFormData({ ...formData, [field]: formattedValue });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate('/checkout')}
            className="flex items-center text-indigo-600 hover:text-indigo-800 mb-4 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Geri Dön
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Kredi Kartı ile Ödeme
          </h1>
          <div className="flex items-center mt-4 space-x-4">
            <div className="flex items-center text-green-600">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span className="font-medium">Güvenli Ödeme</span>
            </div>
            <div className="flex items-center text-blue-600">
              <Shield className="h-5 w-5 mr-2" />
              <span className="font-medium">SSL Korumalı</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Credit Card Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center mb-8">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-xl mr-4">
                <CreditCardIcon className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Kart Bilgileri</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kart Numarası
                </label>
                <input
                  type="text"
                  value={formData.cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  className={`w-full px-4 py-4 border-2 rounded-xl text-lg font-mono transition-all ${
                    errors.cardNumber 
                      ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                      : 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                  }`}
                  maxLength={19}
                />
                {errors.cardNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kart Üzerindeki İsim
                </label>
                <input
                  type="text"
                  value={formData.cardHolder}
                  onChange={(e) => handleInputChange('cardHolder', e.target.value.toUpperCase())}
                  placeholder="AD SOYAD"
                  className={`w-full px-4 py-4 border-2 rounded-xl text-lg transition-all ${
                    errors.cardHolder 
                      ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                      : 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                  }`}
                />
                {errors.cardHolder && (
                  <p className="text-red-500 text-sm mt-1">{errors.cardHolder}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Son Kullanma Tarihi
                  </label>
                  <input
                    type="text"
                    value={formData.expiryDate}
                    onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                    placeholder="MM/YY"
                    className={`w-full px-4 py-4 border-2 rounded-xl text-lg font-mono transition-all ${
                      errors.expiryDate 
                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                        : 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                    }`}
                    maxLength={5}
                  />
                  {errors.expiryDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={formData.cvv}
                    onChange={(e) => handleInputChange('cvv', e.target.value)}
                    placeholder="123"
                    className={`w-full px-4 py-4 border-2 rounded-xl text-lg font-mono transition-all ${
                      errors.cvv 
                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                        : 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                    }`}
                    maxLength={3}
                  />
                  {errors.cvv && (
                    <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg font-bold text-lg flex items-center justify-center"
              >
                {isProcessing ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    İşleniyor...
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5 mr-2" />
                    Ödemeyi Tamamla
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div className="flex items-center text-green-800">
                <Shield className="h-5 w-5 mr-2" />
                <span className="font-medium">Bu ödeme 256-bit SSL ile korunmaktadır</span>
              </div>
            </div>
          </div>

          {/* Credit Card Preview */}
          <div className="space-y-8">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Sipariş Özeti</h3>
              <div className="space-y-4 mb-6">
                {orderSummary.items.map((item) => (
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
                      <p className="font-bold text-gray-900">
                        {(item.price * item.quantity).toFixed(2)} TL
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>Toplam</span>
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {orderSummary.total.toFixed(2)} TL
                  </span>
                </div>
              </div>
            </div>

            {/* Card Preview */}
            <div className="relative">
              <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-2xl transform hover:scale-105 transition-all duration-300">
                <div className="flex justify-between items-start mb-8">
                  <div className="text-2xl font-bold">BANK</div>
                  <div className="text-right">
                    <div className="text-sm opacity-80">CREDIT CARD</div>
                  </div>
                </div>
                
                <div className="mb-8">
                  <div className="text-2xl font-mono tracking-wider">
                    {formData.cardNumber || '•••• •••• •••• ••••'}
                  </div>
                </div>
                
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-xs opacity-80 mb-1">CARD HOLDER</div>
                    <div className="font-semibold">
                      {formData.cardHolder || 'AD SOYAD'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs opacity-80 mb-1">EXPIRES</div>
                    <div className="font-semibold">
                      {formData.expiryDate || 'MM/YY'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Features */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Güvenlik Özellikleri</h3>
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-4"></div>
                  <div>
                    <div className="font-semibold text-green-800">SSL Şifreleme</div>
                    <div className="text-sm text-green-600">Tüm verileriniz şifrelenir</div>
                  </div>
                </div>
                
                <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-4"></div>
                  <div>
                    <div className="font-semibold text-blue-800">PCI DSS Uyumlu</div>
                    <div className="text-sm text-blue-600">Endüstri standartlarına uygun</div>
                  </div>
                </div>
                
                <div className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-4"></div>
                  <div>
                    <div className="font-semibold text-purple-800">3D Secure</div>
                    <div className="text-sm text-purple-600">Ekstra güvenlik katmanı</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Accepted Cards */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Kabul Edilen Kartlar</h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-4 text-white text-center font-bold">
                  VISA
                </div>
                <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-4 text-white text-center font-bold">
                  MC
                </div>
                <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-4 text-white text-center font-bold">
                  AMEX
                </div>
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-4 text-white text-center font-bold">
                  TROY
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditCard;