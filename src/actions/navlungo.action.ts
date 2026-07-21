"use server";

import prisma from "@/lib/prisma";

export async function createNavlungoShipment(orderId: string) {
  try {
    // 1. Siparişi veritabanından alıyoruz
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return { success: false, error: "Sipariş bulunamadı" };
    }

    if (order.trackingCode) {
      return { success: false, error: "Bu sipariş için zaten kargo kodu oluşturulmuş." };
    }

    // 2. Navlungo API simülasyonu (1.5 saniye gecikme)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // 3. Rastgele kargo takip numarası ve sevkiyat ID'si üret
    const randomSuffix = Math.floor(100000 + Math.random() * 900000).toString(); // 6 haneli sayı
    const mockTrackingCode = `NVL-${randomSuffix}`;
    const mockShipmentId = `SHIP-${Date.now()}`;

    // 4. Veritabanını güncelle
    await prisma.order.update({
      where: { id: orderId },
      data: {
        navlungoShipmentId: mockShipmentId,
        trackingCode: mockTrackingCode,
      },
    });

    return { success: true, trackingCode: mockTrackingCode };
  } catch (error) {
    console.error("Kargo barkodu oluşturulurken hata oluştu:", error);
    return { success: false, error: "Sunucu hatası oluştu." };
  }
}
