import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, MapPin, Clock, Phone, ArrowLeft, CheckCircle, Package, CreditCard } from 'lucide-react';

const CashOnDelivery = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentType, setPaymentType] = useState('cash');
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate order processing
    setTimeout(() => {
      // Clear cart after successful order
      const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
      localStorage.setItem('cart', '[]');
      
      // Add to orders
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      const total = orderSummary.total;
      
      const newOrder = {
        id: Date.now(),
        date: new Date().toLocaleDateString('tr-TR'),
        total: (total + 14.90).toFixed(2),
        status: 'Sipariş Alındı',
        paymentMethod: `Kapıda Ödeme (${paymentType === 'cash' ? 'Nakit' : 'Kart'})`,
        items: cartItems
      };
      orders.push(newOrder);
      localStorage.setItem('orders', JSON.stringify(orders));

      setIsProcessing(false);
      navigate('/hesabim');
      alert('Siparişiniz başarıyla oluşturuldu!');
    }, 2000);
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Kapıda Ödeme
          </h1>
          <div className="flex items-center mt-4 space-x-4">
            <div className="flex items-center text-green-600">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span className="font-medium">Güvenli Teslimat</span>
            </div>
            <div className="flex items-center text-blue-600">
              <Truck className="h-5 w-5 mr-2" />
              <span className="font-medium">Hızlı Kargo</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Confirmation */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center mb-8">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-3 rounded-xl mr-4">
                <Package className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Sipariş Onayı</h2>
            </div>

            {/* Payment Method Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Kapıda Ödeme Yöntemi</h3>
              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-green-300 transition-all">
                  <input
                    type="radio"
                    name="paymentType"
                    value="cash"
                    checked={paymentType === 'cash'}
                    onChange={(e) => setPaymentType(e.target.value)}
                    className="mr-4 text-green-600 focus:ring-green-500"
                  />
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-lg mr-3">
                      <span className="text-green-600 font-bold text-lg">💵</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Nakit</div>
                      <div className="text-sm text-gray-600">Kapıda nakit ödeme</div>
                    </div>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-green-300 transition-all">
                  <input
                    type="radio"
                    name="paymentType"
                    value="card"
                    checked={paymentType === 'card'}
                    onChange={(e) => setPaymentType(e.target.value)}
                    className="mr-4 text-green-600 focus:ring-green-500"
                  />
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-lg mr-3">
                      <CreditCard className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Kredi/Banka Kartı</div>
                      <div className="text-sm text-gray-600">Kapıda kart ile ödeme</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-green-600" />
                Teslimat Bilgileri
              </h3>
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 space-y-3">
                <div>
                  <span className="font-medium text-gray-700">Ad Soyad:</span>
                  <span className="ml-2 text-gray-900">{orderSummary.shippingInfo.fullName}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Telefon:</span>
                  <span className="ml-2 text-gray-900">{orderSummary.shippingInfo.phone}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Adres:</span>
                  <span className="ml-2 text-gray-900">{orderSummary.shippingInfo.address}, {orderSummary.shippingInfo.city}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg font-bold text-lg flex items-center justify-center"
              >
                {isProcessing ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Sipariş Oluşturuluyor...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Siparişi Onayla
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
              <div className="flex items-center text-amber-800">
                <span className="text-2xl mr-3">⚠️</span>
                <div>
                  <div className="font-semibold">Kapıda Ödeme Ücreti</div>
                  <div className="text-sm">Bu sipariş için 14.90 TL kapıda ödeme ücreti alınacaktır.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Process */}
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
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Ara Toplam</span>
                  <span>{orderSummary.total.toFixed(2)} TL</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Kapıda Ödeme Ücreti</span>
                  <span>14.90 TL</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 border-t pt-2">
                  <span>Toplam</span>
                  <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {(orderSummary.total + 14.90).toFixed(2)} TL
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Timeline */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Clock className="h-6 w-6 mr-3 text-blue-600" />
                Teslimat Süreci
              </h3>
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    1
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Sipariş Onayı</div>
                    <div className="text-sm text-gray-600">Siparişiniz onaylanır ve hazırlanmaya başlar</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    2
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Kargoya Verilme</div>
                    <div className="text-sm text-gray-600">1 iş günü içinde kargoya verilir</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    3
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Teslimat</div>
                    <div className="text-sm text-gray-600">2-3 iş günü içinde adresinize teslim edilir</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-200">
              <h3 className="text-xl font-bold text-blue-800 mb-6 flex items-center">
                <Phone className="h-6 w-6 mr-3" />
                İletişim Bilgileri
              </h3>
              <div className="space-y-4">
                <div className="flex items-center text-blue-700">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-4"></div>
                  <div>
                    <div className="font-semibold">Müşteri Hizmetleri</div>
                    <div className="text-sm">0850 123 45 67</div>
                  </div>
                </div>
                
                <div className="flex items-center text-blue-700">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-4"></div>
                  <div>
                    <div className="font-semibold">Kargo Takip</div>
                    <div className="text-sm">SMS ile bilgilendirileceksiniz</div>
                  </div>
                </div>
                
                <div className="flex items-center text-blue-700">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-4"></div>
                  <div>
                    <div className="font-semibold">Çalışma Saatleri</div>
                    <div className="text-sm">Pazartesi-Cuma 09:00-18:00</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
              <h3 className="text-xl font-bold text-green-800 mb-6">Önemli Notlar</h3>
              <div className="space-y-3 text-sm text-green-700">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></div>
                  <div>Teslimat sırasında kimlik belgesi istenir</div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></div>
                  <div>Ürünleri teslim almadan önce kontrol edebilirsiniz</div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></div>
                  <div>Hasarlı ürünleri teslim almayabilirsiniz</div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></div>
                  <div>14 gün içinde ücretsiz iade hakkınız vardır</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashOnDelivery;