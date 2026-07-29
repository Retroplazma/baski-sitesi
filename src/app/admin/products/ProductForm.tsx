"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createProduct, updateProduct } from "@/actions/product.action";
import ImageUploader from "@/components/ImageUploader";
import GalleryUploader from "@/components/GalleryUploader";
import { CATEGORIES } from "@/data/products";

const productSchema = z.object({
  name: z.string().min(2, "Ürün adı çok kısa"),
  description: z.string().min(5, "Açıklama çok kısa"),
  price: z.number().min(0, "Fiyat 0'dan küçük olamaz"),
  category: z.string().min(2, "Kategori adı çok kısa"),
  isCustomizable: z.boolean(),
  isActive: z.boolean(),
  allowMultipleDesigns: z.boolean(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function ProductForm({ 
  product, 
  onClose 
}: { 
  product?: any;
  onClose: () => void;
}) {
  const [imageUrl, setImageUrl] = useState<string>(product?.imageUrl || "");
  const [galleryImages, setGalleryImages] = useState<string[]>(product?.galleryImages || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || 0,
      category: product?.category || "",
      isCustomizable: product?.isCustomizable ?? true,
      isActive: product?.isActive ?? true,
      allowMultipleDesigns: product?.allowMultipleDesigns ?? false,
    }
  });

  const onSubmit = async (data: ProductFormData) => {
    if (!imageUrl) {
      setError("Lütfen bir kapak görseli yükleyin.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const payload = { ...data, imageUrl, galleryImages };
      
      let res;
      if (product) {
        res = await updateProduct(product.id, payload);
      } else {
        res = await createProduct(payload);
      }

      if (res.success) {
        onClose();
      } else {
        setError(res.error || "Bir hata oluştu.");
      }
    } catch (err) {
      setError("Beklenmeyen bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl flex flex-col max-h-full">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 flex-shrink-0 rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-900">{product ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="product-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Image Uploader */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kapak Görseli</label>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <ImageUploader 
                  onUploadSuccess={(urls) => setImageUrl(Array.isArray(urls) ? urls[0] : urls)} 
                  onClear={() => setImageUrl("")} 
                />
              </div>
              {imageUrl && (
                <div className="mt-3 flex items-center gap-3 p-2 border border-emerald-200 bg-emerald-50 rounded-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageUrl} alt="Kapak" className="w-12 h-12 object-cover rounded-md" />
                  <span className="text-sm text-emerald-700 font-medium flex-1 truncate">{imageUrl}</span>
                  <button type="button" onClick={() => setImageUrl("")} className="text-red-500 hover:text-red-700 text-sm font-medium px-2">Kaldır</button>
                </div>
              )}
            </div>

            {/* Gallery Uploader */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ek Görseller (Galeri)</label>
              <GalleryUploader 
                initialUrls={galleryImages} 
                onUploadSuccess={(urls) => setGalleryImages(urls)} 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Adı</label>
                <input {...register("name")} type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="Örn: İsme Özel Kupa" />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <select {...register("category")} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
                  <option value="">Kategori Seçin...</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.slug} value={c.slug}>{c.name}</option>
                  ))}
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Fiyat (TL)</label>
                <input {...register("price", { valueAsNumber: true })} type="number" step="0.01" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="299.90" />
                {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price.message}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                <textarea {...register("description")} rows={4} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none" placeholder="Ürün detaylarını buraya girin..."></textarea>
                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
              </div>

              <div className="md:col-span-2 flex flex-col sm:flex-row gap-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input {...register("isActive")} type="checkbox" className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm font-medium text-gray-700">Ürün Aktif (Satışta)</span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input {...register("isCustomizable")} type="checkbox" className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm font-medium text-gray-700">Müşteri Görsel Yükleyebilir</span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input {...register("allowMultipleDesigns")} type="checkbox" className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm font-medium text-gray-700">Çoklu Tasarım Yüklemeye İzin Ver</span>
                </label>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-200">
                {error}
              </div>
            )}
          </form>
        </div>

        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50 flex-shrink-0 rounded-b-2xl">
          <button type="button" onClick={onClose} disabled={isSubmitting} className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors border border-gray-200 bg-white">
            İptal
          </button>
          <button type="submit" form="product-form" disabled={isSubmitting} className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-[#00008F] hover:bg-blue-800 transition-colors disabled:opacity-70 flex items-center gap-2 shadow-sm">
            {isSubmitting ? (
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : null}
            {product ? "Değişiklikleri Kaydet" : "Ürünü Oluştur"}
          </button>
        </div>
      </div>
    </div>
  );
}
