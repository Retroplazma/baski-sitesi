"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function createOrder(customerData: any, cartItems: any[], totalAmount: number) {
  try {
    const session = await getServerSession();
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

    return { success: true, orderId: order.id, orderNumber: order.orderNumber };
  } catch (error: any) {
    console.error("Order creation error:", error);
    return { success: false, error: error.message || String(error) };
  }
}
