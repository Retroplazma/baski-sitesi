"use client";

import { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/lib/supabaseClient";

interface GalleryUploaderProps {
  onUploadSuccess: (urls: string[]) => void;
  initialUrls?: string[];
}

export default function GalleryUploader({ onUploadSuccess, initialUrls = [] }: GalleryUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>(initialUrls);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    setError(null);
    setLoading(true);

    const newUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        continue;
      }
      
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}-${file.name.replace(/[^a-zA-Z0-9]/g, '_')}`;
        
        const { data, error: uploadError } = await supabase.storage
          .from('print-uploads')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('print-uploads')
          .getPublicUrl(fileName);

        newUrls.push(publicUrl);
      } catch (err) {
        console.error("Upload error:", err);
      }
    }

    const updated = [...uploadedUrls, ...newUrls];
    setUploadedUrls(updated);
    onUploadSuccess(updated);
    setLoading(false);
  };

  const handleRemove = (index: number) => {
    const updated = uploadedUrls.filter((_, i) => i !== index);
    setUploadedUrls(updated);
    onUploadSuccess(updated);
  };

  return (
    <div>
      <div className="flex gap-4 flex-wrap mb-4">
        {uploadedUrls.map((url, i) => (
          <div key={i} className="relative w-24 h-24 border rounded-md overflow-hidden group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
            <button type="button" onClick={() => handleRemove(i)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
        ))}
      </div>
      
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50 hover:bg-gray-100 cursor-pointer"
      >
        {loading ? "Yükleniyor..." : "Galeriye Resim Eklemek İçin Tıklayın"}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files);
        }}
        className="hidden"
      />
    </div>
  );
}
