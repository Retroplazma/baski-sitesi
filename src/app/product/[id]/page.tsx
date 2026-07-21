import { PRODUCTS } from "@/data/products";
import ProductDetailClient from "@/app/product/[id]/ProductDetailClient";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({ params }: any) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  // Gerçek veritabanı bağlantısı ileride buraya eklenebilir. 
  // Şimdilik mock data kullanıyoruz.
  const product = PRODUCTS.find(p => p.id === id);

  if (!product) {
    notFound();
  }

  // Tüm layout, veri çekme ve karmaşık form süreçleri ProductDetailClient'a taşındı.
  return (
    <div className="bg-white min-h-screen">
      <ProductDetailClient productId={product.id} />
    </div>
  );
}
