"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

type Props = {
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonHref: string;
  videoSrc?: string;
  poster?: string;
  images?: string;
  showLogo?: boolean;
};

export default function VideoHero({
  title,
  subtitle,
  buttonText,
  buttonHref,
  videoSrc,
  poster,
  images,
  showLogo = false,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoSrc) return;
    const video = videoRef.current;
    if (!video) return;

    const tryPlay = () => {
      video.play().catch(() => {});
    };

    // Play immediately
    tryPlay();

    // Resume when tab becomes visible
    const handleVisibility = () => {
      if (!document.hidden && video.paused && !video.ended) tryPlay();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [videoSrc]);

  return (
    <section className="relative w-full text-white">
      <div className="relative w-full bg-black">
        {videoSrc ? (
          <video
            ref={videoRef}
            className="w-full h-auto block"
            autoPlay
            muted
            loop
            playsInline
            poster={poster}
            style={{ maxHeight: "100vh" }}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        ) : images ? (
          <div
            className="relative w-full aspect-[4/3] sm:aspect-[16/9]"
            style={{ maxHeight: "70vh" }}
          >
            <Image
              src={images}
              alt="campaign"
              fill
              className="object-cover"
              priority
            />
          </div>
        ) : (
          <div className="min-h-[50vh] sm:min-h-[70vh]" />
        )}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Content overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4 sm:px-6">
            {/* Logo — shown when showLogo is true */}
            {showLogo && (
              <p className="mb-4 text-[48px] font-bold tracking-[-0.04em] text-white drop-shadow-lg sm:text-[72px] md:text-[96px]">
                Inswè
              </p>
            )}

            {title && (
              <h2 className="text-3xl font-semibold sm:text-3xl md:text-5xl">{title}</h2>
            )}

            {subtitle && (
              <p className="mt-3 text-sm md:text-base text-white/80 max-w-[560px] mx-auto">
                {subtitle}
              </p>
            )}

            <Link
              href={buttonHref}
              className="inline-block mt-6 px-6 py-3 bg-white text-black rounded-full text-sm hover:bg-gray-200 transition"
            >
              {buttonText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
