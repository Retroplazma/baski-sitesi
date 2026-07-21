'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function KurumsalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const links = [
    { name: 'Hakkımızda', path: '/kurumsal/hakkimizda' },
    { name: 'Blog', path: '/kurumsal/blog' },
    { name: 'Sıkça Sorulan Sorular', path: '/kurumsal/sss' },
    { name: 'İletişim', path: '/kurumsal/iletisim' },
    { name: 'Teklif İste', path: '/kurumsal/teklif-iste' },
    { name: 'Kariyer', path: '/kurumsal/kariyer' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Başlık */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Kurumsal</h1>
          <p className="text-gray-500 mt-2">Baskı Atölyesi hakkında detaylı bilgiler ve kurumsal iletişim.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          
          {/* SOL KOLON: Sidebar */}
          <div className="md:col-span-1 bg-white border border-gray-200 rounded-lg shadow-sm sticky top-28 overflow-hidden">
            <nav className="flex flex-col">
              {links.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    href={link.path}
                    className={`px-6 py-4 text-sm font-medium transition-colors border-l-4 ${
                      isActive
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* SAĞ KOLON: İçerik */}
          <div className="md:col-span-3 bg-white p-8 rounded-lg shadow-sm border border-gray-200 min-h-[500px]">
            {children}
          </div>

        </div>
      </div>
    </div>
  );
}
