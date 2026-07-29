"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getUserOrders } from "@/actions/profile.action";
import Link from "next/link";

export default function OrdersPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    async function loadOrders() {
      if (session?.user?.id) {
        const res = await getUserOrders(session.user.id);
        if (res.success && res.data) {
          setOrders(res.data);
        }
      }
      setLoading(false);
    }
    loadOrders();
  }, [session]);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Siparişler yükleniyor...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Siparişlerim</h2>
      
      {orders.length === 0 ? (
        <div className="text-center py-10">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
          <p className="text-gray-500 mb-4">Henüz hiç siparişiniz bulunmuyor.</p>
          <Link href="/" className="inline-block px-6 py-2 bg-sky-500 text-white font-medium rounded-md hover:bg-sky-600 transition-colors">
            Alışverişe Başla
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border border-gray-200 rounded-lg overflow-hidden flex flex-col">
              {/* Order Header */}
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Sipariş Tarihi</p>
                  <p className="font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString('tr-TR')}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Sipariş No</p>
                  <p className="font-medium text-gray-900">{order.orderNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Tutar</p>
                  <p className="font-bold text-sky-600">{order.totalAmount.toLocaleString('tr-TR')} TL</p>
                </div>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                    ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                      order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                      'bg-gray-100 text-gray-800'}`}
                  >
                    {order.status === 'PENDING' ? 'Hazırlanıyor' : 
                     order.status === 'SHIPPED' ? 'Kargolandı' :
                     order.status === 'COMPLETED' ? 'Tamamlandı' : order.status}
                  </span>
                </div>
              </div>
              
              {/* Order Items */}
              <div className="p-4 bg-white divide-y divide-gray-100">
                {order.orderItems?.map((item: any) => (
                  <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center gap-4">
                    <div className="flex gap-2">
                      {item.customImages && item.customImages.length > 0 ? (
                        item.customImages.map((img: string, idx: number) => (
                          <div key={idx} className="w-16 h-16 bg-gray-100 rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img || '/placeholder.svg'} alt={`${item.productName} - ${idx}`} className="w-full h-full object-contain" />
                          </div>
                        ))
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.customImage || '/placeholder.svg'} alt={item.productName} className="w-full h-full object-contain" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{item.productName}</h4>
                      <p className="text-xs text-gray-500 mt-1">Adet: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-bold text-gray-900">
                      {item.price.toLocaleString('tr-TR')} TL
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
