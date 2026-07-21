import prisma from "@/lib/prisma";
import PaymentSimulation from "./PaymentSimulation";

export default async function PaymentPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center bg-white p-10 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sipariş Bulunamadı</h1>
          <p className="text-gray-600">Aradığınız sipariş sistemde kayıtlı değil veya silinmiş.</p>
        </div>
      </div>
    );
  }

  if (order.paymentStatus === "COMPLETED") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-green-100 text-center">
          <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-green-800 mb-2">Ödeme Alınmış</h2>
          <p className="text-green-600">Bu siparişin ödemesi zaten alınmış ve onaylanmış.</p>
        </div>
      </div>
    );
  }

  const totalAmount = order.orderItems.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Güvenli Ödeme</h1>
          <p className="mt-2 text-gray-500">Siparişinizi tamamlamak için ödeme adımını simüle edin.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Sipariş Özeti */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-4">Sipariş Özeti</h2>

            <div className="space-y-5">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Alıcı Bilgileri</h3>
                <p className="text-gray-900 font-medium">{order.guestName || "Kayıtlı Kullanıcı"}</p>
                <p className="text-gray-500 text-sm">{order.guestEmail}</p>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Teslimat Adresi</h3>
                <p className="text-gray-800 text-sm leading-relaxed">{order.shippingAddress}</p>
              </div>
            </div>

            <div className="border-t pt-5">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Sipariş Edilen Ürünler</h3>
              <ul className="space-y-4">
                {order.orderItems.map((item: any) => (
                  <li key={item.id} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700 font-medium flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-500">{item.quantity}x</span>
                      {item.product.name}
                    </span>
                    <span className="font-semibold text-gray-900">
                      {(item.price * item.quantity).toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t pt-5 flex justify-between items-center mt-2">
              <span className="text-gray-600 font-medium">Toplam Tutar</span>
              <span className="text-2xl font-bold text-blue-600">
                {totalAmount.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
              </span>
            </div>
          </div>

          {/* Ödeme Kartı Simülasyonu */}
          <PaymentSimulation orderId={orderId} />
        </div>
      </div>
    </div>
  );
}
