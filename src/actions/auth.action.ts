"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendPasswordResetEmail } from "./email.action";

export async function createInitialAdmin() {
  const existingAdmin = await prisma.user.findUnique({
    where: { email: "admin@baskiatolyesi.com" },
  });

  if (existingAdmin) {
    console.log("Admin zaten mevcut.");
    return { success: false, message: "Admin zaten mevcut." };
  }

  const hashedPassword = await bcrypt.hash("Admin123!", 10);

  await prisma.user.create({
    data: {
      email: "admin@baskiatolyesi.com",
      password: hashedPassword,
      name: "Admin",
      role: "ADMIN",
    },
  });

  console.log("Admin oluşturuldu");
  return { success: true, message: "Admin oluşturuldu." };
}

export async function forgotPassword(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Güvenlik: Kullanıcı bulunamadığında da aynı mesajı ver
      return { success: true, message: "Eğer sistemimizde kayıtlıysanız, şifre sıfırlama linki e-postanıza gönderilmiştir." };
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email }, 
      process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || "fallback_secret", 
      { expiresIn: "1h" }
    );

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const resetLink = `${baseUrl}/reset-password?token=${token}`;

    await sendPasswordResetEmail(user.email, resetLink);

    return { success: true, message: "Şifre sıfırlama linki e-postanıza gönderildi." };
  } catch (error) {
    console.error("Forgot password error:", error);
    return { success: false, message: "Beklenmeyen bir hata oluştu." };
  }
}

