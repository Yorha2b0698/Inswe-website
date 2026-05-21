import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeKey || !stripeKey.startsWith("sk_")) {
    return NextResponse.json(
      { error: "Stripe secret key is not configured. Set STRIPE_SECRET_KEY in your .env.local file." },
      { status: 503 }
    );
  }

  const stripe = new Stripe(stripeKey, {
    apiVersion: "2026-04-22.dahlia",
  });

  try {
    const { amount, currency = "gbp" } = await req.json();

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // convert £ to pence
      currency,
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Stripe error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
