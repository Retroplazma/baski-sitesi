"use server";

import jwt from "jsonwebtoken";

export async function createOrganicCheckoutToken(productId: string, customImageUrl: string) {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }

    const payload = {
      source: 'organic',
      productId,
      customImageUrl,
      quantity: 1
    };

    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    return { success: true, token };
  } catch (error) {
    console.error("Token oluşturulurken hata:", error);
    return { success: false, error: "Token oluşturulamadı." };
  }
}
