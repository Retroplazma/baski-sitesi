"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCartStore } from "@/store/cartStore";
import { initializeCheckout } from "@/actions/payment.action";
import { createOrder } from "@/actions/order.action";
import { PRODUCTS } from "@/data/products";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getUserProfile } from "@/actions/profile.action";
import { useEffect } from "react";

const checkoutSchema = z.object({
  firstName: z.string().min(2, "Ad en az 2 karakter olmalıdır"),
  lastName: z.string().min(2, "Soyad en az 2 karakter olmalıdır"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  phone: z.string().min(10, "Geçerli bir telefon numarası giriniz"),
  city: z.string().min(2, "İl zorunludur"),
  district: z.string().min(2, "İlçe zorunludur"),
  neighborhood: z.string().min(2, "Mahalle zorunludur"),
  address: z.string().min(10, "Açık adres detaylı olmalıdır"),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const cart = useCartStore(state => state.cart) || [];
  const clearCart = useCartStore(state => state.clearCart);
  const totalPrice = cart.reduce((acc, item) => acc + item.price, 0);
  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const router = useRouter();
  const { data: session } = useSession();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema)
  });

  useEffect(() => {
    async function loadUserData() {
      if (session?.user?.id) {
        const res = await getUserProfile(session.user.id);
        if (res.success && res.data) {
          const { name, email, phone, city, district, address } = res.data;
          
          let firstName = "";
          let lastName = "";
          if (name) {
            const parts = name.trim().split(" ");
            lastName = parts.length > 1 ? parts.pop() || "" : "";
            firstName = parts.join(" ");
          }

          reset({
            firstName: firstName || "",
            lastName: lastName || "",
            email: email || session.user.email || "",
            phone: phone || "",
            city: city || "",
            district: district || "",
            neighborhood: "", // Profilde mahalle tutmuyoruz
            address: address || ""
          });
        }
      }
    }
    loadUserData();
  }, [session, reset]);

  const onSubmit = async (data: CheckoutFormValues) => {
    setLoading(true);
    try {
      // 1. Siparişi Veritabanına Kaydet
      const orderRes = await createOrder(data, cart, totalPrice);
      
      if (!orderRes.success) {
        throw new Error(orderRes.error || "Sipariş veritabanına kaydedilemedi.");
      }

      // 2. İyzico Ödeme Başlat (Simülasyon)
      const response = await initializeCheckout({
        customer: data,
        cartItems: cart,
        totalPrice: totalPrice
      });
      console.log("Checkout Response:", response);
      
      if (response.success && response.paymentPageUrl) {
        // Normalde kullanıcı burada iyzico sayfasına yönlendirilir: window.location.href = response.paymentPageUrl
        // Simülasyon gereği direkt başarılı kabul edip kendi success sayfamıza yönlendiriyoruz.
        clearCart();
        router.push(`/success?orderNumber=${orderRes.orderNumber}`);
      }
    } catch (error) {
      console.error(error);
      alert("Ödeme başlatılırken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-6xl mx-auto py-20 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Sepetiniz Boş</h1>
        <p className="text-gray-500">Ödeme adımına geçmek için sepetinize ürün eklemelisiniz.</p>
        <a href="/" className="inline-block mt-6 px-6 py-3 bg-orange-500 text-white font-semibold rounded-md">Alışverişe Başla</a>
      </div>
    );
  }

  if (paymentUrl) {
    return (
      <div className="max-w-6xl mx-auto py-20 text-center">
        <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">İyzico Simülasyonu Başarılı</h1>
        <p className="text-gray-500 mb-6">Ödeme formu başlatıldı. Gerçek entegrasyonda kullanıcı iyzico ödeme sayfasına yönlendirilecektir.</p>
        <p className="text-sm font-mono bg-gray-100 p-4 rounded-md inline-block text-gray-700">Yönlendirilecek URL: {paymentUrl}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20 pt-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Ödeme Yap</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-12 gap-8">
          {/* SOL KOLON */}
          <div className="md:col-span-8 space-y-8">
            {/* İletişim Bilgileri */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                İletişim Bilgileri
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adınız</label>
                  <input type="text" {...register("firstName")} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 outline-none transition" />
                  {errors.firstName && <span className="text-red-500 text-xs mt-1 block">{errors.firstName.message}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Soyadınız</label>
                  <input type="text" {...register("lastName")} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 outline-none transition" />
                  {errors.lastName && <span className="text-red-500 text-xs mt-1 block">{errors.lastName.message}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-posta Adresiniz</label>
                  <input type="email" {...register("email")} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 outline-none transition" />
                  {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email.message}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefon Numaranız</label>
                  <input type="tel" {...register("phone")} placeholder="05XX XXX XX XX" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 outline-none transition" />
                  {errors.phone && <span className="text-red-500 text-xs mt-1 block">{errors.phone.message}</span>}
                </div>
              </div>
            </div>

            {/* Teslimat Adresi */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                Teslimat Adresi
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">İl</label>
                  <input type="text" {...register("city")} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 outline-none transition" />
                  {errors.city && <span className="text-red-500 text-xs mt-1 block">{errors.city.message}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">İlçe</label>
                  <input type="text" {...register("district")} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 outline-none transition" />
                  {errors.district && <span className="text-red-500 text-xs mt-1 block">{errors.district.message}</span>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mahalle</label>
                  <input type="text" {...register("neighborhood")} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 outline-none transition" />
                  {errors.neighborhood && <span className="text-red-500 text-xs mt-1 block">{errors.neighborhood.message}</span>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Açık Adres</label>
                  <textarea {...register("address")} rows={3} placeholder="Sokak, bina no, daire vb." className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 outline-none transition"></textarea>
                  {errors.address && <span className="text-red-500 text-xs mt-1 block">{errors.address.message}</span>}
                </div>
              </div>
            </div>
          </div>

          {/* SAĞ KOLON */}
          <div className="md:col-span-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Sipariş Özeti</h2>
              
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
                {cart.map((item) => {
                  const product = PRODUCTS.find(p => p.id === item.productId);
                  const imageSrc = item.customImage || product?.image || '/placeholder.svg';
                  
                  return (
                  <div key={item.id} className="flex gap-4 items-start border-b border-gray-50 pb-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imageSrc} alt={item.name} className="w-16 h-16 object-contain bg-white rounded-md border border-gray-200" />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-800 line-clamp-2">{item.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">Adet: {item.quantity}</p>
                    </div>
                    <div className="font-bold text-sm">
                      {item.price.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
                    </div>
                  </div>
                )})}
              </div>

              <div className="flex justify-between items-center text-lg font-bold text-gray-900 border-t border-gray-100 pt-4 mb-6">
                <span>Toplam Tutar</span>
                <span>{totalPrice.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}</span>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#00008F] hover:bg-blue-800 text-white font-bold py-4 px-6 rounded-md transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    İşleniyor...
                  </span>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                    Güvenli Ödeme Yap
                  </>
                )}
              </button>
              
              <div className="mt-4 flex justify-center gap-2">
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                  256-bit SSL ile güvence altında
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
