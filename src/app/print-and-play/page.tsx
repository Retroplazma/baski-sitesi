import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Print and Play - Baskı Atölyesi",
  description: "Özel kutu oyunu, kart, sticker ve 3D baskı hizmetlerimiz."
};

export default function PrintAndPlayPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Print and Play (Kutu Oyunu) Atölyesi</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Oyun tasarımcıları ve hobi tutkunları için özel baskı merkezi. Kendi kutu oyununuzu hayata geçirin veya 3D modellerinizi bastırın.
          </p>
        </div>

        {/* Info Alert */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-12 flex flex-col md:flex-row items-center gap-6 shadow-sm">
          <div className="bg-blue-100 text-blue-600 p-3 rounded-full shrink-0">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div>
            <h3 className="text-blue-800 font-bold text-lg mb-1">Baskı Kılavuzu & Önemli Uyarılar</h3>
            <ul className="text-blue-700 text-sm space-y-1 list-disc list-inside">
              <li>Tüm çalışmalar <strong className="font-bold">33x48 cm</strong> formatında hazırlanmalıdır.</li>
              <li>Yükleyeceğiniz tek bir dosyanın boyutu <strong className="font-bold">maksimum 50MB</strong> olmalıdır.</li>
              <li>Kart ve Sticker baskılarında yüksek çözünürlüklü (min. 300dpi) PDF veya PNG tercih edilmelidir.</li>
              <li>3D modeller için .stl veya .obj formatlarını kullanabilirsiniz.</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Baskı Flow */}
          <Link href="/print-and-play/baski" className="group block bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 relative top-0 hover:-top-2">
            <div className="h-48 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
              <svg className="w-24 h-24 text-white opacity-90 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            </div>
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">Kart & Sticker Baskı</h2>
              <p className="text-gray-600 mb-6 line-clamp-2">
                Oyun kartlarınızı, özel tasarım sticker'larınızı yükleyin, kağıt ve yüzey türünü seçin, anında fiyat hesaplayarak ödemenizi tamamlayın.
              </p>
              <div className="flex items-center text-orange-600 font-bold gap-2">
                <span>Online Ödeme İle Sipariş Ver</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </div>
            </div>
          </Link>

          {/* 3D Kutu Flow */}
          <Link href="/print-and-play/3d-kutu" className="group block bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 relative top-0 hover:-top-2">
            <div className="h-48 bg-gradient-to-br from-indigo-500 to-blue-700 flex items-center justify-center">
              <svg className="w-24 h-24 text-white opacity-90 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
            </div>
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors">3D Baskı & Kutu Üretimi</h2>
              <p className="text-gray-600 mb-6 line-clamp-2">
                Oyun piyonları, zarlar, minyatürler için 3D baskı ve tamamen oyununuza özel tasarlanmış kutu taleplerinizi bize iletin.
              </p>
              <div className="flex items-center text-blue-700 font-bold gap-2">
                <span>Teklif Alın</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </div>
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}
