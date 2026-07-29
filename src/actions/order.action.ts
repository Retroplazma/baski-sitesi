"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendOrderConfirmationEmail, sendOrderShippedEmail } from "@/actions/email.action";
import { revalidatePath } from "next/cache";

export async function createOrder(customerData: any, cartItems: any[], totalAmount: number) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        firstName: customerData.firstName,
        lastName: customerData.lastName,
        email: customerData.email,
        phone: customerData.phone,
        city: customerData.city,
        district: customerData.district,
        neighborhood: customerData.neighborhood,
        address: customerData.address,
        totalAmount,
        status: "PENDING",
        ...(userId ? { userId } : {}),
        orderItems: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            productName: item.name,
            price: item.price,
            quantity: item.quantity,
            variants: item.variants || {},
            customImage: item.customImage || null,
          }))
        }
      }
    });

    // Arka planda mail gönder (await kullanmadan)
    sendOrderConfirmationEmail(
      customerData.email,
      orderNumber,
      totalAmount,
      customerData.firstName
    ).catch(e => console.error("Mail gönderme hatası:", e));

    return { success: true, orderId: order.id, orderNumber: order.orderNumber };
  } catch (error: any) {
    console.error("Order creation error:", error);
    return { success: false, error: error.message || String(error) };
  }
}

export async function updateOrderStatus(orderId: string, newStatus: string) {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus }
    });

    if (newStatus === "SHIPPED") {
      sendOrderShippedEmail(order.email, order.orderNumber, order.firstName)
        .catch(e => console.error("Kargo maili gönderme hatası:", e));
    }

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);

    return { success: true, message: "Sipariş durumu güncellendi" };
  } catch (error: any) {
    console.error("Update order status error:", error);
    return { success: false, message: error.message || String(error) };
  }
}

