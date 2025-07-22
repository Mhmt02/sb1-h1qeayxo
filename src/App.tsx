import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Favorites from './pages/Favorites';
import Contact from './pages/Contact';
import Register from './pages/Register';
import Login from './pages/Login';
import Account from './pages/Account';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import Checkout from './pages/Checkout';
import CreditCard from './pages/payment/CreditCard';
import CashOnDelivery from './pages/payment/CashOnDelivery';
import PayPal from './pages/payment/PayPal';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hakkimizda" element={<About />} />
            <Route path="/urunler" element={<Products />} />
            <Route path="/urun/:id" element={<ProductDetail />} />
            <Route path="/favorilerim" element={<Favorites />} />
            <Route path="/iletisim" element={<Contact />} />
            <Route path="/kayit" element={<Register />} />
            <Route path="/giris" element={<Login />} />
            <Route path="/hesabim" element={<Account />} />
            <Route path="/admin/giris" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/odeme/kredi-karti" element={<CreditCard />} />
            <Route path="/odeme/kapida-odeme" element={<CashOnDelivery />} />
            <Route path="/odeme/paypal" element={<PayPal />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;