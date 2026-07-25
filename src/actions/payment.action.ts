"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import iyzipay from "@/lib/iyzipay";

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

type CheckoutResponse = {
  success: boolean;
  paymentPageUrl?: string;
  message?: string;
  error?: string;
};

export async function initializeCheckout(formData: any): Promise<CheckoutResponse> {
  console.log("--- IYZICO CHECKOUT INITIALIZATION (SIMULATION) ---");
  console.log("Customer Details:", formData.customer);
  console.log("Cart Items Count:", formData.cartItems?.length);
  console.log("Total Price:", formData.totalPrice);
  console.log("---------------------------------------------------");
  
  // Here we would normally map formData to Iyzico request format:
  // iyzipay.checkoutFormInitialize.create(request, function (err, result) { ... })
  
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      resolve({
        success: true,
        paymentPageUrl: "/payment-success-simulation",
        message: "Payment form initialization successful (simulated)"
      });
    }, 1500);
  });
}
