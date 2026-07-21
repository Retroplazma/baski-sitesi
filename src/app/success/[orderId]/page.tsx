import Link from "next/link";

export default async function SuccessPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-6 shadow-xl shadow-green-100/50 sm:rounded-3xl sm:px-10 border border-green-50 text-center">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
            Siparişiniz Başarıyla Alındı!
          </h2>
          
          <div className="bg-gray-50 rounded-xl p-5 my-6 border border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Sipariş Numaranız</p>
            <p className="text-lg font-mono font-bold text-blue-600">{orderId}</p>
          </div>
          
          <p className="text-sm text-gray-600 mb-8 leading-relaxed px-2">
            Siparişinizle ilgili detaylar ve güncel durum bilgileri sisteme kaydedildi. Bizi tercih ettiğiniz için teşekkür ederiz.
          </p>

          <Link
            href="/"
            className="inline-flex w-full items-center justify-center px-6 py-4 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
          >
            Alışverişe Devam Et
          </Link>
        </div>
      </div>
    </div>
  );
}
