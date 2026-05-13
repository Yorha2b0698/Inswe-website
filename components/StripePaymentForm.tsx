"use client";

import { useState, useEffect } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

type Props = {
  onSuccess: () => void;
};

export default function StripePaymentForm({ onSuccess }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!stripe) return;
    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );
    if (!clientSecret) return;
    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
      }
    });
  }, [stripe]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
    });

    if (error?.type === "card_error" || error?.type === "validation_error") {
      setMessage(error.message ?? "An error occurred.");
    } else if (error) {
      setMessage("An unexpected error occurred.");
    } else {
      onSuccess();
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Stripe's PaymentElement renders card, wallets, bank transfers — all in one */}
      <PaymentElement
        id="payment-element"
        options={{ layout: "tabs" }}
        className="mb-4"
      />

      {message && (
        <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-600">
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || !stripe || !elements}
        className="flex h-12 w-full items-center justify-center rounded-lg bg-[#2563EB] text-[14px] font-semibold text-white transition hover:bg-[#1d4ed8] disabled:opacity-60"
      >
        {loading ? "Processing…" : "Pay now"}
      </button>
    </form>
  );
}
