"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import MockPaymentForm from "@/components/StripePaymentForm";

type PaymentMethod = "card" | "paypal";

export default function CheckoutPage() {
  const { items } = useCart();
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalCount = items.reduce((s, i) => s + i.quantity, 0);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [form, setForm] = useState({
    email: "",
    country: "United Kingdom",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    postcode: "",
    saveInfo: false,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [paypalProcessing, setPaypalProcessing] = useState(false);
  const [paypalError, setPaypalError] = useState<string | null>(null);

  const set = (k: string, v: string | boolean) =>
    setForm((p) => ({ ...p, [k]: v }));

  const validateShipping = (): string | null => {
    if (!form.email.trim() || !form.email.includes("@"))
      return "Please enter a valid email address.";
    if (!form.lastName.trim()) return "Please enter your last name.";
    if (!form.address.trim()) return "Please enter your shipping address.";
    if (!form.city.trim()) return "Please enter your city.";
    if (!form.postcode.trim()) return "Please enter your postcode.";
    return null;
  };

  const handlePayPal = async () => {
    const err = validateShipping();
    if (err) { setFormError(err); return; }
    setFormError(null);
    setPaypalError(null);
    setPaypalProcessing(true);
    try {
      await new Promise((res) => setTimeout(res, 2000));
      window.location.href = "/checkout/success?method=paypal";
    } catch {
      setPaypalError("PayPal payment failed. Please try again.");
      setPaypalProcessing(false);
    }
  };

  const handleCardSuccess = () => {
    window.location.href = "/checkout/success?method=card";
  };

  const handleCardInteract = () => {
    if (!formError) return;
    if (!validateShipping()) setFormError(null);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">

      {/* ── HEADER ── */}
      <header className="fixed top-0 z-50 w-full border-b border-[#e5e5e5] bg-white">
        <div className="mx-auto flex h-14 max-w-[1100px] items-center justify-between px-4 sm:px-6">
          <Link href="/" className="text-[17px] font-semibold tracking-[-0.03em] text-[#1a1a1a]">
            Inswè
          </Link>
          <Link href="/cart" aria-label="Back to cart"
            className="flex h-8 w-8 items-center justify-center text-[#555] transition hover:text-[#1a1a1a]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </Link>
        </div>
      </header>
      <div className="h-14" />

      {/* ── EMPTY CART ── */}
      {items.length === 0 && (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 py-24 text-center">
          <p className="text-[16px] text-[#555]">Your cart is empty.</p>
          <Link href="/shop"
            className="rounded-lg bg-[#1a1a1a] px-6 py-3 text-[14px] font-medium text-white transition hover:bg-[#333]">
            Continue shopping
          </Link>
        </div>
      )}

      {/* ── MAIN BODY ── */}
      {items.length > 0 && (
        <div className="mx-auto flex w-full max-w-[1100px] flex-1 flex-col lg:flex-row">

          {/* ── LEFT: FORM ── */}
          <div className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:pr-12">

            {/* Express checkout */}
            <p className="mb-3 text-center text-[12px] text-[#888]">Express checkout</p>
            <div className="mb-4 flex flex-wrap gap-2">
              <button type="button"
                onClick={() => { setPaymentMethod("card"); document.getElementById("payment-section")?.scrollIntoView({ behavior: "smooth" }); }}
                className="flex h-11 flex-1 items-center justify-center rounded-lg bg-[#5A31F4] text-[15px] font-bold text-white transition hover:opacity-90">
                shop
              </button>
              <button type="button"
                onClick={handlePayPal}
                disabled={paypalProcessing}
                className="flex h-11 flex-1 items-center justify-center rounded-lg bg-[#FFC439] transition hover:opacity-90 disabled:opacity-60">
                {paypalProcessing
                  ? <span className="text-[13px] font-medium text-[#003087]">Redirecting…</span>
                  : <><span className="text-[15px] font-bold italic text-[#003087]">Pay</span><span className="text-[15px] font-bold italic text-[#009cde]">Pal</span></>}
              </button>
              <button type="button"
                onClick={() => { setPaymentMethod("card"); document.getElementById("payment-section")?.scrollIntoView({ behavior: "smooth" }); }}
                className="flex h-11 flex-1 items-center justify-center gap-0.5 rounded-lg bg-[#1a1a1a] transition hover:bg-[#333]">
                <span className="text-[15px] font-bold text-[#4285F4]">G</span>
                <span className="text-[15px] font-bold text-white"> Pay</span>
              </button>
            </div>

            {/* OR divider */}
            <div className="mb-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#e5e5e5]" />
              <span className="text-[12px] text-[#aaa]">OR</span>
              <div className="h-px flex-1 bg-[#e5e5e5]" />
            </div>

            {/* Contact */}
            <div className="mb-5">
              <input type="email" placeholder="Email" value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className="h-11 w-full rounded-lg border border-[#d0d0d0] px-3 text-[13px] text-[#222] outline-none placeholder:text-[#bbb] focus:border-[#1a1a1a]" />
            </div>

            {/* Delivery */}
            <h2 className="mb-3 text-[15px] font-semibold text-[#1a1a1a]">Delivery</h2>
            <div className="relative mb-2">
              <select value={form.country} onChange={(e) => set("country", e.target.value)}
                className="h-11 w-full appearance-none rounded-lg border border-[#d0d0d0] bg-white px-3 text-[13px] text-[#222] outline-none focus:border-[#1a1a1a]">
                <option>United Kingdom</option>
                <option>United States</option>
                <option>Canada</option>
                <option>Australia</option>
                <option>Germany</option>
                <option>France</option>
                <option>Thailand</option>
              </select>
              <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#888]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
            <div className="mb-2 grid grid-cols-2 gap-2">
              <input type="text" placeholder="First name (optional)" value={form.firstName} onChange={(e) => set("firstName", e.target.value)} className="h-11 rounded-lg border border-[#d0d0d0] px-3 text-[13px] text-[#222] outline-none placeholder:text-[#bbb] focus:border-[#1a1a1a]" />
              <input type="text" placeholder="Last name" value={form.lastName} onChange={(e) => set("lastName", e.target.value)} className="h-11 rounded-lg border border-[#d0d0d0] px-3 text-[13px] text-[#222] outline-none placeholder:text-[#bbb] focus:border-[#1a1a1a]" />
            </div>
            <input type="text" placeholder="Address" value={form.address} onChange={(e) => set("address", e.target.value)} className="mb-2 h-11 w-full rounded-lg border border-[#d0d0d0] px-3 text-[13px] text-[#222] outline-none placeholder:text-[#bbb] focus:border-[#1a1a1a]" />
            <input type="text" placeholder="Apartment, suite, etc. (optional)" value={form.apartment} onChange={(e) => set("apartment", e.target.value)} className="mb-2 h-11 w-full rounded-lg border border-[#d0d0d0] px-3 text-[13px] text-[#222] outline-none placeholder:text-[#bbb] focus:border-[#1a1a1a]" />
            <div className="mb-5 grid grid-cols-2 gap-2">
              <input type="text" placeholder="City" value={form.city} onChange={(e) => set("city", e.target.value)} className="h-11 rounded-lg border border-[#d0d0d0] px-3 text-[13px] text-[#222] outline-none placeholder:text-[#bbb] focus:border-[#1a1a1a]" />
              <input type="text" placeholder="Postcode" value={form.postcode} onChange={(e) => set("postcode", e.target.value)} className="h-11 rounded-lg border border-[#d0d0d0] px-3 text-[13px] text-[#222] outline-none placeholder:text-[#bbb] focus:border-[#1a1a1a]" />
            </div>

            {/* Shipping method */}
            <h2 className="mb-3 text-[15px] font-semibold text-[#1a1a1a]">Shipping method</h2>
            <div className="mb-6 rounded-lg bg-[#f5f5f5] px-4 py-3 text-[13px] text-[#888]">
              Enter your shipping address to view available shipping methods.
            </div>

            {/* Payment */}
            <div id="payment-section">
              <h2 className="mb-1 text-[16px] font-bold text-[#1a1a1a]">Payment</h2>
              <p className="mb-3 text-[13px] text-[#888]">All transactions are secure and encrypted.</p>

              {formError && (
                <div className="mb-3 rounded-lg bg-red-50 px-4 py-3 text-[13px] text-red-700">
                  {formError}
                </div>
              )}

              <div className="overflow-hidden rounded-lg border border-[#d0d0d0]">

                {/* Credit card tab */}
                <div
                  className={`flex cursor-pointer items-center justify-between px-4 py-3 transition ${paymentMethod === "card" ? "bg-[#f0f5ff]" : "bg-white hover:bg-[#fafafa]"}`}
                  onClick={() => setPaymentMethod("card")}
                >
                  <label className="flex cursor-pointer items-center gap-2.5">
                    <input type="radio" name="payment" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} className="h-4 w-4 accent-[#1a1a1a]" />
                    <span className="text-[14px] font-medium text-[#1a1a1a]">Credit card</span>
                  </label>
                  <div className="flex items-center gap-1.5">
                    <div className="flex h-6 w-10 items-center justify-center rounded border border-[#e5e5e5] bg-white text-[9px] font-bold tracking-wide text-[#1a1a8c]">VISA</div>
                    <div className="flex h-6 w-10 items-center justify-center rounded border border-[#e5e5e5] bg-white">
                      <div className="flex"><div className="h-4 w-4 rounded-full bg-[#eb001b]" /><div className="-ml-2 h-4 w-4 rounded-full bg-[#f79e1b] opacity-90" /></div>
                    </div>
                    <div className="flex h-6 w-8 items-center justify-center rounded border border-[#e5e5e5] bg-white text-[10px] font-medium text-[#555]">+5</div>
                  </div>
                </div>

                {paymentMethod === "card" && (
                  <div className="border-t border-[#e5e5e5] bg-[#f5f7fa] px-4 pb-5 pt-4" onClick={handleCardInteract}>
                    <MockPaymentForm
                      amount={subtotal}
                      onSuccess={handleCardSuccess}
                      validateShipping={validateShipping}
                    />
                  </div>
                )}

                {/* PayPal tab */}
                <div
                  className={`flex cursor-pointer items-center justify-between border-t border-[#e5e5e5] px-4 py-3 transition ${paymentMethod === "paypal" ? "bg-[#f0f5ff]" : "bg-white hover:bg-[#fafafa]"}`}
                  onClick={() => setPaymentMethod("paypal")}
                >
                  <label className="flex cursor-pointer items-center gap-2.5">
                    <input type="radio" name="payment" checked={paymentMethod === "paypal"} onChange={() => setPaymentMethod("paypal")} className="h-4 w-4 accent-[#1a1a1a]" />
                    <span className="text-[14px] font-medium text-[#1a1a1a]">PayPal</span>
                  </label>
                  <span className="text-[15px] font-bold italic">
                    <span className="text-[#003087]">Pay</span><span className="text-[#009cde]">Pal</span>
                  </span>
                </div>

                {paymentMethod === "paypal" && (
                  <div className="border-t border-[#e5e5e5] bg-[#f5f5f5] px-4 py-4">
                    {paypalError && (
                      <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-600">{paypalError}</p>
                    )}
                    <p className="mb-4 text-center text-[13px] text-[#555]">
                      You&apos;ll be redirected to PayPal to complete your purchase securely.
                    </p>
                    <button type="button" onClick={handlePayPal} disabled={paypalProcessing}
                      className="flex h-12 w-full items-center justify-center gap-1.5 rounded-lg bg-[#FFC439] text-[15px] font-bold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
                      {paypalProcessing ? (
                        <span className="flex items-center gap-2 text-[#003087]">
                          <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Redirecting to PayPal…
                        </span>
                      ) : (
                        <><span className="italic text-[#003087]">Pay</span><span className="italic text-[#009cde]">Pal</span></>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Save info */}
            <div className="mb-5 mt-5 rounded-lg border border-[#d0d0d0] px-4 py-3">
              <label className="flex cursor-pointer items-start gap-2">
                <input type="checkbox" checked={form.saveInfo} onChange={(e) => set("saveInfo", e.target.checked)} className="mt-0.5 accent-[#1a1a1a]" />
                <div>
                  <p className="text-[13px] font-medium text-[#1a1a1a]">Save my information for a faster checkout</p>
                  <p className="mt-0.5 text-[11px] text-[#aaa]">
                    By paying, you agree to our{" "}
                    <Link href="/policies/terms-of-service" className="underline">Terms</Link> and{" "}
                    <Link href="/policies/privacy-policy" className="underline">Privacy Policy</Link>.
                  </p>
                </div>
              </label>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/policies/refund-policy" className="text-[11px] text-[#aaa] underline">Refund policy</Link>
              <Link href="/policies/privacy-policy" className="text-[11px] text-[#aaa] underline">Privacy policy</Link>
              <Link href="/policies/terms-of-service" className="text-[11px] text-[#aaa] underline">Terms of service</Link>
            </div>
          </div>

          {/* ── RIGHT: ORDER SUMMARY ── */}
          <div className="w-full border-t border-[#e5e5e5] bg-[#f9f9f9] px-4 py-6 sm:px-6 lg:w-[380px] lg:shrink-0 lg:border-l lg:border-t-0 lg:py-8">
            <div className="mb-5 flex flex-col gap-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative h-14 w-14 shrink-0">
                    <div className="relative h-14 w-14 overflow-hidden rounded-lg border border-[#e5e5e5] bg-[#f3f3f3]">
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                    </div>
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#888] text-[10px] font-medium text-white">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] text-[#1a1a1a]">{item.name}</p>
                  </div>
                  <span className="text-[13px] font-medium text-[#1a1a1a]">
                    £{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#e5e5e5] pt-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[13px] text-[#555]">Subtotal · {totalCount} item{totalCount !== 1 ? "s" : ""}</span>
                <span className="text-[13px] text-[#1a1a1a]">£{subtotal.toFixed(2)}</span>
              </div>
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[13px] text-[#555]">Shipping</span>
                <span className="text-[13px] text-[#aaa]">Calculated at next step</span>
              </div>
              <div className="flex items-center justify-between border-t border-[#e5e5e5] pt-4">
                <span className="text-[15px] font-semibold text-[#1a1a1a]">Total</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[11px] text-[#aaa]">GBP</span>
                  <span className="text-[20px] font-semibold text-[#1a1a1a]">£{subtotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
