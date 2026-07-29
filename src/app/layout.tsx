import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import HeaderCartButton from '@/components/HeaderCartButton';
import CartDrawer from '@/components/CartDrawer';
import CheckoutAuthModal from '@/components/CheckoutAuthModal';
import HeaderLoginButton from '@/components/HeaderLoginButton';
import SearchBar from '@/components/SearchBar';
import WhatsAppButton from '@/components/WhatsAppButton';
import { AuthProvider } from '@/providers/AuthProvider';
import Image from 'next/image';
import { Info, ChevronDown } from 'lucide-react';
import { CATEGORIES } from '@/data/products';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Baskı Atölyesi',
  description: 'Tasarımını yükle, kapına gelsin.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={`${inter.className} bg-gray-50 text-gray-800 flex flex-col min-h-screen`}>
        <AuthProvider>
          {/* Header */}
        <header className="bg-white shadow-sm relative z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-8">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center w-[300px] -ml-6 mr-4">
              <Link href="/" className="flex items-center">
                <Image 
                  src="/logo.svg" 
                  alt="Baskı Atölyesi" 
                  width={300} 
                  height={90} 
                  className="h-24 w-auto scale-[2.5] origin-left"
                  priority 
                />
              </Link>
            </div>
            {/* Search */}
            <div className="flex-1 max-w-2xl hidden md:block">
              <SearchBar />
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-6">
              <Link 
                href="/nasil-siparis-verilir" 
                className="hidden lg:flex flex-col items-center text-gray-600 hover:text-orange-500 transition-colors"
              >
                <Info className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium whitespace-nowrap">Sipariş Rehberi</span>
              </Link>
              <HeaderLoginButton />
              <HeaderCartButton />
            </div>
          </div>

          {/* Secondary Header - Categories */}
          <div className="bg-white border-b border-gray-100 shadow-sm relative z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <ul className="flex items-center justify-start space-x-6">
                <li className="relative group z-50">
                  <button className="flex items-center gap-1 text-slate-800 font-bold text-sm px-2 py-2 hover:text-orange-500 transition-colors cursor-default">
                    Tüm Kategoriler
                    <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
                  </button>
                  {/* Dropdown Content */}
                  <div className="absolute left-0 top-full w-[600px] bg-white shadow-2xl rounded-b-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-4 grid grid-cols-2 gap-2">
                    {CATEGORIES.map(category => (
                      <Link 
                        key={category.slug} 
                        href={`/urunlerimiz/${category.slug}`}
                        className="flex items-center p-3 rounded-lg hover:bg-orange-50 group/item transition-colors"
                      >
                        <div className="w-2 h-2 rounded-full bg-orange-200 mr-3 group-hover/item:bg-orange-500 transition-colors"></div>
                        <span className="font-semibold text-gray-700 group-hover/item:text-orange-700">{category.name}</span>
                      </Link>
                    ))}
                    <Link 
                      href="/urunlerimiz"
                      className="flex items-center p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors col-span-2 justify-center mt-2"
                    >
                      <span className="font-bold text-slate-700">Tüm Ürünleri Gör &rarr;</span>
                    </Link>
                  </div>
                </li>
                <li>
                  <Link 
                    href="/urunlerimiz/yeni-urunler"
                    className="block px-2 py-2 text-sm font-semibold text-slate-600 hover:text-orange-500 transition-colors whitespace-nowrap"
                  >
                    Yeni Ürünler
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/urunlerimiz/populer-urunler"
                    className="block px-2 py-2 text-sm font-semibold text-slate-600 hover:text-orange-500 transition-colors whitespace-nowrap"
                  >
                    Popüler Ürünler
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/print-and-play"
                    className="block px-2 py-2 text-sm font-semibold text-slate-600 hover:text-orange-500 transition-colors whitespace-nowrap"
                  >
                    PNP Baskı
                  </Link>
                </li>
              </ul>
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
                    { name: 'İptal / İade', path: '/sozlesmeler/iptal-iade' },
                    { name: 'KVKK Aydınlatma Metni', path: '/sozlesmeler/kvkk' },
                    { name: 'Güvenli Alışveriş', path: '/musteri-iliskileri/guvenli-alisveris' },
                    { name: 'Kargo', path: '/musteri-iliskileri/kargo' },
                    { name: 'Kullanım Koşulları', path: '/musteri-iliskileri/kullanim-kosullari' },
                    { name: 'Mesafeli Satış Sözleşmesi', path: '/sozlesmeler/mesafeli-satis' },
                    { name: 'Hakkımızda', path: '/hakkimizda' },
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
        <WhatsAppButton />
        </AuthProvider>
      </body>
    </html>
  );
}
