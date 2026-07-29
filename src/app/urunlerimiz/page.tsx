import Link from 'next/link';
import { getAllProductsCombined } from '@/lib/db-products';
import ProductCard from '@/components/ProductCard';
export default async function UrunlerimizPage() {
  const allProducts = await getAllProductsCombined();
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Tüm Ürünler</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {allProducts.map((product) => (
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
    </div>
  );
}
