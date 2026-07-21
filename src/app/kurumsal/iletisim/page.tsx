export default function IletisimPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">İletişim Bilgileri</h1>
      <p className="text-gray-600 mb-8">Bizimle aşağıdaki iletişim kanallarından mesai saatleri içerisinde iletişime geçebilirsiniz.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Çağrı Merkezi */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
          <div className="bg-orange-100 text-orange-600 p-3 rounded-full shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">Çağrı Merkezi</h3>
            <p className="text-2xl font-black text-orange-500 tracking-tight">0850 241 0 232</p>
            <p className="text-sm text-gray-500 mt-2">Mesai saatleri içerisinde çağrı merkezimizi arayarak destek alabilirsiniz.</p>
          </div>
        </div>

        {/* E-Posta */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
          <div className="bg-blue-100 text-blue-600 p-3 rounded-full shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">E-Posta</h3>
            <p className="text-lg font-medium text-gray-900">info@baskiatolyesi.com</p>
            <p className="text-sm text-gray-500 mt-2">Tüm talep ve önerilerinizi e-posta yoluyla 7/24 iletebilirsiniz.</p>
          </div>
        </div>

        {/* Çalışma Saatleri */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
          <div className="bg-green-100 text-green-600 p-3 rounded-full shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">Çalışma Saatleri</h3>
            <p className="text-lg font-medium text-gray-900">Hafta İçi 09:00 - 18:00</p>
            <p className="text-sm text-gray-500 mt-2">Hafta sonu ve resmi tatillerde üretim / sevkiyat yapılmamaktadır.</p>
          </div>
        </div>

        {/* Adres */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
          <div className="bg-purple-100 text-purple-600 p-3 rounded-full shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">Merkez Ofis Adresi</h3>
            <p className="text-base text-gray-900 leading-relaxed">
              Caferağa Mh. Şair Nefi Sk.<br />
              No:46 D:5<br />
              Kadıköy / İstanbul
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
