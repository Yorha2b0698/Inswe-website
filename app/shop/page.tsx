import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductSection from "@/components/productItem/ProductSection";

export default function ShopPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#f5f5f5]">
      <Header />
      <div className="flex-1">
        <ProductSection />
      </div>
      <Footer/>
    </main>
  );
}