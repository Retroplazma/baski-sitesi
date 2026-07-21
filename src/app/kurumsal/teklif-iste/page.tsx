'use client';

import { useActionState } from 'react';
import { submitQuoteForm } from '@/actions/quote.action';

export default function TeklifIstePage() {
  const [state, formAction, pending] = useActionState(submitQuoteForm, null);

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Kurumsal Teklif İste</h1>
      <p className="text-gray-600 mb-8">
        Toplu siparişleriniz ve kurumsal baskı çözümleriniz için aşağıdaki formu doldurarak bize ulaşın, size özel fiyatlandıralım.
      </p>

      {state?.success ? (
        <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-8 rounded-lg flex items-center gap-4">
          <div className="bg-green-100 p-2 rounded-full">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold">Harika!</h3>
            <p>{state.message}</p>
          </div>
        </div>
      ) : (
        <form action={formAction} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="companyName" className="block text-sm font-semibold text-gray-700 mb-1">Firma / Kurum Adı</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-colors"
                placeholder="Örn: ABC A.Ş."
              />
            </div>

            <div>
              <label htmlFor="contactName" className="block text-sm font-semibold text-gray-700 mb-1">Yetkili Ad Soyad</label>
              <input
                type="text"
                id="contactName"
                name="contactName"
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-colors"
                placeholder="Adınız Soyadınız"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">E-posta Adresi</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-colors"
                placeholder="ornek@sirketiniz.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1">Telefon Numarası</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-colors"
                placeholder="0(555) 123 45 67"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="productType" className="block text-sm font-semibold text-gray-700 mb-1">İlgilendiğiniz Ürün/Baskı Türü</label>
              <input
                type="text"
                id="productType"
                name="productType"
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-colors"
                placeholder="Örn: Poster, Kupa, Kanvas"
              />
            </div>

            <div>
              <label htmlFor="quantity" className="block text-sm font-semibold text-gray-700 mb-1">Tahmini Adet</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="1"
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-colors"
                placeholder="Örn: 50"
              />
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-1">Eklemek İstedikleriniz (Mesajınız)</label>
            <textarea
              id="message"
              name="message"
              rows={4}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-colors resize-none"
              placeholder="Ölçü, malzeme vb. detayları belirtebilirsiniz."
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:bg-blue-400"
          >
            {pending ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Gönderiliyor...
              </>
            ) : (
              'Teklif İste'
            )}
          </button>
        </form>
      )}
    </div>
  );
}
