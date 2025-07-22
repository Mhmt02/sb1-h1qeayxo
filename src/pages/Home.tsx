import React from 'react';
import Banner from '../components/Banner';
import FeaturedProducts from '../components/FeaturedProducts';

const Home = () => {
  return (
    <div className="min-h-screen">
      <Banner />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Öne Çıkan Ürünler</h2>
        <FeaturedProducts />
      </div>
    </div>
  );
};

export default Home;