"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckoutPayload } from "@/lib/jwt";
import { createOrder } from "@/actions/order.action";

export default function CheckoutForm({ payload, token }: { payload: CheckoutPayload, token: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData(e.currentTarget);
      const result = await createOrder(formData, token);
      
      if (result.success) {
        router.push(`/payment/${result.orderId}`);
      } else {
        setError(result.error || "Sipariş oluşturulurken bir hata oluştu.");
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || "Beklenmeyen bir hata oluştu.");
      setLoading(false);
    }
  };

  return (
    <form id="checkout-form" onSubmit={handleSubmit} className="space-y-10">
      {error && (
        <div className="p-4 text-sm text-red-700 bg-red-50 border-l-4 border-red-500 rounded-r-md">
          {error}
        </div>
      )}

      {/* Adım 1 */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-500 text-sm">1</span>
          Kişisel Bilgiler
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 ml-10">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">İsim</label>
            <input
              name="firstName"
              type="text"
              required
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="Adınız"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Soyisim</label>
            <input
              name="lastName"
              type="text"
              required
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="Soyadınız"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">E-posta</label>
            <input
              name="email"
              type="email"
              required
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="ornek@email.com"
            />
          </div>
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Adım 2 */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-500 text-sm">2</span>
          Adres Bilgileri
        </h3>
        <div className="grid grid-cols-1 gap-5 ml-10">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Teslimat Adresi</label>
            <textarea
              name="shippingAddress"
              required
              rows={3}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all resize-none disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="Mahalle, Sokak, Bina No, Daire..."
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Fatura Adresi</label>
            <textarea
              name="billingAddress"
              required
              rows={3}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all resize-none disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="Fatura adresiniz teslimat adresi ile aynıysa aynısını yazabilirsiniz..."
            ></textarea>
          </div>
        </div>
      </div>
      
      {loading && (
        <div className="text-sm text-orange-600 flex items-center justify-center py-2">
          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Sipariş Oluşturuluyor, lütfen bekleyin...
        </div>
      )}
    </form>
  );
}
