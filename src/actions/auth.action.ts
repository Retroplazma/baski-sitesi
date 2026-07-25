"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

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
