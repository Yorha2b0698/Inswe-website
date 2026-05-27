"use client";

import { useSearchParams } from 'next/navigation';
import ProductSection from "@/components/productItem/ProductSection";

export default function ProductSectionWrapper() {
  const searchParams = useSearchParams();
  const category = searchParams?.get('category');
  
  console.log("ProductSectionWrapper - searchParams:", searchParams);
  console.log("ProductSectionWrapper - category from URL:", category);
  
  return <ProductSection initialCategory={category || undefined} />;
}