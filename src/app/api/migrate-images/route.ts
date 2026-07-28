import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { supabase } from "@/lib/supabaseClient";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Sadece lokal mockups klasöründen çekilen ürünleri bul
    const products = await prisma.product.findMany({
      where: {
        imageUrl: {
          startsWith: "/mockups/",
        },
      },
    });

    if (products.length === 0) {
      return NextResponse.json({ success: true, message: "Taşınacak görsel bulunamadı (Zaten taşınmış veya yok)." });
    }

    const results = [];
    let successCount = 0;
    let errorCount = 0;

    for (const product of products) {
      try {
        const localPath = path.join(process.cwd(), "public", product.imageUrl);
        
        if (!fs.existsSync(localPath)) {
          results.push({ id: product.id, status: "error", error: "Local file not found: " + localPath });
          errorCount++;
          continue;
        }

        const fileBuffer = fs.readFileSync(localPath);
        const fileName = path.basename(localPath);
        
        // Rastgele bir isim oluştur (aynı isimli dosyalar çakışmasın)
        const uniqueFileName = `${Date.now()}-${fileName}`;
        
        // Supabase "products" bucket'ına yükle
        const { data, error } = await supabase.storage
          .from("products")
          .upload(uniqueFileName, fileBuffer, {
            contentType: getContentType(fileName),
            upsert: false,
          });

        if (error) {
          throw new Error("Supabase Upload Error: " + error.message);
        }

        // Public URL al
        const { data: publicUrlData } = supabase.storage
          .from("products")
          .getPublicUrl(uniqueFileName);
          
        const publicUrl = publicUrlData.publicUrl;

        // Prisma Veritabanını Güncelle
        await prisma.product.update({
          where: { id: product.id },
          data: { imageUrl: publicUrl },
        });

        results.push({ id: product.id, status: "success", oldUrl: product.imageUrl, newUrl: publicUrl });
        successCount++;
        
      } catch (err: any) {
        results.push({ id: product.id, status: "error", error: err.message });
        errorCount++;
      }
    }

    return NextResponse.json({
      success: true,
      totalProcessed: products.length,
      successCount,
      errorCount,
      details: results,
    });
    
  } catch (error: any) {
    console.error("Migration error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

function getContentType(fileName: string) {
  const ext = path.extname(fileName).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  if (ext === ".svg") return "image/svg+xml";
  return "application/octet-stream";
}
