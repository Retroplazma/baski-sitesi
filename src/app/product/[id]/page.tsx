import { getProductByIdCombined } from "@/lib/db-products";
import ProductDetailClient from "@/app/product/[id]/ProductDetailClient";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({ params }: any) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  const product = await getProductByIdCombined(id);

  if (!product) {
    notFound();
  }

  // Tüm layout, veri çekme ve karmaşık form süreçleri ProductDetailClient'a taşındı.
  return (
    <div className="bg-white min-h-screen">
      <ProductDetailClient initialProduct={product} />
    </div>
  );
}
