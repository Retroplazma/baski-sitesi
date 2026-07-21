"use client";

import { useCartStore } from "@/store/cartStore";
import { useEffect, useState } from "react";

export default function HeaderCartButton() {
  const { cart, openCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = mounted ? cart.reduce((sum, item) => sum + item.quantity, 0) : 0;

  return (
    <button 
      onClick={openCart} 
      className="flex flex-col items-center text-gray-600 hover:text-orange-500 transition-colors focus:outline-none relative group"
    >
      <div className="relative">
        <svg className="w-6 h-6 mb-1 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4z" /></svg>
        {mounted && totalItems > 0 && (
          <span className="absolute -top-1 -right-2 bg-orange-500 text-white text-[10px] font-bold min-w-[16px] h-4 flex items-center justify-center rounded-full px-1 shadow-sm">
            {totalItems > 99 ? '99+' : totalItems}
          </span>
        )}
      </div>
      <span className="text-xs font-medium">Sepetim</span>
    </button>
  );
}
