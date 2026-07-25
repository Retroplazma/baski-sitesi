"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Ad Soyad en az 2 karakter olmalıdır"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
});

export async function registerUser(formData: z.infer<typeof registerSchema>) {
  try {
    // 1. Validate data
    const validatedData = registerSchema.safeParse(formData);
    
    if (!validatedData.success) {
      return { 
        success: false, 
        error: "Geçersiz form verisi", 
        details: validatedData.error.flatten().fieldErrors 
      };
    }

    const { name, email, password } = validatedData.data;

    // 2. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, error: "Bu e-posta zaten kayıtlı" };
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create user
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER",
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Register Error:", error);
    return { success: false, error: "Kayıt işlemi sırasında bir hata oluştu" };
  }
}
