'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CATEGORIES } from '@/data/products';

export default function UrunlerimizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Başlık */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Ürünlerimiz</h1>
          <p className="text-gray-500 mt-2">Tasarımlarınızı ölümsüzleştirecek yüzlerce farklı baskı seçeneği.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* SOL KOLON: Sidebar */}
          <div className="lg:col-span-1 bg-white border border-gray-200 rounded-lg shadow-sm sticky top-28 overflow-hidden">
            <nav className="flex flex-col py-2">
              <Link
                href="/urunlerimiz"
                className={`px-6 py-3 text-sm font-bold transition-colors ${
                  pathname === '/urunlerimiz'
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                    : 'text-gray-900 hover:bg-gray-50 border-l-4 border-transparent'
                }`}
              >
                Tüm Ürünler
              </Link>
              
              <div className="border-t border-gray-100 my-2"></div>
              
              <div className="px-6 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Kategoriler
              </div>
              
              {CATEGORIES.map((cat) => {
                const isActive = pathname === `/urunlerimiz/${cat.slug}`;
                return (
                  <Link
                    key={cat.slug}
                    href={`/urunlerimiz/${cat.slug}`}
                    className={`px-6 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-gray-100 text-gray-900 border-l-4 border-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'
                    }`}
                  >
                    {cat.name}
                  </Link>
                );
              })}

              <div className="border-t border-gray-100 my-2"></div>

              <Link
                href="/urunlerimiz/hazir-sablonlar"
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  pathname === '/urunlerimiz/hazir-sablonlar'
                    ? 'bg-orange-50 text-orange-700 border-l-4 border-orange-600'
                    : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'
                }`}
              >
                Hazır Şablonlar
              </Link>
              
              <Link
                href="/urunlerimiz/yeni-urunler"
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  pathname === '/urunlerimiz/yeni-urunler'
                    ? 'bg-green-50 text-green-700 border-l-4 border-green-600'
                    : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'
                }`}
              >
                Yeni Ürünler ✨
              </Link>
            </nav>
          </div>

          {/* SAĞ KOLON: İçerik */}
          <div className="lg:col-span-3 min-h-[500px]">
            {children}
          </div>

        </div>
      </div>
    </div>
  );
}
