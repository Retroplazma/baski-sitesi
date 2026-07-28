"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PnpUploader from "@/components/PnpUploader";
import { getPnpPricing } from "@/actions/pnp.action";
import { useCartStore } from "@/store/cartStore";

export default function PnpPrintPage() {
  const router = useRouter();
  const addToCart = useCartStore(state => state.addToCart);
  const openCart = useCartStore(state => state.openCart);

  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState<any>(null);

  const [type, setType] = useState<'CARD' | 'STICKER'>('CARD');
  const [paper, setPaper] = useState<'MATTE' | 'GLOSSY'>('MATTE');
  const [surface, setSurface] = useState<'NO_CELLOPHANE' | 'CELLOPHANE'>('NO_CELLOPHANE');
  const [printSide, setPrintSide] = useState<'SINGLE' | 'DOUBLE'>('SINGLE');
  const [copies, setCopies] = useState<number>(1);
  const [fileUrls, setFileUrls] = useState<string[]>([]);
  const [totalDetectedPages, setTotalDetectedPages] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPrices() {
      const res = await getPnpPricing();
      if (res.success && res.data) {
        setPrices(res.data);
      }
      setLoading(false);
    }
    loadPrices();
  }, []);

  const calculateSheets = () => {
    if (totalDetectedPages === 0) return 0;
    if (type === 'CARD' && printSide === 'DOUBLE') {
      return Math.ceil(totalDetectedPages / 2);
    }
    return totalDetectedPages;
  };

  const calculateTotal = () => {
    if (!prices) return 0;
    const currentPrice = type === 'CARD' ? prices.card : prices.sticker;
    let totalPerSheet = currentPrice.basePrice;
    
    totalPerSheet += currentPrice.glossyMatteExtra;

    if (surface === 'CELLOPHANE') {
      totalPerSheet += currentPrice.cellophaneExtra;
    }

    const sheets = calculateSheets();
    return totalPerSheet * sheets * copies;
  };

  const handleAddToCart = () => {
    setError(null);
    if (fileUrls.length === 0) {
      setError("Lütfen en az bir dosya yükleyin.");
      return;
    }

    const finalPrice = calculateTotal();
    
    addToCart({
      id: `pnp-custom-${Date.now()}`,
      productId: 'pnp-custom',
      name: `Özel Print & Play Baskı (${type === 'CARD' ? 'Kart' : 'Sticker'})`,
      price: finalPrice,
      quantity: copies, 
      customImage: fileUrls[0], 
      variants: {
        'Tür': type === 'CARD' ? 'Kart' : 'Sticker',
        'Kağıt': paper === 'MATTE' ? 'Mat' : 'Parlak',
        'Yüzey': surface === 'CELLOPHANE' ? 'Selefonlu' : 'Selefonsuz',
        'Baskı Yönü': type === 'CARD' ? (printSide === 'SINGLE' ? 'Tek Yönlü' : 'Arkalı Önlü') : '-',
        'Hesaplanan Yaprak': calculateSheets().toString(),
        'Tespit Edilen Sayfa': totalDetectedPages.toString(),
        'Kopya Sayısı': copies.toString()
      }
    });

    openCart();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Fiyatlar yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Üst Yönlendirme */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/print-and-play" className="text-gray-500 hover:text-orange-600 transition-colors flex items-center gap-2 text-sm font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Print & Play'e Dön
          </Link>
          <Link href="/urunlerimiz" className="text-gray-500 hover:text-orange-600 transition-colors text-sm font-medium">
            Tüm Ürünler &rarr;
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Kart & Sticker Baskı</h1>
          <p className="text-gray-600">Tercihlerinizi yapın, tasarımınızı yükleyin ve anında siparişinizi verin.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Form Alanı */}
          <div className="lg:col-span-8 space-y-6">
            
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Baskı Seçenekleri</h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Baskı Türü</label>
                  <div className="flex gap-4">
                    <label className={`flex-1 border rounded-lg p-3 text-center cursor-pointer transition-colors ${type === 'CARD' ? 'bg-orange-50 border-orange-500 text-orange-700 font-bold' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <input type="radio" name="type" className="hidden" checked={type === 'CARD'} onChange={() => setType('CARD')} />
                      Oyun Kartı
                    </label>
                    <label className={`flex-1 border rounded-lg p-3 text-center cursor-pointer transition-colors ${type === 'STICKER' ? 'bg-orange-50 border-orange-500 text-orange-700 font-bold' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <input type="radio" name="type" className="hidden" checked={type === 'STICKER'} onChange={() => setType('STICKER')} />
                      Sticker
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Kağıt Tipi</label>
                  <div className="flex gap-4">
                    <label className={`flex-1 border rounded-lg p-3 text-center cursor-pointer transition-colors ${paper === 'MATTE' ? 'bg-orange-50 border-orange-500 text-orange-700 font-bold' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <input type="radio" name="paper" className="hidden" checked={paper === 'MATTE'} onChange={() => setPaper('MATTE')} />
                      Mat
                    </label>
                    <label className={`flex-1 border rounded-lg p-3 text-center cursor-pointer transition-colors ${paper === 'GLOSSY' ? 'bg-orange-50 border-orange-500 text-orange-700 font-bold' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <input type="radio" name="paper" className="hidden" checked={paper === 'GLOSSY'} onChange={() => setPaper('GLOSSY')} />
                      Parlak
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Yüzey Koruma (Selefon)</label>
                  <div className="flex gap-4">
                    <label className={`flex-1 border rounded-lg p-3 text-center cursor-pointer transition-colors ${surface === 'NO_CELLOPHANE' ? 'bg-orange-50 border-orange-500 text-orange-700 font-bold' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <input type="radio" name="surface" className="hidden" checked={surface === 'NO_CELLOPHANE'} onChange={() => setSurface('NO_CELLOPHANE')} />
                      Selefonsuz
                    </label>
                    <label className={`flex-1 border rounded-lg p-3 text-center cursor-pointer transition-colors ${surface === 'CELLOPHANE' ? 'bg-orange-50 border-orange-500 text-orange-700 font-bold' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <input type="radio" name="surface" className="hidden" checked={surface === 'CELLOPHANE'} onChange={() => setSurface('CELLOPHANE')} />
                      Selefonlu (+{type === 'CARD' ? prices?.card.cellophaneExtra : prices?.sticker.cellophaneExtra} TL)
                    </label>
                  </div>
                </div>

                {type === 'CARD' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Baskı Yönü</label>
                    <div className="flex gap-4">
                      <label className={`flex-1 border rounded-lg p-3 text-center cursor-pointer transition-colors ${printSide === 'SINGLE' ? 'bg-orange-50 border-orange-500 text-orange-700 font-bold' : 'border-gray-200 hover:bg-gray-50'}`}>
                        <input type="radio" name="printSide" className="hidden" checked={printSide === 'SINGLE'} onChange={() => setPrintSide('SINGLE')} />
                        Tek Yönlü
                      </label>
                      <label className={`flex-1 border rounded-lg p-3 text-center cursor-pointer transition-colors ${printSide === 'DOUBLE' ? 'bg-orange-50 border-orange-500 text-orange-700 font-bold' : 'border-gray-200 hover:bg-gray-50'}`}>
                        <input type="radio" name="printSide" className="hidden" checked={printSide === 'DOUBLE'} onChange={() => setPrintSide('DOUBLE')} />
                        Arkalı Önlü
                      </label>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Kopya Sayısı (Set Adedi)</label>
                  <input 
                    type="number" 
                    min="1" 
                    value={copies} 
                    onChange={(e) => setCopies(Math.max(1, Number(e.target.value)))}
                    className="w-full md:w-1/3 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">Bu dosyadan toplam kaç set istiyorsunuz?</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <PnpUploader 
                onUploadSuccess={(urls, pages) => {
                  setFileUrls(urls);
                  setTotalDetectedPages(pages);
                }}
                onClear={() => {
                  setFileUrls([]);
                  setTotalDetectedPages(0);
                }}
              />
            </div>
            
          </div>

          {/* Fiyat Özeti */}
          <div className="lg:col-span-4">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Sipariş Özeti</h2>
              
              <div className="space-y-4 mb-6 border-b pb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Tür:</span>
                  <span className="font-semibold text-gray-900">{type === 'CARD' ? 'Oyun Kartı' : 'Sticker'}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Kağıt:</span>
                  <span className="font-semibold text-gray-900">{paper === 'MATTE' ? 'Mat' : 'Parlak'}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Yüzey:</span>
                  <span className="font-semibold text-gray-900">{surface === 'CELLOPHANE' ? 'Selefonlu' : 'Selefonsuz'}</span>
                </div>
                {type === 'CARD' && (
                  <div className="flex justify-between text-gray-600">
                    <span>Baskı Yönü:</span>
                    <span className="font-semibold text-gray-900">{printSide === 'SINGLE' ? 'Tek Yönlü' : 'Arkalı Önlü'}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Tespit Edilen Sayfa:</span>
                  <span className="font-semibold text-gray-900">{totalDetectedPages}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Hesaplanan Yaprak:</span>
                  <span className="font-semibold text-orange-600">{calculateSheets()} Yaprak</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Kopya Sayısı:</span>
                  <span className="font-semibold text-gray-900">{copies} Adet</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-6">
                <span className="text-lg font-bold text-gray-900">Toplam</span>
                <span className="text-3xl font-extrabold text-orange-600">
                  {calculateTotal().toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
                </span>
              </div>

              {/* Operational Warning Alert */}
              <div className="mb-6 bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg shadow-sm">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-bold text-orange-800">Önemli Uyarı</h3>
                    <div className="mt-1 text-xs text-orange-700 leading-relaxed">
                      Yüklediğiniz dosyalar sistemimiz tarafından otomatik taranır. Zip, Rar veya karmaşık görseller içeren yüklemelerde, dosyadaki sayfa sayısı ile sistemin tespit edip sizin ödediğiniz tutar uyuşmazsa siparişiniz <strong>beklemeye alınır</strong> ve tarafınızdan ek ödeme talep edilir.
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm font-semibold mb-4 bg-red-50 p-3 rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <button 
                onClick={handleAddToCart}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                Sepete Ekle
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
