"use client";

import { useState, useEffect, useMemo } from "react";
import ProductCard from "./ProductCard";
import ShopFilter from "./ShopFilters";
import { allProducts, type Product, getCapsProducts, getNonCapsProducts} from "@/lib/products";

interface ProductSectionProps {
  initialCategory?: string;
}

export default function ProductSection({ initialCategory }: ProductSectionProps) {
  console.log("ProductSection - initialCategory received:", initialCategory);
  
  const [view, setView] = useState<"default" | "zoom-out">("default");
  const [sort, setSort] = useState("manual");
  
  // Memoize the products based on category to prevent infinite re-renders
  const products = useMemo(() => {
    console.log("ProductSection useMemo - recalculating products for category:", initialCategory);
    if (initialCategory === "caps") {
      return getCapsProducts();
    } else if (initialCategory === "bags") {
      return getNonCapsProducts();
    }
    return allProducts;
  }, [initialCategory]);
  
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  // Update filtered products when initialCategory changes
  useEffect(() => {
    console.log("ProductSection useEffect - initialCategory changed:", initialCategory);
    setFilteredProducts(products);
  }, [initialCategory, products]);

  return (
    <section className="max-w-[1450px] mx-auto px-4 py-8 sm:px-6 lg:px-10">
      {/* FILTER TOP */}
      <ShopFilter
        products={products}
        view={view}
        setView={setView}
        sort={sort}
        setSort={setSort}
        setFilteredProducts={setFilteredProducts}
      />

      {/* PRODUCTS */}
      <div
        className={`grid gap-x-3 gap-y-8 ${
          view === "default"
            ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
            : "grid-cols-3 sm:grid-cols-4 lg:grid-cols-8"
        }`}
      >
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} view={view} />
        ))}
      </div>
    </section>
  );
}
