import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import Link from 'next/link';

export default function ContactPage() {
  return (

    <main
      id="MainContent"
      className="content-for-layout min-h-screen bg-[#f5f5f5]"
      role="main"
      data-page-transition-enabled="true"
      data-product-transition="true"
      data-template="page.contact"
    >
      <Header />

      <div className="mx-auto max-w-4xl my-4">
        {/* Heading */}
        <h1 className="mb-12 text-center text-6xl font-extrabold tracking-tight text-[#222] md:text-7xl">
          Contact
        </h1>

        {/* Form */}
        <form className="space-y-5">
          {/* Name + Email */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="name" className="sr-only">
                Name
              </label>

              <input
                id="name"
                type="text"
                placeholder="Name"
                className="h-14 w-full rounded-sm border border-gray-200 bg-white px-5 text-base text-gray-800 outline-none transition-all duration-200 placeholder:text-gray-500 focus:border-black"
              />
            </div>

            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>

              <input
                id="email"
                type="email"
                placeholder="Email"
                className="h-14 w-full rounded-sm border border-gray-200 bg-white px-5 text-base text-gray-800 outline-none transition-all duration-200 placeholder:text-gray-500 focus:border-black"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="sr-only">
              Phone
            </label>

            <input
              id="phone"
              type="tel"
              placeholder="Phone"
              className="h-14 w-full rounded-sm border border-gray-200 bg-white px-5 text-base text-gray-800 outline-none transition-all duration-200 placeholder:text-gray-500 focus:border-black"
            />
          </div>

          {/* Comment */}
          <div>
            <label htmlFor="comment" className="sr-only">
              Comment
            </label>

            <textarea
              id="comment"
              placeholder="Comment"
              rows={10}
              className="w-full resize-none rounded-sm border border-gray-200 bg-white px-5 py-5 text-base text-gray-800 outline-none transition-all duration-200 placeholder:text-gray-500 focus:border-black"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="inline-flex h-14 items-center justify-center rounded-2xl bg-black px-8 text-base font-medium text-white transition-all duration-200 hover:scale-[1.02] hover:bg-neutral-800 active:scale-[0.98]"
          >
            Submit
          </button>
        </form>
      </div>

      <Footer />
    </main>

  );
}