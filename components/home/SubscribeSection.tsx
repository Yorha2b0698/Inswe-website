"use client";

import { useState } from "react";

export default function SubscribeSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;
    // Subscription logic goes here (e.g. POST to a mailing list API).
    // For now we show a success message immediately.
    setStatus("success");
    setEmail("");
  };

  return (
    <section className="bg-gray-100 py-16 sm:py-20">
      <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
        <h2 className="text-xl font-semibold sm:text-2xl">
          Subscribe to our emails
        </h2>

        <p className="mt-2 text-[14px] text-gray-600 sm:text-[15px]">
          Be the first to know about new collections and special offers.
        </p>

        {status === "success" ? (
          <p className="mt-6 text-[14px] font-medium text-green-700">
            Thanks for subscribing!
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-2 sm:flex-row">
            <input
              type="email"
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-full border border-gray-300 px-4 py-3 text-[14px] focus:outline-none sm:rounded-r-none sm:rounded-l-full"
            />
            <button
              type="submit"
              className="rounded-full bg-black px-6 py-3 text-white transition hover:bg-gray-800 sm:rounded-l-none sm:rounded-r-full"
            >
              →
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
