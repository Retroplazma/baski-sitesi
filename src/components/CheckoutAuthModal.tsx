"use client";

import { useCartStore } from "@/store/cartStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CheckoutAuthModal() {
  const { isAuthModalOpen, closeAuthModal, closeCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isAuthModalOpen) return null;

  const handleGuestCheckout = () => {
    closeAuthModal();
    closeCart();
    router.push("/checkout");
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Giriş yapıldı");
    closeAuthModal();
    closeCart();
    router.push("/checkout");
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80] transition-opacity duration-300" 
        onClick={closeAuthModal}
      />
      <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
        <div className="max-w-4xl w-full bg-white rounded-xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200">
          
          <button 
            onClick={closeAuthModal}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors z-10 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          <div className="grid md:grid-cols-2">
            
            {/* SOL KOLON - Üye Girişi */}
            <div className="p-8 md:p-12">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Üye Girişi</h2>
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-Posta Adresi</label>
                  <input 
                    type="email" 
                    required 
                    className="w-full border border-gray-300 rounded-md py-3 px-4 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                    placeholder="ornek@eposta.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
                  <input 
                    type="password" 
                    required 
                    className="w-full border border-gray-300 rounded-md py-3 px-4 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                    placeholder="••••••••"
                  />
                </div>
                <div className="flex justify-end">
                  <a href="#" className="text-sm font-medium text-sky-600 hover:text-sky-500 hover:underline">Şifremi Unuttum</a>
                </div>
                <button 
                  type="submit" 
                  className="w-full py-4 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-md shadow-sm transition-colors text-lg"
                >
                  Giriş Yap
                </button>
              </form>
              <div className="mt-6 text-center">
                <span className="text-gray-600">Henüz üye değil misiniz?</span>{' '}
                <a href="#" className="text-sky-600 font-bold hover:underline">Kayıt Ol</a>
              </div>
            </div>

            {/* SAĞ KOLON - Üye Olmadan Devam Et */}
            <div className="p-8 md:p-12 bg-gray-50 border-t md:border-t-0 md:border-l border-gray-200 flex flex-col justify-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Üye Olmadan Devam Et</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Siparişinizi üye olmadan hızlıca tamamlayabilir, kargo takibini size göndereceğimiz e-posta üzerinden yapabilirsiniz. Hızlı ve pratik bir alışveriş için hemen devam edin.
              </p>
              
              <button 
                onClick={handleGuestCheckout}
                className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-md shadow-lg transition-all transform hover:-translate-y-1 text-lg flex justify-center items-center gap-2"
              >
                Üye Olmadan Devam Et
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
              
              <div className="mt-8 flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                <p className="text-xs text-gray-500">256-Bit SSL ile güvenli alışveriş. Kredi kartı bilgileriniz sistemimizde saklanmaz.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
