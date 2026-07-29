import prisma from "@/lib/prisma";
import Link from "next/link";
import { CATEGORIES } from "@/data/products";
import { getAllProductsCombined } from "@/lib/db-products";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const allProducts = await getAllProductsCombined();
  const displayProducts = allProducts.filter(p => p.isPopular || p.isNew).slice(0, 8);

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

      {/* Print and Play Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <Link href="/print-and-play" className="group block bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 relative p-8 md:p-10">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-3xl font-extrabold text-white mb-2 flex items-center gap-3">
                <svg className="w-8 h-8 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                Print & Play Atölyesi
              </h2>
              <p className="text-orange-50 text-lg max-w-xl">
                Kutu oyunları, kartlar, stickerlar ve 3D modellerinizi özel olarak bastırın. Hemen dosyanızı yükleyin ve teklif alın!
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-2 bg-white text-orange-600 px-6 py-3 rounded-lg font-bold shadow-md group-hover:scale-105 transition-transform">
              Keşfet
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </div>
          </div>
          {/* Dekoratif Arka Plan Deseni */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
            <svg className="w-64 h-64 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zm0 2.8L19.2 7 12 10.6 4.8 7 12 4.8zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
        </Link>
      </div>



      {/* Products Grid */}
      <div id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Popüler Ürünler</h2>
          <Link href="/urunlerimiz" className="text-orange-500 font-medium hover:underline">Tümünü Gör &rarr;</Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {displayProducts.map((product) => (
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
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1">{product.name}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                <div className="mt-auto pt-2">
                  <p className="text-xl font-extrabold text-gray-900">
                    {(product.basePrice || 0).toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
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
