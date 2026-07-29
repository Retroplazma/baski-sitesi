"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES, Product } from "@/data/products";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import ImageUploader from "@/components/ImageUploader";

export default function ProductDetailClient({ initialProduct }: { initialProduct: Product }) {
  const [product, setProduct] = useState<Product>(initialProduct);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  
  // State for selected variants and quantity
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  
  // Active main image
  const [activeImage, setActiveImage] = useState(initialProduct.image || "/placeholder.svg");

  const router = useRouter();
  
  const { addToCart, openCart } = useCartStore();

  useEffect(() => {
    // Select first options by default
    const initialVariants: Record<string, string> = {};
    initialProduct.variants?.forEach((variant) => {
      initialVariants[variant.name] = variant.options[0];
    });
    setSelectedVariants(initialVariants);

    // Select first quantity option by default
    if (initialProduct.quantityOptions && initialProduct.quantityOptions.length > 0) {
      setSelectedQuantity(initialProduct.quantityOptions[0].quantity);
      setTotalPrice(initialProduct.quantityOptions[0].price);
    } else if (initialProduct.basePrice) {
      setTotalPrice(initialProduct.basePrice);
    }
  }, [initialProduct]);

  const handleVariantSelect = (variantName: string, option: string) => {
    setSelectedVariants(prev => ({ ...prev, [variantName]: option }));
  };

  const handleQuantitySelect = (quantity: number, price: number) => {
    setSelectedQuantity(quantity);
    setTotalPrice(price);
  };

  const handleCheckout = async () => {
    if (!product) return;
    
    if (!uploadedUrl) {
      alert("Lütfen basılmasını istediğiniz görseli yükleyin.");
      return;
    }

    setLoading(true);
    
    // Generate unique ID based on product id and variants
    const variantHash = Object.values(selectedVariants).join("-");
    const cartItemId = `${product.id}-${variantHash}`;

    // Add to cart
    addToCart({
      id: cartItemId,
      productId: product.id,
      name: product.name,
      price: totalPrice,
      quantity: selectedQuantity,
      customImage: uploadedUrl,
      variants: selectedVariants,
      basePrice: product.basePrice,
      quantityOptions: product.quantityOptions
    });

    setLoading(false);
    
    // Open drawer
    openCart();
  };

  if (!product) {
    return <div className="py-20 text-center">Ürün yükleniyor...</div>;
  }

  const category = CATEGORIES.find(c => c.slug === product.categorySlug);
  const images = [product.image, "/placeholder.svg", "/placeholder.svg", "/placeholder.svg"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* 3 COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* SOL KOLON: Görsel Galerisi */}
        <div className="lg:col-span-4">
          <div className="border border-gray-200 rounded-lg overflow-hidden bg-white mb-4 aspect-square flex justify-center items-center relative p-4">
            {product.isNew && (
              <span className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-sm shadow-sm z-10">YENİ</span>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={activeImage} alt={product.name} className="w-full h-full object-contain" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {images.map((img, idx) => (
              <div 
                key={idx} 
                className={`aspect-square border-2 rounded-md overflow-hidden cursor-pointer flex justify-center items-center bg-gray-50 p-1 ${activeImage === img ? 'border-sky-500' : 'border-transparent hover:border-gray-300'}`}
                onClick={() => setActiveImage(img)}
              >
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                 <img src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-contain" />
              </div>
            ))}
          </div>
        </div>

        {/* ORTA KOLON: Seçenekler ve Eser Yükleme */}
        <div className="lg:col-span-5 flex flex-col space-y-8">
          
          <div>
            <nav className="flex text-sm text-gray-500 mb-4">
              <Link href="/urunlerimiz" className="hover:text-gray-900">Tüm Ürünler</Link>
              <span className="mx-2">/</span>
              {category && <Link href={`/urunlerimiz/${category.slug}`} className="hover:text-gray-900">{category.name}</Link>}
              <span className="mx-2">/</span>
              <span className="text-gray-900 font-medium">{product.name}</span>
            </nav>

            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{product.name}</h1>
            
            <div className="flex items-center gap-2 mb-2">
              <div className="flex text-yellow-400">
                {[1,2,3,4,5].map(star => (
                  <svg key={star} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                ))}
              </div>
              <span className="text-sm text-gray-500 underline cursor-pointer hover:text-gray-700">74 Değerlendirme</span>
            </div>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Dinamik Varyantlar */}
          {product.variants && product.variants.map((variant) => (
            <div key={variant.name}>
              <h3 className="text-sm font-bold text-gray-900 mb-3">{variant.name}</h3>
              <div className="flex flex-wrap gap-3">
                {variant.options.map((option) => {
                  const isSelected = selectedVariants[variant.name] === option;
                  return (
                    <div 
                      key={option}
                      onClick={() => handleVariantSelect(variant.name, option)}
                      className={`relative cursor-pointer px-4 py-2 border rounded-md text-sm font-medium transition-all ${
                        isSelected 
                          ? 'border-sky-500 bg-sky-50 text-sky-700 shadow-sm' 
                          : 'border-gray-300 text-gray-700 hover:border-gray-400 bg-white'
                      }`}
                    >
                      {option}
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 bg-sky-500 text-white rounded-full p-0.5">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Adet Seçimi */}
          {product.quantityOptions && (
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-3">Adet</h3>
              <div className="grid grid-cols-2 gap-3">
                {product.quantityOptions.map((opt) => {
                  const isSelected = selectedQuantity === opt.quantity;
                  return (
                    <div 
                      key={opt.quantity}
                      onClick={() => handleQuantitySelect(opt.quantity, opt.price)}
                      className={`relative cursor-pointer p-3 border rounded-md transition-all flex justify-between items-center ${
                        isSelected 
                          ? 'border-sky-500 bg-sky-50 shadow-sm' 
                          : 'border-gray-300 hover:border-gray-400 bg-white'
                      }`}
                    >
                      <div>
                        <div className={`font-bold ${isSelected ? 'text-sky-700' : 'text-gray-900'}`}>{opt.quantity} Adet</div>
                        <div className={`text-xs ${isSelected ? 'text-sky-600' : 'text-gray-500'}`}>Birim: {(opt.price / opt.quantity).toLocaleString("tr-TR", {maximumFractionDigits: 2})} TL</div>
                      </div>
                      <div className={`font-bold ${isSelected ? 'text-sky-700' : 'text-gray-900'}`}>
                        {opt.price.toLocaleString("tr-TR")} TL
                      </div>
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 bg-sky-500 text-white rounded-full p-0.5 shadow-sm">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tasarım Yükleme Alanı */}
          <ImageUploader 
            onUploadSuccess={(url) => setUploadedUrl(url)} 
            onClear={() => setUploadedUrl(null)} 
          />

        </div>

        {/* SAĞ KOLON: Sticky Özet Paneli */}
        <div className="lg:col-span-3">
          <div className="border border-gray-200 rounded-xl shadow-sm p-6 sticky top-28 bg-white">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4 mb-4">Sipariş Özeti</h2>
            
            <div className="space-y-3 text-sm text-gray-600 mb-6">
              {Object.entries(selectedVariants).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span>{key}:</span>
                  <span className="font-medium text-gray-900">{value}</span>
                </div>
              ))}
              <div className="flex justify-between">
                <span>Adet:</span>
                <span className="font-medium text-gray-900">{selectedQuantity}</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 mb-6">
              <p className="text-sm text-gray-500 mb-1">Toplam Fiyat (KDV Dahil)</p>
              <div className="text-4xl font-black text-gray-900 tracking-tight">
                {totalPrice.toLocaleString("tr-TR")} <span className="text-2xl">TL</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading || !uploadedUrl}
              className="w-full flex justify-center items-center py-4 px-4 rounded-lg shadow-sm text-lg font-bold text-white bg-sky-500 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all mb-4"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sepete Ekleniyor...
                </span>
              ) : (
                "SEPETE EKLE"
              )}
            </button>

            <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-md border border-gray-100">
              <svg className="w-6 h-6 text-orange-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
              <p className="text-xs text-gray-600 leading-snug">
                Şimdi sipariş verirseniz, yarın kargoda. Ücretsiz kargo fırsatını kaçırmayın.
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* ALT SEKMELER (Tabs) */}
      <div className="mt-20 border-t border-gray-200 pt-10">
        <div className="flex border-b border-gray-200">
          {['about', 'process', 'policy'].map((tab) => {
            const labels: Record<string, string> = { about: 'Ürün Hakkında', process: 'Sipariş Süreci', policy: 'Ödeme ve İade' };
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-8 font-bold text-sm transition-colors border-b-2 ${
                  activeTab === tab ? 'border-sky-500 text-sky-600 bg-sky-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>
        <div className="py-8 prose prose-sky max-w-none text-gray-600">
          {activeTab === 'about' && (
            <div>
              <h3>Ürün Özellikleri ve Detayları</h3>
              <p>Bu ürün, sektördeki en yüksek kaliteli malzemeler kullanılarak üretilmektedir. Gelişmiş dijital baskı teknolojimiz sayesinde renkler ekranınızda gördüğünüz kadar canlı ve uzun ömürlüdür.</p>
              <ul>
                <li>%100 yüksek çözünürlüklü CMYK baskı.</li>
                <li>Solmaya karşı dayanıklı ve ekolojik mürekkepler.</li>
                <li>Uzman kalite kontrol ekibimiz tarafından detaylı incelenir.</li>
              </ul>
            </div>
          )}
          {activeTab === 'process' && (
            <div>
              <h3>Nasıl Sipariş Verilir?</h3>
              <p>Sipariş vermek çok kolay! Sağ taraftaki seçeneklerden sizin için en uygun varyantları ve adedi belirleyin. Ardından basılmasını istediğiniz görseli yükleyin ve "Sepete Ekle" butonuna tıklayarak ödeme adımına geçin.</p>
              <p>Siparişiniz onaylandıktan sonra grafik ekibimiz görselinizi baskıya uygunluk açısından kontrol eder. Gerekli durumlarda sizinle iletişime geçilir.</p>
            </div>
          )}
          {activeTab === 'policy' && (
            <div>
              <h3>Güvenli Ödeme ve İade Koşulları</h3>
              <p>Sitemiz üzerinden yapacağınız tüm alışverişler 256-bit SSL sertifikası ile korunmaktadır. Kredi kartı bilgileriniz sistemimizde saklanmaz.</p>
              <p>Kişiye özel üretilen ürünlerde cayma hakkı bulunmamaktadır. Ancak ürünün kargoda hasar görmesi veya üretim hatalı olması durumunda, teslimat tarihinden itibaren 14 gün içerisinde koşulsuz iade ve değişim garantimiz bulunmaktadır.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
