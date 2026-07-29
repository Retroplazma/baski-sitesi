import { searchProducts } from "@/actions/product.action";
import ProductCard from "@/components/ProductCard";
import { mapPrismaProductToStatic } from "@/lib/db-products";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function SearchResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const query = typeof resolvedParams.q === 'string' ? resolvedParams.q : undefined;

  if (!query) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center bg-gray-50 px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Lütfen aramak istediğiniz kelimeyi girin</h2>
        <Link href="/" className="text-orange-500 hover:underline">
          Ana Sayfaya Dön
        </Link>
      </div>
    );
  }

  const dbResults = await searchProducts(query);
  const products = dbResults.map(mapPrismaProductToStatic);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 border-b border-gray-200 pb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            "{query}" için arama sonuçları: ({products.length} ürün bulundu)
          </h1>
        </div>

        {products.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-gray-200 shadow-sm">
            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-xl font-medium text-gray-900 mb-2">"{query}" için sonuç bulunamadı.</h3>
            <p className="text-gray-500 mb-6">Farklı bir kelime ile tekrar aramayı deneyebilirsiniz.</p>
            <Link href="/" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none">
              Ana Sayfaya Dön
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard 
                key={product.id}
                id={product.id}
                name={product.name}
                description={product.description}
                image={product.image}
                isNew={product.isNew}
                basePrice={product.basePrice}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
