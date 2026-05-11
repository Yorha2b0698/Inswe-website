"use client";

import Image from "next/image";
import { Product } from "./ProductSection";

type ProductCardProps = {
  product: Product;
  view: "default" | "zoom-out";
};

export default function ProductCard({
  product,
  view,
}: ProductCardProps) {
  return (
    <div className="w-full">
      {/* IMAGE */}
      <div
        className={`relative overflow-hidden bg-[#f3f3f3] ${
          view === "default"
            ? "aspect-[1/1.15]"
            : "aspect-square"
        }`}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes={
            view === "default"
              ? "(max-width: 768px) 50vw, 25vw"
              : "(max-width: 768px) 25vw, 12vw"
          }
          priority
        />
      </div>

      {/* INFO */}
      <div className="pt-3">
        <h3
          className={`font-normal leading-[1.2] text-[#222] ${
            view === "default"
              ? "text-[14px]"
              : "text-[13px]"
          }`}
        >
          {product.name}
        </h3>

        <p
          className={`mt-1 text-[#444] ${
            view === "default"
              ? "text-[13px]"
              : "text-[12px]"
          }`}
        >
          £{product.price.toFixed(2)} GBP
        </p>
      </div>
    </div>
  );
}