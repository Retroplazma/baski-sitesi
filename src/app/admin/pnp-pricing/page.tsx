"use client";

import { useState, useEffect } from "react";
import { getPnpPricing, updatePnpPricing } from "@/actions/pnp.action";
import { useRouter } from "next/navigation";

export default function PnpPricingPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const router = useRouter();

  const [prices, setPrices] = useState({
    card: { basePrice: 100, glossyMatteExtra: 20, cellophaneExtra: 20 },
    sticker: { basePrice: 100, glossyMatteExtra: 20, cellophaneExtra: 20 }
  });

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

  const handleSubmit = async (e: React.FormEvent, type: 'CARD' | 'STICKER') => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const data = type === 'CARD' ? prices.card : prices.sticker;
    const res = await updatePnpPricing(type, data);

    if (res.success) {
      setMessage({ type: 'success', text: `${type === 'CARD' ? 'Kart' : 'Sticker'} fiyatları başarıyla güncellendi.` });
      router.refresh();
    } else {
      setMessage({ type: 'error', text: res.error || "Bir hata oluştu." });
    }
    setSaving(false);
  };

  const handleChange = (type: 'card' | 'sticker', field: string, value: number) => {
    setPrices(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Yükleniyor...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Print and Play Fiyatlandırma Yönetimi</h1>

      {message && (
        <div className={`p-4 mb-6 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* KART FİYATLARI */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Kart Baskı</h2>
          <form onSubmit={(e) => handleSubmit(e, 'CARD')} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Taban Fiyat (TL)</label>
              <input
                type="number"
                value={prices.card.basePrice}
                onChange={(e) => handleChange('card', 'basePrice', Number(e.target.value))}
                className="w-full px-4 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
                required
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mat/Parlak Ekstra (TL)</label>
              <input
                type="number"
                value={prices.card.glossyMatteExtra}
                onChange={(e) => handleChange('card', 'glossyMatteExtra', Number(e.target.value))}
                className="w-full px-4 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
                required
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Selefon Ekstra (TL)</label>
              <input
                type="number"
                value={prices.card.cellophaneExtra}
                onChange={(e) => handleChange('card', 'cellophaneExtra', Number(e.target.value))}
                className="w-full px-4 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
                required
                min="0"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-orange-500 text-white font-bold py-2 rounded-md hover:bg-orange-600 transition disabled:opacity-50"
            >
              {saving ? 'Kaydediliyor...' : 'Kart Fiyatlarını Kaydet'}
            </button>
          </form>
        </div>

        {/* STICKER FİYATLARI */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Sticker Baskı</h2>
          <form onSubmit={(e) => handleSubmit(e, 'STICKER')} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Taban Fiyat (TL)</label>
              <input
                type="number"
                value={prices.sticker.basePrice}
                onChange={(e) => handleChange('sticker', 'basePrice', Number(e.target.value))}
                className="w-full px-4 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
                required
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mat/Parlak Ekstra (TL)</label>
              <input
                type="number"
                value={prices.sticker.glossyMatteExtra}
                onChange={(e) => handleChange('sticker', 'glossyMatteExtra', Number(e.target.value))}
                className="w-full px-4 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
                required
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Selefon Ekstra (TL)</label>
              <input
                type="number"
                value={prices.sticker.cellophaneExtra}
                onChange={(e) => handleChange('sticker', 'cellophaneExtra', Number(e.target.value))}
                className="w-full px-4 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
                required
                min="0"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-blue-600 text-white font-bold py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            >
              {saving ? 'Kaydediliyor...' : 'Sticker Fiyatlarını Kaydet'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
