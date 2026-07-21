import jwt from "jsonwebtoken";

export interface CheckoutPayload {
  source: string;
  productId: string;
  customImageUrl: string;
  quantity: number;
}

export function verifyCheckoutToken(token: string): CheckoutPayload | null {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET is not defined");
      return null;
    }

    const decoded = jwt.verify(token, secret) as CheckoutPayload;
    return decoded;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
