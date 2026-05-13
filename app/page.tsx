import Hero from "@/components/home/Hero";
import VideoHero from "@/components/home/VideoHero";
import CollectionCarousel from "@/components/home/CollectionCarousel";
import SubscribeSection from "@/components/home/SubscribeSection";
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <main className="w-full overflow-x-hidden bg-white">
      <Header />
      <Hero />

      <VideoHero
        title="New arrivals"
        subtitle="Made with care and unconditionally loved by our customers."
        buttonText="Shop Now"
        buttonHref="/shop"
        videoSrc="/assets/videos/MOV00017.AVI"
        poster="/poster.jpg"
      />

      <CollectionCarousel />

      <VideoHero
        title="DISCOVER INSWÈ CAMPAIGN SZN 1"
        buttonText="SEE NOW"
        buttonHref="/collection"
        images={[
          "/assets/images/campaign-6.jpg",
          "/assets/images/campaign-7.jpg"
        ]}
      />

      <SubscribeSection />
      <Footer />
    </main>
  );
}