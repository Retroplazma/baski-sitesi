"use server";

import prisma from "@/lib/prisma";

export async function getPnpPricing() {
  try {
    const cardPricing = await prisma.pnpPricing.findUnique({ where: { productType: 'CARD' } });
    const stickerPricing = await prisma.pnpPricing.findUnique({ where: { productType: 'STICKER' } });

    return {
      success: true,
      data: {
        card: cardPricing || { basePrice: 100, glossyMatteExtra: 20, cellophaneExtra: 20 },
        sticker: stickerPricing || { basePrice: 100, glossyMatteExtra: 20, cellophaneExtra: 20 }
      }
    };
  } catch (error) {
    console.error("Error fetching PnP pricing:", error);
    return { success: false, error: "Fiyatlar getirilemedi." };
  }
}

export async function updatePnpPricing(type: 'CARD' | 'STICKER', data: { basePrice: number, glossyMatteExtra: number, cellophaneExtra: number }) {
  try {
    const updated = await prisma.pnpPricing.upsert({
      where: { productType: type },
      update: data,
      create: { productType: type, ...data }
    });
    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating PnP pricing:", error);
    return { success: false, error: "Fiyatlar güncellenemedi." };
  }
}

export async function createQuoteRequest(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  wantsBox: boolean;
  fileUrls: string[];
}) {
  try {
    const orderNumber = `QUOTE-${Date.now().toString().slice(-6)}`;
    const order = await prisma.order.create({
      data: {
        orderNumber,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        city: '-',
        district: '-',
        neighborhood: '-',
        address: '-',
        totalAmount: 0,
        isQuoteRequest: true,
        pnpDetails: {
          message: data.message,
          wantsBox: data.wantsBox,
          fileUrls: data.fileUrls
        }
      }
    });

    return { success: true, orderId: order.id, orderNumber: order.orderNumber };
  } catch (error) {
    console.error("Error creating quote request:", error);
    return { success: false, error: "Teklif talebi oluşturulamadı." };
  }
}
