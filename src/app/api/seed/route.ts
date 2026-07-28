import { NextResponse } from "next/server";
import { seedMockProducts } from "@/actions/product.action";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await seedMockProducts();
  return NextResponse.json(result);
}
