import prisma from "@/lib/prisma";
import { Product } from "@/data/products";

// Helper to map a Prisma product to the static Product interface
export function mapPrismaProductToStatic(dbProduct: any): Product {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    description: dbProduct.description,
    categorySlug: dbProduct.category,
    image: dbProduct.imageUrl || "/placeholder.svg",
    basePrice: dbProduct.price,
    isNew: dbProduct.isNew || false,
    isPopular: dbProduct.isPopular || false,
    variants: dbProduct.variants || undefined,
    quantityOptions: dbProduct.quantityOptions || undefined,
    options: dbProduct.options || undefined,
    allowMultipleDesigns: dbProduct.allowMultipleDesigns || false,
  };
}

export async function getAllProductsCombined(): Promise<Product[]> {
  try {
    const dbProducts = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
    return dbProducts.map(mapPrismaProductToStatic);
  } catch (error) {
    console.error("Error fetching combined products:", error);
    return [];
  }
}

export async function getProductByIdCombined(id: string): Promise<Product | null> {
  try {
    const dbProduct = await prisma.product.findUnique({
      where: { id, isActive: true },
    });
    if (dbProduct) {
      return mapPrismaProductToStatic(dbProduct);
    }
  } catch (error) {
    console.error("Error fetching product by ID:", error);
  }
  
  return null;
}
