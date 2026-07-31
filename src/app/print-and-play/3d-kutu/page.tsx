"use client";

import { useState } from "react";
import PnpUploader from "@/components/PnpUploader";
import { createQuoteRequest } from "@/actions/pnp.action";
import { sendQuoteRequestAdminEmail, sendQuoteRequestCustomerEmail } from "@/actions/email.action";
import Link from "next/link";

export default function PnpQuotePage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fileUrls, setFileUrls] = useState<string[]>([]);
  const [wantsBox, setWantsBox] = useState(false);
  const [message, setMessage] = useState("");
  
  const [contact, setContact] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  });

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (fileUrls.length === 0 && !message.trim()) {
      setError("Lütfen bir dosya yükleyin veya talebinizi detaylıca açıklayın.");
      return;
    }

    setLoading(true);

    try {
      // 1. Veritabanına teklif talebini kaydet
      const res = await createQuoteRequest({
        ...contact,
        message,
        wantsBox,
        fileUrls
      });

      if (!res.success || !res.orderNumber) {
        throw new Error(res.error || "Talep oluşturulamadı.");
      }

      // 2. E-postaları gönder
      await Promise.all([
        sendQuoteRequestAdminEmail({
          orderNumber: res.orderNumber,
          ...contact,
          message,
          wantsBox,
          fileUrls
        }),
        sendQuoteRequestCustomerEmail(contact.email, contact.firstName, res.orderNumber)
      ]);

      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Talebiniz alınırken beklenmeyen bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-gray-50 min-h-screen py-20 flex items-center justify-center">
        <div className="max-w-xl mx-auto bg-white p-10 rounded-2xl shadow-xl text-center border border-gray-100">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Talebiniz Alındı!</h1>
          <p className="text-gray-600 mb-8 text-lg">
            3D baskı ve kutu üretimi talebiniz ekibimize başarıyla ulaştı. Dosyalarınızı inceleyip en kısa sürede size fiyat teklifi ile döneceğiz.
          </p>
          <Link href="/print-and-play" className="inline-block px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition">
            Print and Play'e Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Üst Yönlendirme */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/print-and-play" className="text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-2 text-sm font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Print & Play'e Dön
          </Link>
          <Link href="/urunlerimiz" className="text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium">
            Tüm Ürünler &rarr;
          </Link>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">3D Baskı ve Özel Kutu Üretimi</h1>
          <p className="text-gray-600">Projenizi detaylandırın ve dosyalarınızı yükleyin, size en uygun fiyat teklifiyle geri dönelim.</p>
        </div>

        {/* Kutu Kaplama Yönlendirmesi */}
        <div className="mb-8 bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-indigo-900">Kendi Kutu Kaplamanızı mı (Sticker) Tasarlamak İstiyorsunuz?</h3>
            <p className="text-sm text-indigo-700 mt-1">Özel kutunuz için kaplama/sticker tasarımınızı yapın, ölçülerinizi girip baskı tabakanızı (33x48 cm) anında hazırlayın ve sepete ekleyin.</p>
          </div>
          <Link href="/print-and-play/kutu-kaplama" className="shrink-0 px-6 py-3 bg-indigo-600 text-white font-bold text-sm rounded-xl shadow-md hover:bg-indigo-700 transition-colors">
            Kutu Kaplama Aracına Git
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          
          {/* Uploader */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">3D Model & Tasarım Dosyaları</h2>
            <PnpUploader 
              onUploadSuccess={(urls) => setFileUrls(urls)}
              onClear={() => setFileUrls([])}
            />
          </div>

          {/* Details */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Proje Detayları</h2>
            
            <div className="space-y-6">
              <label className="flex items-center gap-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors">
                <input 
                  type="checkbox" 
                  checked={wantsBox}
                  onChange={(e) => setWantsBox(e.target.checked)}
                  className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className="font-semibold text-gray-800">Özel Kutu Yaptırmak İstiyor musunuz?</span>
              </label>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Açıklama & Detaylar</label>
                <textarea 
                  rows={4} 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Baskı kalitesi, renk, malzeme, ölçüler veya kutu detayları gibi özel isteklerinizi buraya yazabilirsiniz..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">İletişim Bilgileri</h2>
            
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Adınız</label>
                <input required type="text" name="firstName" value={contact.firstName} onChange={handleContactChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Soyadınız</label>
                <input required type="text" name="lastName" value={contact.lastName} onChange={handleContactChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">E-posta Adresiniz</label>
                <input required type="email" name="email" value={contact.email} onChange={handleContactChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Telefon Numaranız</label>
                <input required type="tel" name="phone" value={contact.phone} onChange={handleContactChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" placeholder="05XX XXX XX XX" />
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg font-medium">
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Gönderiliyor...
              </span>
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                Teklif İste
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
}
