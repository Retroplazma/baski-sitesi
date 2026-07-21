"use client";

import { useState } from "react";
import { createNavlungoShipment } from "@/actions/navlungo.action";
import { useRouter } from "next/navigation";

interface OrderActionNodeProps {
  orderId: string;
  paymentStatus: string;
  trackingCode: string | null;
}

export default function OrderActionNode({ orderId, paymentStatus, trackingCode }: OrderActionNodeProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreateShipment = async () => {
    setLoading(true);
    const res = await createNavlungoShipment(orderId);

    if (res.success) {
      router.refresh(); // Sayfayı yenile ve güncel kargo kodunu gör
    } else {
      alert(res.error || "Bir hata oluştu");
    }
    setLoading(false);
  };

  if (trackingCode) {
    return (
      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
        <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Kargo: <span className="ml-1 font-bold">{trackingCode}</span>
      </span>
    );
  }

  if (paymentStatus === "COMPLETED") {
    return (
      <button
        onClick={handleCreateShipment}
        disabled={loading}
        className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            İşleniyor...
          </>
        ) : (
          <>
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Kargo Barkodu Oluştur
          </>
        )}
      </button>
    );
  }

  return (
    <span className="text-gray-400 text-sm italic">Ödeme Bekleniyor</span>
  );
}
