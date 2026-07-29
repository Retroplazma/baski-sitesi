"use client";

import { MessageCircle } from "lucide-react";
import { useState } from "react";

export default function WhatsAppButton() {
  const [isHovered, setIsHovered] = useState(false);
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "905555555555";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=Merhaba,%20Baskı%20Atölyesi%20ürünleri%20hakkında%20bilgi%20almak%20istiyorum.`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center justify-end">
      {isHovered && (
        <div className="absolute right-16 bg-white text-gray-800 px-4 py-2 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap opacity-100 transition-opacity duration-300">
          Canlı Destek
        </div>
      )}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#1ebd59] transition-all duration-300 animate-bounce hover:animate-none hover:scale-110"
        aria-label="WhatsApp Canlı Destek"
      >
        <MessageCircle className="w-8 h-8" />
      </a>
    </div>
  );
}
