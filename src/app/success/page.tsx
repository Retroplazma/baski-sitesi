"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");

  return (
    <div className="bg-white p-10 rounded-2xl shadow-xl max-w-2xl w-full text-center border border-gray-100">
      <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Siparişiniz Alındı!</h1>
      <p className="text-lg text-gray-600 mb-6 leading-relaxed">
        Siparişiniz başarıyla sisteme kaydedildi ve üretime hazırlanıyor. 
        Siparişinizin durumunu e-posta adresinize gelen bildirimlerden takip edebilirsiniz.
      </p>
      
      {orderNumber && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6 inline-block border border-gray-200">
          <span className="text-gray-500 block text-sm font-semibold mb-1">Sipariş Numarası</span>
          <span className="text-2xl font-black text-gray-800">{orderNumber}</span>
        </div>
      )}

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 text-left rounded-r-lg mx-auto">
        <h3 className="text-blue-800 font-bold mb-1">Önemli Bilgilendirme</h3>
        <p className="text-sm text-blue-700 leading-relaxed">
          Siparişinizdeki tasarımlar ekibimiz tarafından incelenecek ve baskıya uygunluğu kontrol edilecektir. İnceleme tamamlandığında <strong>onayınıza sunulacaktır</strong>. Üretime geçilmesi için "Siparişlerim" sayfasından onay vermeniz gerekmektedir.
        </p>
      </div>
      
      <div>
        <Link href="/" className="inline-block px-8 py-4 bg-[#00008F] hover:bg-blue-800 text-white font-bold rounded-lg transition-colors shadow-md text-lg">
          Alışverişe Dön
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-20">
      <Suspense fallback={<div className="text-gray-500 text-xl font-bold">Yükleniyor...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
