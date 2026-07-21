"use server";

import prisma from "@/lib/prisma";
import { verifyCheckoutToken } from "@/lib/jwt";

export async function createOrder(formData: FormData, token: string) {
  try {
    // 1. Verilen token'ı doğrula
    const payload = verifyCheckoutToken(token);
    
    if (!payload) {
      throw new Error("Geçersiz veya süresi dolmuş token.");
    }

    // 2. FormData'dan verileri al
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const shippingAddress = formData.get("shippingAddress") as string;
    const billingAddress = formData.get("billingAddress") as string;
    
    const guestName = `${firstName} ${lastName}`.trim();

    // 3. Veritabanından ilgili ürünü bul ve fiyatını öğren
    const product = await prisma.product.findUnique({
      where: { id: payload.productId },
    });

    if (!product) {
      throw new Error("Sipariş verilmek istenen ürün bulunamadı.");
    }

    // 4. Prisma nested create ile Order ve OrderItem oluştur
    const order = await prisma.order.create({
      data: {
        guestName,
        guestEmail: email,
        shippingAddress,
        billingAddress,
        orderItems: {
          create: [
            {
              productId: product.id,
              customImageUrl: payload.customImageUrl,
              quantity: payload.quantity,
              price: product.price, // Gerçek fiyat DB'den alınıyor
            },
          ],
        },
      },
    });

    return { success: true, orderId: order.id };
  } catch (error: any) {
    console.error("Sipariş oluşturulurken hata:", error);
    return { success: false, error: error.message || "Bilinmeyen bir hata oluştu." };
  }
}
