"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getUserProfile, updateProfile } from "@/actions/profile.action";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    district: "",
    address: ""
  });

  useEffect(() => {
    async function loadProfile() {
      if (session?.user?.id) {
        const res = await getUserProfile(session.user.id);
        if (res.success && res.data) {
          setFormData({
            name: res.data.name || "",
            phone: res.data.phone || "",
            city: res.data.city || "",
            district: res.data.district || "",
            address: res.data.address || "",
          });
        }
      }
      setLoading(false);
    }
    loadProfile();
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    
    if (session?.user?.id) {
      const res = await updateProfile(session.user.id, formData);
      if (res.success) {
        setMessage({ type: 'success', text: "Profil bilgileriniz başarıyla güncellendi." });
      } else {
        setMessage({ type: 'error', text: res.error || "Bir hata oluştu." });
      }
    }
    
    setSaving(false);
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Yükleniyor...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Hesap Bilgilerim</h2>
      
      {message && (
        <div className={`p-4 mb-6 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500 outline-none transition" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
            <input 
              type="email" 
              value={session?.user?.email || ""} 
              disabled
              className="w-full px-4 py-2 border border-gray-200 bg-gray-50 text-gray-500 rounded-md outline-none cursor-not-allowed" 
            />
            <p className="text-xs text-gray-400 mt-1">E-posta adresi değiştirilemez.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefon Numarası</label>
            <input 
              type="tel" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange}
              placeholder="05XX XXX XX XX"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500 outline-none transition" 
            />
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Adres Bilgileri</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">İl</label>
              <input 
                type="text" 
                name="city" 
                value={formData.city} 
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500 outline-none transition" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">İlçe</label>
              <input 
                type="text" 
                name="district" 
                value={formData.district} 
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500 outline-none transition" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Açık Adres</label>
              <textarea 
                name="address" 
                value={formData.address} 
                onChange={handleChange}
                rows={3} 
                placeholder="Sokak, bina no, daire vb." 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500 outline-none transition"
              ></textarea>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit" 
            disabled={saving}
            className="px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-md shadow-sm transition-colors disabled:opacity-70 flex items-center gap-2"
          >
            {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
          </button>
        </div>
      </form>
    </div>
  );
}
