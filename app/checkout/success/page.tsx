"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle, ShoppingBag, Home } from "lucide-react";
import { useCart } from "@/lib/CartContext";

type OrderSnapshot = {
  id: string;
  total: number;
  itemCount: number;
  method: string;
};

export default function CheckoutSuccessPage() {
  const { items, clearCart } = useCart();
  const cleared = useRef(false);

  // Snapshot the order details BEFORE clearing the cart
  const [order, setOrder] = useState<OrderSnapshot | null>(null);

  useEffect(() => {
    if (cleared.current) return;
    cleared.current = true;

    // Read payment method from URL query param set by checkout page
    const params = new URLSearchParams(window.location.search);
    const method = params.get("method") === "paypal" ? "PayPal" : "Credit card";

    // Capture totals while cart still has items
    const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const itemCount = items.reduce((s, i) => s + i.quantity, 0);
    const id = `INSWE-${Date.now().toString().slice(-8)}`;

    setOrder({ id, total, itemCount, method });
    clearCart();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b border-[#e5e5e5] bg-white">
        <div className="mx-auto flex h-14 max-w-[1100px] items-center justify-between px-4 sm:px-6">
          <Link href="/" className="text-[17px] font-semibold tracking-[-0.03em] text-[#1a1a1a]">
            Inswè
          </Link>
          <span className="text-[13px] text-[#555]">Order Confirmation</span>
        </div>
      </header>
      <div className="h-14" />

      <div className="mx-auto flex w-full max-w-[600px] flex-1 flex-col items-center justify-center px-4 py-16 sm:px-6">

        {/* Icon */}
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
          <CheckCircle className="h-12 w-12 text-green-500" strokeWidth={1.5} />
        </div>

        <h1 className="mb-2 text-center text-[26px] font-semibold text-[#1a1a1a]">
          Thank you for your order!
        </h1>
        <p className="mb-10 text-center text-[14px] text-[#666]">
          Your payment was successful and your order is being processed.
        </p>

        {/* Order card */}
        {order && (
          <div className="mb-10 w-full rounded-xl border border-[#e5e5e5] bg-[#fafafa] p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[14px] font-semibold text-[#1a1a1a]">Order summary</span>
              <span className="text-[13px] font-medium text-[#2563EB]">{order.id}</span>
            </div>
            <div className="space-y-2.5 text-[13px]">
              <div className="flex justify-between">
                <span className="text-[#555]">Items</span>
                <span className="text-[#1a1a1a]">{order.itemCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#555]">Payment method</span>
                <span className="text-[#1a1a1a]">{order.method}</span>
              </div>
              <div className="flex justify-between border-t border-[#e5e5e5] pt-2.5">
                <span className="font-semibold text-[#1a1a1a]">Total paid</span>
                <span className="text-[16px] font-semibold text-[#1a1a1a]">
                  £{order.total.toFixed(2)} GBP
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Next steps */}
        <div className="mb-10 w-full space-y-4">
          {[
            { n: 1, title: "Order processing", body: "We're preparing your items for shipment." },
            { n: 2, title: "Shipping", body: "Your order ships within 1–2 business days." },
            { n: 3, title: "Delivery", body: "Estimated delivery: 3–5 business days." },
          ].map(({ n, title, body }) => (
            <div key={n} className="flex items-start gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f0f0f0] text-[12px] font-semibold text-[#555]">
                {n}
              </div>
              <div>
                <p className="text-[14px] font-medium text-[#1a1a1a]">{title}</p>
                <p className="text-[13px] text-[#666]">{body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <Link
            href="/shop"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#e5e5e5] bg-white px-4 py-3 text-[14px] font-medium text-[#1a1a1a] transition hover:bg-[#f5f5f5]"
          >
            <ShoppingBag className="h-4 w-4" />
            Continue shopping
          </Link>
          <Link
            href="/"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#1a1a1a] px-4 py-3 text-[14px] font-medium text-white transition hover:bg-[#333]"
          >
            <Home className="h-4 w-4" />
            Back to home
          </Link>
        </div>

        <p className="mt-8 text-center text-[13px] text-[#888]">
          Questions?{" "}
          <Link href="/contact" className="text-[#1a1a1a] underline">
            Contact support
          </Link>
        </p>
      </div>
    </div>
  );
}
