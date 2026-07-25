import Link from 'next/link';
import { PRODUCTS } from '@/data/products';
import Image from 'next/image';

export default function UrunlerimizPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Tüm Ürünler</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {PRODUCTS.map((product) => (
          <Link key={product.id} href={`/product/${product.id}`} className="group block bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
            <div className="relative aspect-square bg-gray-100">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={product.image} alt={product.name} className="w-full h-full object-contain p-2" />
              </div>
              
              {/* Eserini Gör Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white z-10 backdrop-blur-sm">
                <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path>
                </svg>
                <span className="font-bold tracking-wide">Eserini Gör</span>
              </div>
              
              {product.isNew && (
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm z-20">
                  YENİ
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1">{product.name}</h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
