"use client";

import { useState } from "react";
import { updateOrderStatus, sendToUserForApproval, rejectDesign } from "@/actions/order.action";

type Props = {
  order: {
    id: string;
    designStatus: string;
    adminDesignNotes: string | null;
    userApprovedAt: Date | null;
  };
};

export default function DesignApprovalManager({ order }: Props) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [adminNotes, setAdminNotes] = useState(order.adminDesignNotes || "");

  const handleSendApproval = async () => {
    if (!adminNotes) {
      if (!confirm("Tasarım notu girmediniz. Yine de onaya göndermek istiyor musunuz?")) return;
    }
    setIsUpdating(true);
    const res = await sendToUserForApproval(order.id, adminNotes);
    if (!res.success) {
      alert(res.message);
    } else {
      alert("Müşteriye onay talebi başarıyla gönderildi.");
    }
    setIsUpdating(false);
  };

  const handleReject = async () => {
    if (!adminNotes) {
      alert("Lütfen reddetme sebebini not olarak giriniz.");
      return;
    }
    if (!confirm("Tasarımı reddedip iptal sürecini başlatmak istediğinize emin misiniz?")) return;
    
    setIsUpdating(true);
    const res = await rejectDesign(order.id, adminNotes);
    if (!res.success) {
      alert(res.message);
    } else {
      alert("Tasarım reddedildi ve müşteri bilgilendirildi.");
    }
    setIsUpdating(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-8">
      <div className="bg-slate-900 px-6 py-4 flex items-center justify-between border-b border-gray-200">
        <h2 className="text-lg font-bold text-white">Tasarım Onay Yönetimi</h2>
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
          ${order.designStatus === 'APPROVED' ? 'bg-green-100 text-green-800' :
            order.designStatus === 'WAITING_USER_APPROVAL' ? 'bg-yellow-100 text-yellow-800' :
            order.designStatus === 'REJECTED' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }
        `}>
          {order.designStatus === 'APPROVED' ? 'MÜŞTERİ ONAYLADI' :
           order.designStatus === 'WAITING_USER_APPROVAL' ? 'MÜŞTERİ ONAYI BEKLENİYOR' :
           order.designStatus === 'REJECTED' ? 'REDDEDİLDİ' : 'BEKLEMEDE'}
        </span>
      </div>
      
      <div className="p-6">
        {order.designStatus === 'APPROVED' ? (
          <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg flex items-start gap-3">
            <svg className="w-6 h-6 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            <div>
              <h3 className="font-bold mb-1">Müşteri tasarımı ve uyarıları onayladı! Baskıya Hazır.</h3>
              {order.userApprovedAt && (
                <p className="text-sm">Onay Tarihi: {new Date(order.userApprovedAt).toLocaleString('tr-TR')}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Açıklama / Uyarılar (Müşteriye İletilecek)</label>
              <textarea 
                rows={4}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                placeholder="Örn: Tasarımın sol alt köşesindeki yazı kesim payına çok yakın, baskıda kayıplar olabilir..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                disabled={isUpdating || order.designStatus === 'REJECTED'}
              />
            </div>
            
            {order.designStatus !== 'REJECTED' && (
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={handleSendApproval}
                  disabled={isUpdating}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-colors disabled:opacity-50"
                >
                  Müşteri Onayına Sun
                </button>
                <button 
                  onClick={handleReject}
                  disabled={isUpdating}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-colors disabled:opacity-50"
                >
                  Tasarımı Reddet / İptal Et
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
