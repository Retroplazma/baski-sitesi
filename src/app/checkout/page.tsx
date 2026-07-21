import { verifyCheckoutToken } from "@/lib/jwt";
import CheckoutForm from "./CheckoutForm";

export default function CheckoutPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const token = searchParams.token as string;
  const payload = token ? verifyCheckoutToken(token) : null;

  if (!payload) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-red-100 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-3">Geçersiz Bağlantı</h1>
          <p className="text-gray-500">Geçersiz veya süresi dolmuş sipariş bağlantısı kullandınız. Lütfen geldiğiniz platform üzerinden tekrar deneyin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* SOL (lg:col-span-8): Kişisel bilgiler ve teslimat adresi formu */}
        <div className="lg:col-span-8 bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b border-gray-100 pb-4">Güvenli Ödeme Adımları</h2>
          <CheckoutForm payload={payload} token={token} />
        </div>

        {/* SAĞ (lg:col-span-4): Sipariş Özeti (Sepet) */}
        <div className="lg:col-span-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-28 flex flex-col">
            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Sipariş Özeti</h2>
            
            <div className="flex gap-4 items-center mb-6">
              <div className="w-20 h-20 relative rounded-md overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-200">
                {payload.customImageUrl ? (
                  <img
                    src={payload.customImageUrl}
                    alt="Ürün Görseli"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-base font-medium text-gray-900 line-clamp-2">Özel Tasarım Ürün</h3>
                <p className="text-sm text-gray-500 mt-1">{payload.quantity} Adet</p>
              </div>
            </div>

            <div className="mt-auto border-t border-gray-100 pt-6">
              <div className="flex items-center justify-between mb-4 text-gray-600">
                <span>Ara Toplam</span>
                <span className="font-medium">Hesaplanıyor</span>
              </div>
              <div className="flex items-center justify-between mb-8">
                <span className="text-lg font-bold text-gray-900">Toplam</span>
                <span className="text-3xl font-extrabold text-orange-500">Sepette</span>
              </div>
              
              {/* 
                Kullanıcı butonu sağda istedi, ancak form sol kolonda olduğu için React form state'ini
                korumak adına formu CheckoutForm içinde submit ediyoruz. Formu dışarıdan tetiklemek için 
                HTML5 form özelliği kullanabiliriz.
              */}
              <button
                type="submit"
                form="checkout-form"
                className="w-full flex justify-center items-center py-4 px-4 rounded-md shadow-md text-lg font-bold text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              >
                Siparişi Tamamla
              </button>

              {/* Güvenlik Rozetleri */}
              <div className="mt-6 flex flex-col gap-3">
                <div className="flex items-center justify-center text-xs text-gray-500 gap-2 bg-gray-50 p-3 rounded border border-gray-100">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  256-Bit SSL ile Güvenli Ödeme
                </div>
                <div className="flex items-center justify-center text-xs text-gray-500 gap-2 bg-gray-50 p-3 rounded border border-gray-100">
                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                  Bilgileriniz 3D Secure ile Korunmaktadır
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
