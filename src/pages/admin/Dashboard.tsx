import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/Layout';
import useAuth from '../../hooks/useAuth';
import ProductManager from './ProductManager';
import CategoryManager from './CategoryManager';
import BannerManager from './BannerManager';

const Dashboard = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/giris" />;
  }

  // If user is authenticated but not admin, redirect to home
  if (user && user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="urunler" element={<ProductManager />} />
        <Route path="kategoriler" element={<CategoryManager />} />
        <Route path="banner" element={<BannerManager />} />
      </Routes>
    </AdminLayout>
  );
};

const DashboardHome = () => {
  const [stats, setStats] = React.useState({
    products: 0,
    categories: 0,
    banners: 0
  });

  React.useEffect(() => {
    // Load statistics from localStorage
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const categories = JSON.parse(localStorage.getItem('categories') || '[]');
    const banners = JSON.parse(localStorage.getItem('banners') || '[]');
    
    setStats({
      products: products.length,
      categories: categories.length,
      banners: banners.length
    });
  }, []);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Yönetim Paneli
        </h1>
        <p className="text-gray-600">E-ticaret sitenizi yönetin</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2 opacity-90">Toplam Ürün</h3>
              <p className="text-4xl font-bold">{stats.products}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5zM8 15a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2 opacity-90">Toplam Kategori</h3>
              <p className="text-4xl font-bold">{stats.categories}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2 opacity-90">Banner Sayısı</h3>
              <p className="text-4xl font-bold">{stats.banners}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-xl">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Hızlı İşlemler</h3>
          <div className="space-y-3">
            <a href="/admin/urunler" className="flex items-center p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl hover:from-indigo-100 hover:to-purple-100 transition-all">
              <div className="bg-indigo-600 p-2 rounded-lg mr-3">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-medium text-gray-900">Ürün Yönetimi</span>
            </a>
            
            <a href="/admin/kategoriler" className="flex items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all">
              <div className="bg-green-600 p-2 rounded-lg mr-3">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <span className="font-medium text-gray-900">Kategori Yönetimi</span>
            </a>
            
            <a href="/admin/banner" className="flex items-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-all">
              <div className="bg-purple-600 p-2 rounded-lg mr-3">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-medium text-gray-900">Banner Yönetimi</span>
            </a>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-xl">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Son Aktiviteler</h3>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-gray-50 rounded-xl">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span className="text-gray-700">Sistem aktif ve çalışıyor</span>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-xl">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <span className="text-gray-700">Admin paneli hazır</span>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-xl">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
              <span className="text-gray-700">Tüm özellikler aktif</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;