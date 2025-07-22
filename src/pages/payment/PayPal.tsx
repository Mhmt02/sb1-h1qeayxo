import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Shield, Globe, CreditCard } from 'lucide-react';

const PayPal = () => {
  const [isProcessing, setIsProcessing] = useState(false);
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

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate PayPal payment processing
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
        paymentMethod: 'PayPal',
        items: cartItems
      };
      orders.push(newOrder);
      localStorage.setItem('orders', JSON.stringify(orders));

      setIsProcessing(false);
      navigate('/hesabim');
      alert('PayPal ödemeniz başarıyla tamamlandı!');
    }, 3000);
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            PayPal ile Ödeme
          </h1>
          <div className="flex items-center mt-4 space-x-4">
            <div className="flex items-center text-green-600">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span className="font-medium">Güvenli Ödeme</span>
            </div>
            <div className="flex items-center text-blue-600">
              <Shield className="h-5 w-5 mr-2" />
              <span className="font-medium">Alıcı Koruması</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* PayPal Payment */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 mb-6">
                <img
                  src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg"
                  alt="PayPal"
                  className="mx-auto h-16 filter brightness-0 invert"
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">PayPal ile Güvenli Ödeme</h2>
              <p className="text-gray-600">PayPal hesabınızla hızlı ve güvenli ödeme yapın</p>
            </div>

            <form onSubmit={handlePayment} className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center mb-4">
                  <Globe className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="font-semibold text-blue-800">PayPal'a Yönlendirileceksiniz</span>
                </div>
                <p className="text-blue-700 text-sm">
                  "PayPal ile Öde" butonuna tıkladığınızda PayPal'ın güvenli ödeme sayfasına yönlendirileceksiniz. 
                  Orada PayPal hesabınızla giriş yaparak ödemenizi tamamlayabilirsiniz.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <div className="font-semibold text-green-800">PayPal Hesabı</div>
                    <div className="text-sm text-green-600">Mevcut PayPal hesabınızla ödeme yapın</div>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                  <CreditCard className="h-5 w-5 text-purple-600 mr-3" />
                  <div>
                    <div className="font-semibold text-purple-800">Kredi/Banka Kartı</div>
                    <div className="text-sm text-purple-600">PayPal hesabı olmadan kart ile ödeme</div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-xl hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg font-bold text-lg flex items-center justify-center"
              >
                {isProcessing ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    PayPal'a Yönlendiriliyor...
                  </>
                ) : (
                  <>
                    <img
                      src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg"
                      alt="PayPal"
                      className="h-6 mr-3 filter brightness-0 invert"
                    />
                    PayPal ile Öde
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                PayPal'ın güvenli ödeme sistemini kullanarak kartınız bilgilerini bizimle paylaşmadan ödeme yapabilirsiniz.
              </p>
            </div>
          </div>

          {/* PayPal Features */}
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
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    {orderSummary.total.toFixed(2)} TL
                  </span>
                </div>
              </div>
            </div>

            {/* PayPal Advantages */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">PayPal Avantajları</h3>
              <div className="space-y-4">
                <div className="flex items-start p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-4 mt-2"></div>
                  <div>
                    <div className="font-semibold text-blue-800">Hızlı Ödeme</div>
                    <div className="text-sm text-blue-600">Tek tıkla ödeme, kart bilgisi girmeye gerek yok</div>
                  </div>
                </div>
                
                <div className="flex items-start p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-4 mt-2"></div>
                  <div>
                    <div className="font-semibold text-green-800">Alıcı Koruması</div>
                    <div className="text-sm text-green-600">Ürün gelmezse veya açıklamaya uymazsa paranızı geri alın</div>
                  </div>
                </div>
                
                <div className="flex items-start p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-4 mt-2"></div>
                  <div>
                    <div className="font-semibold text-purple-800">Güvenli</div>
                    <div className="text-sm text-purple-600">Kart bilgileriniz satıcıyla paylaşılmaz</div>
                  </div>
                </div>
                
                <div className="flex items-start p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
                  <div className="w-3 h-3 bg-orange-500 rounded-full mr-4 mt-2"></div>
                  <div>
                    <div className="font-semibold text-orange-800">Kolay İade</div>
                    <div className="text-sm text-orange-600">Sorun yaşarsanız kolayca iade edebilirsiniz</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Information */}
            <div className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <Shield className="h-6 w-6 mr-3" />
                Güvenlik Bilgileri
              </h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  <span>256-bit SSL şifreleme ile korunur</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  <span>Dünya çapında 400+ milyon kullanıcı</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  <span>24/7 dolandırıcılık izleme</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  <span>Gelişmiş şifreleme teknolojisi</span>
                </div>
              </div>
            </div>

            {/* Payment Process */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Ödeme Süreci</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    1
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">PayPal'a Yönlendirme</div>
                    <div className="text-sm text-gray-600">Güvenli PayPal sayfasına yönlendirilirsiniz</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    2
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Giriş ve Onay</div>
                    <div className="text-sm text-gray-600">PayPal hesabınızla giriş yapın ve ödemeyi onaylayın</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    3
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Tamamlama</div>
                    <div className="text-sm text-gray-600">Sitemize geri dönün ve siparişinizi tamamlayın</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayPal;