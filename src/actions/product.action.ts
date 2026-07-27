"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAdminProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: products };
  } catch (error) {
    console.error("getAdminProducts error:", error);
    return { success: false, error: "Ürünler getirilemedi." };
  }
}

export async function createProduct(data: {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  isCustomizable: boolean;
  isActive: boolean;
}) {
  try {
    const product = await prisma.product.create({
      data,
    });

    revalidatePath("/admin/products");
    revalidatePath("/");
    return { success: true, data: product };
  } catch (error) {
    console.error("createProduct error:", error);
    return { success: false, error: "Ürün oluşturulamadı." };
  }
}

export async function updateProduct(id: string, data: {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  isCustomizable: boolean;
  isActive: boolean;
}) {
  try {
    const product = await prisma.product.update({
      where: { id },
      data,
    });

    revalidatePath("/admin/products");
    revalidatePath("/");
    return { success: true, data: product };
  } catch (error) {
    console.error("updateProduct error:", error);
    return { success: false, error: "Ürün güncellenemedi." };
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/admin/products");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("deleteProduct error:", error);
    return { success: false, error: "Ürün silinemedi." };
  }
}
