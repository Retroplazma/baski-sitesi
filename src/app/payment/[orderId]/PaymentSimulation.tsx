"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { processPayment } from "@/actions/payment.action";

export default function PaymentSimulation({ orderId }: { orderId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handlePayment = () => {
    startTransition(async () => {
      const result = await processPayment(orderId);
      if (result.success) {
        router.push(`/success/${orderId}`);
      } else {
        alert(result.error || "Ödeme başarısız.");
      }
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-6">
      <h2 className="text-xl font-semibold text-gray-800 border-b pb-4">Ödeme Bilgileri</h2>
      
      <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
        <p className="text-sm font-medium text-gray-500 mb-2">Kart Üzerindeki İsim</p>
        <div className="h-10 bg-gray-200 rounded animate-pulse w-3/4 mb-5 opacity-50"></div>
        <p className="text-sm font-medium text-gray-500 mb-2">Kart Numarası</p>
        <div className="h-10 bg-gray-200 rounded animate-pulse w-full mb-5 opacity-50"></div>
        <div className="flex gap-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 mb-2">Son Kullanma</p>
            <div className="h-10 bg-gray-200 rounded animate-pulse w-full opacity-50"></div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 mb-2">CVV</p>
            <div className="h-10 bg-gray-200 rounded animate-pulse w-full opacity-50"></div>
          </div>
        </div>
      </div>

      <button
        onClick={handlePayment}
        disabled={isPending}
        className="mt-2 w-full py-4 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
      >
        {isPending ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            İşleniyor...
          </>
        ) : (
          "Kredi Kartı ile Öde (Test)"
        )}
      </button>
      <p className="text-xs text-center text-gray-500 mt-2">Bu bir simülasyon adımıdır. Gerçek ödeme alınmayacaktır.</p>
    </div>
  );
}
