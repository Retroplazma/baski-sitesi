export default function KariyerPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Kariyer Fırsatları</h1>
      <p className="text-gray-500 max-w-md mx-auto mb-8">
        Baskı Atölyesi ekibine katılmak istediğiniz için teşekkür ederiz. Şu an için açık bir pozisyonumuz bulunmamaktadır.
      </p>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md w-full">
        <p className="text-sm text-gray-600 mb-4">Genel başvuru yapmak ve özgeçmişinizi veri tabanımıza eklemek için bize e-posta gönderebilirsiniz:</p>
        <a href="mailto:info@egitimto.org" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors w-full">
          info@egitimto.org
        </a>
      </div>
    </div>
  );
}
