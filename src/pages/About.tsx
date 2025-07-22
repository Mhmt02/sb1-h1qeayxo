import React from 'react';
import { Award, Users, ShieldCheck } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-12">Hakkımızda</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Biz Kimiz?</h2>
          <p className="text-gray-600 leading-relaxed">
            2010 yılından bu yana müşterilerimize en kaliteli ürünleri en uygun fiyatlarla
            sunmaya devam ediyoruz. Müşteri memnuniyeti odaklı hizmet anlayışımız ve
            güvenilir alışveriş deneyimimizle sektörde öncü konumdayız.
          </p>
        </div>
        
        <div>
          <img
            src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0"
            alt="Ofisimiz"
            className="w-full h-64 object-cover rounded-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <Award className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Kalite</h3>
          <p className="text-gray-600">
            En kaliteli ürünleri sizlerle buluşturuyoruz.
          </p>
        </div>

        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <Users className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Müşteri Odaklı</h3>
          <p className="text-gray-600">
            Müşteri memnuniyeti bizim için her şeyden önemli.
          </p>
        </div>

        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <ShieldCheck className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Güvenli Alışveriş</h3>
          <p className="text-gray-600">
            %100 güvenli alışveriş deneyimi sunuyoruz.
          </p>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Vizyonumuz</h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Türkiye'nin en güvenilir ve tercih edilen e-ticaret platformu olmak için
          çalışıyoruz. Müşterilerimize en iyi hizmeti sunmak için sürekli kendimizi
          geliştiriyor ve yenilikleri takip ediyoruz.
        </p>
      </div>
    </div>
  );
};

export default About;