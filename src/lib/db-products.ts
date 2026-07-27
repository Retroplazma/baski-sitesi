import prisma from "@/lib/prisma";
import { PRODUCTS, Product } from "@/data/products";

// Helper to map a Prisma product to the static Product interface
export function mapPrismaProductToStatic(dbProduct: any): Product {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    description: dbProduct.description,
    categorySlug: dbProduct.category,
    image: dbProduct.imageUrl || "/placeholder.svg",
    basePrice: dbProduct.price,
    isNew: true, // we can consider DB products as new
  };
}

export async function getAllProductsCombined(): Promise<Product[]> {
  try {
    const dbProducts = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
    const mapped = dbProducts.map(mapPrismaProductToStatic);
    return [...mapped, ...PRODUCTS];
  } catch (error) {
    console.error("Error fetching combined products:", error);
    return PRODUCTS;
  }
}

export async function getProductByIdCombined(id: string): Promise<Product | null> {
  const staticProduct = PRODUCTS.find((p) => p.id === id);
  if (staticProduct) return staticProduct;

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
