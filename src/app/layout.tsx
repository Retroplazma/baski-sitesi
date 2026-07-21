import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import HeaderCartButton from '@/components/HeaderCartButton';
import CartDrawer from '@/components/CartDrawer';
import CheckoutAuthModal from '@/components/CheckoutAuthModal';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Baskı Atölyesi',
  description: 'Tasarımını yükle, kapına gelsin.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={`${inter.className} bg-gray-50 text-gray-800 flex flex-col min-h-screen`}>
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-black text-orange-500 tracking-tight">
                Baskı Atölyesi
              </Link>
            </div>
            {/* Search */}
            <div className="flex-1 max-w-2xl hidden md:block">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Ürün, kategori veya marka ara..." 
                  className="w-full bg-gray-100 border-none rounded-md py-3 pl-4 pr-10 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-colors outline-none"
                />
                <div className="absolute right-3 top-3 text-gray-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            {/* Actions */}
            <div className="flex items-center gap-6">
              <button className="flex flex-col items-center text-gray-600 hover:text-orange-500 transition-colors">
                <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                <span className="text-xs font-medium">Giriş Yap</span>
              </button>
              <HeaderCartButton />
            </div>
          </div>
        </header>

        {/* Global Cart Drawer */}
        <CartDrawer />
        
        {/* Checkout Auth Modal */}
        <CheckoutAuthModal />

        <main className="flex-1">
          {children}
        </main>
        
        {/* Mega Footer */}
        <footer className="bg-slate-900 text-gray-300 py-16 mt-auto border-t-[8px] border-orange-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              
              {/* Sütun 1: Müşteri İlişkileri */}
              <div>
                <h3 className="text-white font-bold text-lg mb-6">Müşteri İlişkileri</h3>
                <ul className="space-y-3 text-sm">
                  {[
                    { name: 'Üyelik Sözleşmesi', path: '/musteri-iliskileri/uyelik-sozlesmesi' },
                    { name: 'İade / Değişim', path: '/musteri-iliskileri/iade-degisim' },
                    { name: 'KVKK Aydınlatma Metni', path: '/musteri-iliskileri/kvkk' },
                    { name: 'Güvenli Alışveriş', path: '/musteri-iliskileri/guvenli-alisveris' },
                    { name: 'Kargo', path: '/musteri-iliskileri/kargo' },
                    { name: 'Kullanım Koşulları', path: '/musteri-iliskileri/kullanim-kosullari' },
                    { name: 'Mesafeli Satış Sözleşmesi', path: '/musteri-iliskileri/mesafeli-satis' },
                    { name: 'Hakkımızda', path: '/musteri-iliskileri/hakkimizda' },
                    { name: 'Bize Ulaşın', path: '/musteri-iliskileri/bize-ulasin' },
                    { name: 'Blog', path: '/musteri-iliskileri/blog' },
                    { name: 'Çerez Politikası', path: '/musteri-iliskileri/cerez-politikasi' }
                  ].map(item => (
                    <li key={item.name}><Link href={item.path} className="hover:text-white transition-colors">{item.name}</Link></li>
                  ))}
                </ul>
              </div>

              {/* Sütun 2: Kurumsal */}
              <div>
                <h3 className="text-white font-bold text-lg mb-6">Kurumsal</h3>
                <ul className="space-y-3 text-sm">
                  {[
                    { name: 'Hakkımızda', path: '/kurumsal/hakkimizda' },
                    { name: 'BLOG', path: '/kurumsal/blog' },
                    { name: 'Sıkça Sorulan Sorular', path: '/kurumsal/sss' },
                    { name: 'İletişim', path: '/kurumsal/iletisim' },
                    { name: 'Teklif İste', path: '/kurumsal/teklif-iste' },
                    { name: 'Kariyer', path: '/kurumsal/kariyer' }
                  ].map(item => (
                    <li key={item.name}><Link href={item.path} className="hover:text-white transition-colors">{item.name}</Link></li>
                  ))}
                </ul>
              </div>

              {/* Sütun 3: Ürünlerimiz */}
              <div>
                <h3 className="text-white font-bold text-lg mb-6">Ürünlerimiz</h3>
                <ul className="space-y-3 text-sm">
                  {[
                    { name: 'Tüm Matbaa Baskı Ürünleri', path: '/urunlerimiz' },
                    { name: 'Hazır Şablonlar', path: '/urunlerimiz/hazir-sablonlar' },
                    { name: 'Yeni Ürünlerimizi Gördünüz mü?', path: '/urunlerimiz/yeni-urunler' }
                  ].map(item => (
                    <li key={item.name}><Link href={item.path} className="hover:text-white transition-colors">{item.name}</Link></li>
                  ))}
                </ul>
              </div>

              {/* Sütun 4: İletişim Bilgileri */}
              <div>
                <h3 className="text-white font-bold text-lg mb-6">İletişim Bilgileri</h3>
                <div className="text-sm space-y-6">
                  <div>
                    <span className="block font-semibold mb-1 text-white text-base">Hafta İçi</span>
                    09:00 - 18:00
                  </div>
                  <div>
                    <span className="block font-semibold mb-1 text-white text-base text-orange-400">0850 241 0 232</span>
                  </div>
                  <div>
                    <span className="block font-semibold mb-1 text-white text-base">Adres</span>
                    Caferağa Mh. Şair Nefi Sk. No:46 D:5<br/>
                    Kadıköy/İstanbul
                  </div>
                </div>
              </div>

            </div>
            
            <div className="mt-16 pt-8 border-t border-slate-700/50 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Baskı Atölyesi. Tüm hakları saklıdır.
              </div>
              <div className="flex gap-4">
                {/* Simulated Social Icons */}
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-gray-400 hover:bg-orange-500 hover:text-white transition-colors cursor-pointer">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-gray-400 hover:bg-orange-500 hover:text-white transition-colors cursor-pointer">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
