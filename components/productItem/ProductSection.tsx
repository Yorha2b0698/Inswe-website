"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import ShopFilter from "./ShopFilters";
import { allProducts, type Product } from "@/lib/products";

export default function ProductSection() {
  const [view, setView] = useState<"default" | "zoom-out">("default");
  const [sort, setSort] = useState("manual");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(allProducts);

  return (
    <section className="max-w-[1450px] mx-auto px-4 py-8 sm:px-6 lg:px-10">
      {/* FILTER TOP */}
      <ShopFilter
        products={allProducts}
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
