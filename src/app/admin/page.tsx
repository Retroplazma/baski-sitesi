import prisma from "@/lib/prisma";
import OrderActionNode from "./OrderActionNode";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
      user: true,
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-bold text-gray-900">Sipariş Yönetimi (Admin)</h1>
            <p className="mt-2 text-sm text-gray-700">
              Sistemdeki tüm siparişlerin güncel durumları, müşteri ve kargo bilgilerini bu panelden yönetebilirsiniz.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-xl bg-white border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th scope="col" className="py-4 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Sipariş ID & Tarih
                      </th>
                      <th scope="col" className="px-3 py-4 text-left text-sm font-semibold text-gray-900">
                        Müşteri
                      </th>
                      <th scope="col" className="px-3 py-4 text-left text-sm font-semibold text-gray-900 w-1/3">
                        Ürün & Adres
                      </th>
                      <th scope="col" className="px-3 py-4 text-left text-sm font-semibold text-gray-900">
                        Durum
                      </th>
                      <th scope="col" className="relative py-4 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">İşlem</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-12 text-center">
                          <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                          </svg>
                          <p className="text-gray-500 text-base font-medium">Henüz sipariş bulunmuyor.</p>
                        </td>
                      </tr>
                    )}
                    {orders.map((order: any) => {
                      const customerName = order.user?.name || order.guestName || "İsimsiz Müşteri";
                      const customerEmail = order.user?.email || order.guestEmail || "E-posta yok";

                      return (
                        <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                          <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-6 align-top">
                            <div className="font-semibold text-indigo-600">#{order.id.slice(-6).toUpperCase()}</div>
                            <div className="text-gray-600 mt-1">{new Date(order.createdAt).toLocaleDateString("tr-TR")}</div>
                            <div className="text-gray-400 text-xs">{new Date(order.createdAt).toLocaleTimeString("tr-TR")}</div>
                          </td>
                          <td className="px-3 py-5 text-sm text-gray-500 align-top">
                            <div className="font-medium text-gray-900">{customerName}</div>
                            <div className="text-gray-500">{customerEmail}</div>
                          </td>
                          <td className="px-3 py-5 text-sm text-gray-500 align-top">
                            <ul className="list-disc pl-4 mb-3 text-gray-800 space-y-1 font-medium">
                              {order.orderItems.map((item: any) => (
                                <li key={item.id}>
                                  {item.quantity}x {item.product.name}
                                </li>
                              ))}
                            </ul>
                            <div className="text-xs text-gray-600 mt-2 p-3 bg-gray-50 rounded-lg border border-gray-100 leading-relaxed">
                              <span className="font-semibold text-gray-900 block mb-1 flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Teslimat Adresi:
                              </span>
                              {order.shippingAddress}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-5 text-sm align-top">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-sm ${order.paymentStatus === "COMPLETED"
                                  ? "bg-green-100 text-green-800 border border-green-200"
                                  : order.paymentStatus === "FAILED"
                                    ? "bg-red-100 text-red-800 border border-red-200"
                                    : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                }`}
                            >
                              {order.paymentStatus === "COMPLETED" && (
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                              )}
                              {order.paymentStatus === "COMPLETED"
                                ? "Ödendi"
                                : order.paymentStatus === "FAILED"
                                  ? "Başarısız"
                                  : "Bekliyor"}
                            </span>
                          </td>
                          <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 align-top">
                            <OrderActionNode
                              orderId={order.id}
                              paymentStatus={order.paymentStatus}
                              trackingCode={order.trackingCode}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
