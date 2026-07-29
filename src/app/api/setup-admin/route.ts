import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
  try {
    const passwordHash = await bcrypt.hash("Admin123!", 10);
    
    const adminUser = await prisma.user.upsert({
      where: { email: "admin@baskiatolyesi.com" },
      update: {
        password: passwordHash,
        role: "ADMIN"
      },
      create: {
        email: "admin@baskiatolyesi.com",
        password: passwordHash,
        name: "Yönetici",
        role: "ADMIN"
      }
    });

    return NextResponse.json({ success: true, message: "Admin kullanıcısı başarıyla oluşturuldu/güncellendi.", user: { email: adminUser.email, role: adminUser.role } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
