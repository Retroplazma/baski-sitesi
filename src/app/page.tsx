import prisma from "@/lib/prisma";
import Link from "next/link";
import { PRODUCTS } from "@/data/products";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const displayProducts = PRODUCTS.filter(p => p.isPopular).slice(0, 8);

  return (
    <div className="bg-gray-50 pb-20">
      {/* Hero Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-blue-900 rounded-xl overflow-hidden shadow-sm flex flex-col md:flex-row items-center justify-between p-8 md:p-16 relative">
          <div className="relative z-10 md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4 tracking-tight">
              Tasarımını Yükle,<br/> <span className="text-orange-400">Kapına Gelsin</span>
            </h1>
            <p className="text-blue-100 text-lg mb-8 max-w-md">
              Kişiye özel baskılı ürünlerle fark yaratın. Yüksek kalite, hızlı teslimat ve %100 müşteri memnuniyeti.
            </p>
            <a href="#products" className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-md transition-colors text-lg shadow-lg">
              Hemen Başla
            </a>
          </div>
          <div className="hidden md:flex relative z-10 w-1/2 justify-end">
            <svg className="w-64 h-64 text-blue-800 opacity-50" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Popüler Ürünler</h2>
          <a href="#" className="text-orange-500 font-medium hover:underline">Tümünü Gör &rarr;</a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {displayProducts.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`} className="group block bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
              <div className="relative aspect-square bg-gray-100">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
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
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1">{product.name}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                <div className="mt-auto pt-2">
                  <p className="text-xl font-extrabold text-gray-900">
                    {(Math.random() * 200 + 50).toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 1. Hakkımızda (Bilgi) Bölümü */}
      <div className="bg-gray-50 py-16 mt-8 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Baskı Atölyesi: Anılarınızı Sanata Dönüştürüyoruz
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Yüksek teknoloji baskı makinelerimiz ve uzman ekibimizle, dijital anılarınızı en yüksek kalitede fiziksel eserlere dönüştürüyoruz. Hızlı kargo, %100 müşteri memnuniyeti ve güvenli ödeme altyapımızla sanatınızı duvarlara taşıyoruz. İster kişisel bir hediye ister kurumsal reklam materyalleri olsun, hayalinizdeki tasarımı tek tıkla kusursuz bir gerçeğe çeviriyoruz.
          </p>
        </div>
      </div>

      {/* 2. Referanslar / Müşteri Yorumları (Testimonials) */}
      <div className="bg-white py-16 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Mutlu Müşterilerimiz</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white border border-gray-100 shadow-sm rounded-lg p-6 flex flex-col h-full hover:shadow-md transition-shadow">
              <div className="flex text-yellow-400 mb-4 text-sm gap-1">
                ⭐⭐⭐⭐⭐
              </div>
              <p className="text-gray-600 flex-1 italic mb-6 leading-relaxed">
                "Poster baskı kalitesi muazzamdı, bilgisayarımda gördüğüm renklerle birebir aynı. Ayrıca ertesi gün kargoya verildi. Teşekkürler!"
              </p>
              <div className="font-bold text-gray-900 text-sm">Ayşe Y.</div>
            </div>

            <div className="bg-white border border-gray-100 shadow-sm rounded-lg p-6 flex flex-col h-full hover:shadow-md transition-shadow">
              <div className="flex text-yellow-400 mb-4 text-sm gap-1">
                ⭐⭐⭐⭐⭐
              </div>
              <p className="text-gray-600 flex-1 italic mb-6 leading-relaxed">
                "Kupa bardak siparişim özenle paketlenmişti ve hiç zarar görmemişti. Arkadaşım hediyesine bayıldı, SMS ile kargo takibi çok rahattı."
              </p>
              <div className="font-bold text-gray-900 text-sm">Caner K.</div>
            </div>

            <div className="bg-white border border-gray-100 shadow-sm rounded-lg p-6 flex flex-col h-full hover:shadow-md transition-shadow">
              <div className="flex text-yellow-400 mb-4 text-sm gap-1">
                ⭐⭐⭐⭐⭐
              </div>
              <p className="text-gray-600 flex-1 italic mb-6 leading-relaxed">
                "Sistemin kullanımı çok basit. Tasarımımı yükledim ve önizlemeyi anında gördüm. Sonuç harika, ofisteki herkes nereden yaptırdığımı sordu."
              </p>
              <div className="font-bold text-gray-900 text-sm">Elif T.</div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
