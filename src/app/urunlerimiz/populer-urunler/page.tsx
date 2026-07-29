import Link from 'next/link';
import { getAllProductsCombined } from '@/lib/db-products';
import ProductCard from '@/components/ProductCard';

export default async function PopulerUrunlerPage() {
  const allProducts = await getAllProductsCombined();
  const popularProducts = allProducts.filter(p => p.isPopular);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Popüler Ürünler</h2>
      
      {popularProducts.length === 0 ? (
        <div className="bg-white p-8 text-center rounded-lg border border-gray-200">
          <p className="text-gray-500">Şu anda popüler ürün bulunmamaktadır.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {popularProducts.map((product) => (
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
  );
}
