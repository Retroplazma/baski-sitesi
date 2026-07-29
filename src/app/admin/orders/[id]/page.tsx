import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import OrderStatusUpdater from "./OrderStatusUpdater";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      orderItems: true,
    }
  });

  if (!order) {
    notFound();
  }

  const date = new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(order.createdAt));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/orders" className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sipariş Detayı</h1>
          <p className="text-gray-500 text-sm mt-1">{order.orderNumber} - {date}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Sipariş Kalemleri</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {order.orderItems.map((item) => (
                <div key={item.id} className="p-5 flex gap-4 items-start">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg border border-gray-200 flex-shrink-0 flex items-center justify-center overflow-hidden relative">
                    {item.customImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.customImage} alt={item.productName} className="object-cover w-full h-full" />
                    ) : (
                      <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.productName}</h3>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {Object.entries(item.variants as any || {}).map(([k, v]) => (
                        <span key={k} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          {k}: {v as string}
                        </span>
                      ))}
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      Adet: {item.quantity} x {item.price.toLocaleString("tr-TR")} TL
                    </div>
                  </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="font-bold text-gray-900">
                        {(item.price).toLocaleString("tr-TR")} TL
                      </span>
                      
                      {/* Tek resim için geriye dönük uyumluluk veya customImages boş ise */}
                      {item.customImage && (!item.customImages || item.customImages.length === 0) && item.customImage !== "https://via.placeholder.com/800x800.png?text=Musteri+Tasarimi" && (
                        <a 
                          href={item.customImage} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          download
                          className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 text-sky-600 hover:bg-sky-100 hover:text-sky-700 rounded-md text-xs font-semibold transition-colors border border-sky-200"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                          Tasarımı İndir
                        </a>
                      )}

                      {/* Çoklu resimler için */}
                      {item.customImages && item.customImages.length > 0 && (
                        <div className="flex flex-col gap-2 mt-2">
                          {item.customImages.map((imgUrl: string, idx: number) => (
                            <a 
                              key={idx}
                              href={imgUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              download
                              className="inline-flex items-center justify-end gap-1.5 px-3 py-1.5 bg-sky-50 text-sky-600 hover:bg-sky-100 hover:text-sky-700 rounded-md text-xs font-semibold transition-colors border border-sky-200"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                              Tasarım {idx + 1} İndir
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
              ))}
            </div>
            <div className="bg-gray-50 p-5 flex justify-between items-center border-t border-gray-200">
              <span className="font-medium text-gray-700">Toplam Tutar:</span>
              <span className="text-xl font-bold text-gray-900">{order.totalAmount.toLocaleString("tr-TR")} TL</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Müşteri Bilgileri</h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-500 block text-xs">Ad Soyad</span>
                <span className="font-medium text-gray-900">{order.firstName} {order.lastName}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-xs">E-posta</span>
                <a href={`mailto:${order.email}`} className="font-medium text-blue-600 hover:underline">{order.email}</a>
              </div>
              <div>
                <span className="text-gray-500 block text-xs">Telefon</span>
                <a href={`tel:${order.phone}`} className="font-medium text-blue-600 hover:underline">{order.phone}</a>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Teslimat Adresi</h2>
            <div className="text-sm text-gray-700 space-y-1">
              <p>{order.address}</p>
              <p>{order.neighborhood}</p>
              <p className="font-medium">{order.district} / {order.city}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
