"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getUserProfile(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        phone: true,
        city: true,
        district: true,
        address: true,
      }
    });
    return { success: true, data: user };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { success: false, error: "Profil bilgileri alınamadı." };
  }
}

export async function updateProfile(userId: string, data: any) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        phone: data.phone,
        city: data.city,
        district: data.district,
        address: data.address,
      }
    });
    
    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { success: false, error: "Profil güncellenirken bir hata oluştu." };
  }
}

export async function getUserOrders(userId: string) {
  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        orderItems: true
      }
    });
    return { success: true, data: orders };
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return { success: false, error: "Siparişler alınamadı." };
  }
}
