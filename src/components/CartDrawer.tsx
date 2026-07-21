"use client";

import { useCartStore } from "@/store/cartStore";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartDrawer() {
  const { cart, isOpen, closeCart, removeFromCart, updateQuantity, openAuthModal } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Avoid hydration errors with persist
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    // Sepeti kapatmaya gerek yok, üstüne modal açılacak. 
    // Kullanıcı modalda "Vazgeç/Kapat" derse sepeti hala görebilir. 
    // Veya direkt openAuthModal() çağırırız.
    openAuthModal();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300" 
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Sepetim ({totalItems} Ürün)</h2>
          <button 
            onClick={closeCart}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* Content - Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4z"></path></svg>
              <div>
                <p className="text-lg font-bold text-gray-900">Sepetiniz Boş</p>
                <p className="text-sm text-gray-500">Tasarımınızı hayata geçirmek için hemen alışverişe başlayın.</p>
              </div>
              <button onClick={closeCart} className="px-6 py-2 bg-orange-500 text-white font-bold rounded-md hover:bg-orange-600 transition-colors">
                Alışverişe Devam Et
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                
                {/* Image */}
                <div className="w-20 h-20 shrink-0 border border-gray-100 rounded-md overflow-hidden bg-gray-50 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.customImage || '/placeholder.svg'} alt={item.name} className="w-full h-full object-cover" />
                  {item.customImage && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-[10px] text-white font-bold leading-tight text-center px-1">Özel<br/>Tasarım</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-gray-900 text-sm line-clamp-2">{item.name}</h3>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 p-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                    {/* Variants */}
                    <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                      {Object.entries(item.variants).map(([k, v]) => (
                        <div key={k}><span className="font-medium text-gray-700">{k}:</span> {v}</div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-gray-300 rounded-md bg-white">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-0.5 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-2 py-0.5 text-sm font-bold text-gray-900 min-w-[2rem] text-center border-x border-gray-300">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-0.5 text-gray-600 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <div className="font-black text-sky-600">
                      {item.price.toLocaleString("tr-TR")} TL
                    </div>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

        {/* Footer (Sticky) */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600 font-medium">Ara Toplam</span>
              <span className="text-2xl font-black text-gray-900">{totalAmount.toLocaleString("tr-TR")} TL</span>
            </div>
            <button 
              onClick={handleCheckout}
              className="w-full py-4 px-4 bg-sky-500 hover:bg-sky-600 text-white text-lg font-bold rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            >
              ÖDEMEYE GEÇ
            </button>
          </div>
        )}
      </div>
    </>
  );
}
