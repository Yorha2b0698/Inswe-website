"use client";

import { useState } from "react";

type Props = {
  amount: number;
  onSuccess: () => void;
  onError?: (error: string) => void;
  validateShipping?: () => string | null;
};

// Luhn algorithm — validates card numbers the same way real payment processors do
function luhn(num: string) {
  let sum = 0;
  let alt = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let n = parseInt(num[i], 10);
    if (alt) { n *= 2; if (n > 9) n -= 9; }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

function formatCardNumber(raw: string) {
  return raw.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)} / ${digits.slice(2)}` : digits;
}

export default function MockPaymentForm({ amount, onSuccess, onError, validateShipping }: Props) {
  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // ── Validate shipping first ───────────────────────────────────────────
    if (validateShipping) {
      const shippingErr = validateShipping();
      if (shippingErr) {
        setError(shippingErr);
        onError?.(shippingErr);
        return;
      }
    }

    // ── Validate card number ──────────────────────────────────────────────
    const rawCard = card.replace(/\s/g, "");
    if (rawCard.length < 13) {
      const msg = "Please enter a valid card number.";
      setError(msg); onError?.(msg); return;
    }
    if (!luhn(rawCard)) {
      const msg = "Card number is invalid.";
      setError(msg); onError?.(msg); return;
    }

    // ── Validate expiry ───────────────────────────────────────────────────
    const [mm, yy] = expiry.split("/").map((s) => s.trim());
    const month = parseInt(mm, 10);
    const year = 2000 + parseInt(yy ?? "0", 10);
    const now = new Date();
    if (!mm || !yy || month < 1 || month > 12 || new Date(year, month) <= now) {
      const msg = "Expiry date is invalid or in the past.";
      setError(msg); onError?.(msg); return;
    }

    // ── Validate CVC ──────────────────────────────────────────────────────
    if (!/^\d{3,4}$/.test(cvc)) {
      const msg = "CVC must be 3 or 4 digits.";
      setError(msg); onError?.(msg); return;
    }

    // ── Validate name ─────────────────────────────────────────────────────
    if (!name.trim()) {
      const msg = "Please enter the name on your card.";
      setError(msg); onError?.(msg); return;
    }

    // ── Simulate processing ───────────────────────────────────────────────
    setLoading(true);
    await new Promise((res) => setTimeout(res, 1800));
    setLoading(false);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">

      {/* Notice */}
      <div className="rounded-lg bg-blue-50 border border-blue-100 px-3 py-2.5 text-[12px] text-blue-700">
        <span className="font-semibold">Demo mode</span> — no real charge is made.
        Use any future expiry, any 3-digit CVC, and any name.
      </div>

      {/* Card number */}
      <div className="flex flex-col gap-1">
        <label className="text-[12px] font-medium text-[#555]">Card number</label>
        <input
          type="text"
          inputMode="numeric"
          placeholder="1234 5678 9012 3456"
          value={card}
          onChange={(e) => setCard(formatCardNumber(e.target.value))}
          className="h-11 rounded-lg border border-[#d0d0d0] bg-white px-3 text-[14px] text-[#222] outline-none placeholder:text-[#bbb] focus:border-[#1a1a1a]"
        />
      </div>

      {/* Expiry + CVC */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-[12px] font-medium text-[#555]">Expiry</label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="MM / YY"
            value={expiry}
            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
            className="h-11 rounded-lg border border-[#d0d0d0] bg-white px-3 text-[14px] text-[#222] outline-none placeholder:text-[#bbb] focus:border-[#1a1a1a]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[12px] font-medium text-[#555]">CVC</label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="123"
            value={cvc}
            onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
            className="h-11 rounded-lg border border-[#d0d0d0] bg-white px-3 text-[14px] text-[#222] outline-none placeholder:text-[#bbb] focus:border-[#1a1a1a]"
          />
        </div>
      </div>

      {/* Name on card */}
      <div className="flex flex-col gap-1">
        <label className="text-[12px] font-medium text-[#555]">Name on card</label>
        <input
          type="text"
          placeholder="Jane Smith"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-11 rounded-lg border border-[#d0d0d0] bg-white px-3 text-[14px] text-[#222] outline-none placeholder:text-[#bbb] focus:border-[#1a1a1a]"
        />
      </div>

      {/* Error */}
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-600">
          {error}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#1a1a1a] text-[14px] font-semibold text-white transition hover:bg-[#333] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processing…
          </>
        ) : (
          `Pay £${amount.toFixed(2)}`
        )}
      </button>
    </form>
  );
}
