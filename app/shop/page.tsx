import { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductSectionWrapper from './ProductSectionWrapper'

export default function ShopPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#f5f5f5]">
      <Header />
      <div className="flex-1">
        <Suspense fallback={<div>Loading products...</div>}>
          <ProductSectionWrapper />
        </Suspense>
      </div>
      <Footer/>
    </main>
  );
}