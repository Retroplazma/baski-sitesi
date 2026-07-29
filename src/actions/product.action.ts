"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { PRODUCTS } from "@/data/products";

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
  galleryImages?: string[];
  isCustomizable: boolean;
  isActive: boolean;
  isPopular?: boolean;
  isNew?: boolean;
}) {
  try {
    const product = await prisma.product.create({
      data: {
        ...data,
        galleryImages: data.galleryImages || [],
        isPopular: data.isPopular || false,
        isNew: data.isNew || false,
      },
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
  galleryImages?: string[];
  isCustomizable: boolean;
  isActive: boolean;
  isPopular?: boolean;
  isNew?: boolean;
}) {
  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        galleryImages: data.galleryImages || [],
        isPopular: data.isPopular || false,
        isNew: data.isNew || false,
      },
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

export async function seedMockProducts() {
  try {
    // Tüm mevcut ürünleri sil (sıfırdan başlat)
    await prisma.product.deleteMany();

    let createdCount = 0;
    for (const p of PRODUCTS) {
      await prisma.product.create({
        data: {
          name: p.name,
          description: p.description,
          price: p.basePrice || 0,
          category: p.categorySlug,
          imageUrl: p.image,
          galleryImages: [],
          isCustomizable: true,
          isActive: true,
          isPopular: p.isPopular || false,
          isNew: p.isNew || false,
          variants: p.variants ? JSON.parse(JSON.stringify(p.variants)) : null,
          quantityOptions: p.quantityOptions ? JSON.parse(JSON.stringify(p.quantityOptions)) : null,
        }
      });
      createdCount++;
    }
    
    revalidatePath("/");
    return { success: true, count: createdCount };
  } catch (error) {
    console.error("seedMockProducts error:", error);
    return { success: false, error: "Mock veriler eklenemedi." };
  }
}

export async function searchProducts(query: string) {
  if (!query) return [];
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { category: { contains: query, mode: "insensitive" } }
        ]
      },
      orderBy: { createdAt: "desc" }
    });
    return products;
  } catch (error) {
    console.error("searchProducts error:", error);
    return [];
  }
}
