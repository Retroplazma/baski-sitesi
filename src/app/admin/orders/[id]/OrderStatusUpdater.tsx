"use client";

import { useState } from "react";
import { updateOrderStatus } from "@/actions/order.action";
import { useRouter } from "next/navigation";

export default function OrderStatusUpdater({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(currentStatus);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === "SHIPPED") {
      const confirmed = window.confirm("Müşteriye kargo e-postası gönderilecek, onaylıyor musunuz?");
      if (!confirmed) return;
    }

    setLoading(true);
    setMessage("");

    const res = await updateOrderStatus(orderId, newStatus);
    
    setLoading(false);
    
    if (res.success) {
      setStatus(newStatus);
      setMessage(res.message || "Durum başarıyla güncellendi.");
      setTimeout(() => setMessage(""), 3000);
      router.refresh();
    } else {
      alert(res.message || "Bir hata oluştu");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <h2 className="font-semibold text-gray-900 mb-4">Sipariş Durumu İşlemleri</h2>
      
      {message && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 border border-green-200 rounded-md text-sm font-medium">
          {message}
        </div>
      )}

      <div className="flex flex-col gap-3">
        <button
          disabled={loading || status === "PENDING"}
          onClick={() => handleStatusChange("PENDING")}
          className={`px-4 py-2 rounded-md font-medium text-sm transition-colors text-left flex items-center justify-between ${
            status === "PENDING" 
              ? "bg-amber-100 text-amber-800 border border-amber-200" 
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          } disabled:opacity-50`}
        >
          Bekliyor
          {status === "PENDING" && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>}
        </button>
        
        <button
          disabled={loading || status === "PROCESSING"}
          onClick={() => handleStatusChange("PROCESSING")}
          className={`px-4 py-2 rounded-md font-medium text-sm transition-colors text-left flex items-center justify-between ${
            status === "PROCESSING" 
              ? "bg-blue-100 text-blue-800 border border-blue-200" 
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          } disabled:opacity-50`}
        >
          Hazırlanıyor
          {status === "PROCESSING" && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>}
        </button>
        
        <button
          disabled={loading || status === "SHIPPED"}
          onClick={() => handleStatusChange("SHIPPED")}
          className={`px-4 py-2 rounded-md font-medium text-sm transition-colors text-left flex items-center justify-between ${
            status === "SHIPPED" 
              ? "bg-green-100 text-green-800 border border-green-200" 
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          } disabled:opacity-50`}
        >
          Kargolandı
          {status === "SHIPPED" && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>}
        </button>
        
        <button
          disabled={loading || status === "COMPLETED"}
          onClick={() => handleStatusChange("COMPLETED")}
          className={`px-4 py-2 rounded-md font-medium text-sm transition-colors text-left flex items-center justify-between ${
            status === "COMPLETED" 
              ? "bg-purple-100 text-purple-800 border border-purple-200" 
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          } disabled:opacity-50`}
        >
          Tamamlandı
          {status === "COMPLETED" && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>}
        </button>
      </div>
      
      {loading && <p className="text-sm text-gray-500 mt-3 animate-pulse">İşlem yapılıyor...</p>}
    </div>
  );
}
