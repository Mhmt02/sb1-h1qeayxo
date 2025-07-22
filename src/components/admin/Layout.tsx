import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  Image, 
  LogOut 
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  const handleLogout = () => {
    signOut();
    navigate('/admin/giris');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-xl font-bold text-indigo-600">Admin Panel</h2>
          {user && (
            <p className="text-sm text-gray-600 mt-1">Hoş geldiniz, {user.username}</p>
          )}
        </div>
        
        <nav className="mt-8">
          <Link
            to="/admin"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
          >
            <LayoutDashboard className="h-5 w-5 mr-2" />
            Dashboard
          </Link>
          
          <Link
            to="/admin/urunler"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
          >
            <Package className="h-5 w-5 mr-2" />
            Ürünler
          </Link>
          
          <Link
            to="/admin/kategoriler"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
          >
            <Layers className="h-5 w-5 mr-2" />
            Kategoriler
          </Link>
          
          <Link
            to="/admin/banner"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
          >
            <Image className="h-5 w-5 mr-2" />
            Banner
          </Link>
        </nav>

        <div className="absolute bottom-0 w-64 p-4">
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 w-full"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Çıkış Yap
          </button>
        </div>
      </aside>

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;