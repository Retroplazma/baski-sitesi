"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function processPayment(orderId: string) {
  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: "COMPLETED" },
    });

    revalidatePath(`/payment/${orderId}`);
    return { success: true, order: updatedOrder };
  } catch (error) {
    console.error("Payment processing error:", error);
    return { success: false, error: "Ödeme işlemi sırasında bir hata oluştu." };
  }
}
