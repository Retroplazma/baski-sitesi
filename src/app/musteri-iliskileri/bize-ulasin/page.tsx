'use client';

import { useActionState } from 'react';
import { submitContactForm } from '@/actions/contact.action';

export default function BizeUlasinPage() {
  const [state, formAction, pending] = useActionState(submitContactForm, null);

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Bizimle İletişime Geçin</h1>
      <p className="text-gray-600 mb-8">
        Soru, görüş, öneri veya kurumsal toplu sipariş talepleriniz için aşağıdaki formu doldurarak bize ulaşabilirsiniz.
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
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">Ad Soyad</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-colors"
              placeholder="Adınız Soyadınız"
            />
          </div>

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
            <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-1">Konu</label>
            <select
              id="subject"
              name="subject"
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-colors"
            >
              <option value="">Lütfen bir konu seçiniz</option>
              <option value="Sipariş Durumu">Sipariş Durumu</option>
              <option value="Ürün Bilgisi">Ürün Bilgisi / Teknik Destek</option>
              <option value="Kurumsal Sipariş">Kurumsal Toplu Sipariş</option>
              <option value="İade / Değişim">İade / Değişim</option>
              <option value="Diğer">Diğer</option>
            </select>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-1">Mesajınız</label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-colors resize-none"
              placeholder="Size nasıl yardımcı olabiliriz?"
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
              'Mesajı Gönder'
            )}
          </button>
        </form>
      )}
    </div>
  );
}
