import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [totalOrders, totalRevenueData, pendingOrders] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: {
        totalAmount: true
      }
    }),
    prisma.order.count({
      where: { status: "PENDING" }
    })
  ]);

  const totalRevenue = totalRevenueData._sum.totalAmount || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Özeti</h1>
        <p className="text-gray-500 text-sm mt-1">Sisteminizdeki güncel veriler ve istatistikler.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center transition-shadow hover:shadow-md">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mr-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Toplam Sipariş</p>
            <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center transition-shadow hover:shadow-md">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mr-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Toplam Ciro</p>
            <p className="text-2xl font-bold text-gray-900">{totalRevenue.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center transition-shadow hover:shadow-md">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center mr-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Bekleyen Sipariş</p>
            <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
