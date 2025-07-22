import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">İletişim Bilgileri</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                <span>+90 555 123 4567</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                <span>info@eticaret.com</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                <span>İstanbul, Türkiye</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Hızlı Bağlantılar</h3>
            <ul className="space-y-2">
              <li><a href="/hakkimizda" className="hover:text-indigo-400">Hakkımızda</a></li>
              <li><a href="/urunler" className="hover:text-indigo-400">Ürünler</a></li>
              <li><a href="/iletisim" className="hover:text-indigo-400">İletişim</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Bizi Takip Edin</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-indigo-400">Instagram</a>
              <a href="#" className="hover:text-indigo-400">Facebook</a>
              <a href="#" className="hover:text-indigo-400">Twitter</a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p>&copy; 2024 E-Ticaret. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;