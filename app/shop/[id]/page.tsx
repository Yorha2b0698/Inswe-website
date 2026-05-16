import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductDetail from "@/components/productItem/ProductDetail";
import { allProducts } from "@/lib/products";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return allProducts.map((p) => ({ id: String(p.id) }));
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = allProducts.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <main className="bg-[#f5f5f5] min-h-screen">
        <Header />
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-[16px] text-[#666]">Product not found.</p>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Header />
      <div className="flex-1">
        <ProductDetail product={product} />
      </div>
      <Footer />
    </main>
  );
}
