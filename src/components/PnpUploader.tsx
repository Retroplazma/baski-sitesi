"use client";

import { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/lib/supabaseClient";
import { PDFDocument } from "pdf-lib";

interface PnpUploaderProps {
  onUploadSuccess: (urls: string[], totalDetectedPages: number) => void;
  onClear: () => void;
}

export default function PnpUploader({ onUploadSuccess, onClear }: PnpUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; url: string; preview: string | null; pages: number }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);

    // Validasyonlar
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'model/stl', 'model/obj'];
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    
    // Tarayıcılar bazen STL veya OBJ'yi type olarak algılamayabilir, uzantıyı da kontrol et
    if (!allowedTypes.includes(file.type) && fileExt !== 'stl' && fileExt !== 'obj' && fileExt !== 'pdf') {
      setError("Sadece JPG, PNG, PDF, STL ve OBJ formatları desteklenmektedir.");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setError("Dosya boyutu 50 MB'ı geçemez.");
      return;
    }

    setLoading(true);

    try {
      const fileName = `${uuidv4()}-${file.name.replace(/[^a-zA-Z0-9]/g, '_')}`;
      
      const { data, error: uploadError } = await supabase.storage
        .from('print-uploads')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('print-uploads')
        .getPublicUrl(fileName);

      let preview = null;
      if (file.type.startsWith('image/')) {
        preview = URL.createObjectURL(file);
      } else if (fileExt === 'pdf') {
        preview = '/placeholder.svg';
      } else {
        preview = '/placeholder.svg'; // STL, OBJ placeholder
      }

      let pageCount = 1;
      if (fileExt === 'pdf' || file.type === 'application/pdf') {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const pdfDoc = await PDFDocument.load(arrayBuffer);
          pageCount = pdfDoc.getPageCount();
        } catch (err) {
          console.error("PDF parse error:", err);
          pageCount = 1; // Fallback
        }
      }

      const newFiles = [...uploadedFiles, { name: file.name, url: publicUrl, preview, pages: pageCount }];
      setUploadedFiles(newFiles);
      
      const totalPages = newFiles.reduce((sum, f) => sum + f.pages, 0);
      onUploadSuccess(newFiles.map(f => f.url), totalPages);
      
    } catch (err: any) {
      console.error("Upload error:", err);
      setError("Dosya yüklenirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Sadece ilk dosyayı al, gerekirse çoklu seçimi mapleyebilirsin
      // Ancak "Fazladan dosya ekle" butonu ile de tek tek eklenebilir. Çoklu seçime izin verebiliriz.
      Array.from(e.target.files).forEach(file => handleFile(file));
    }
    // Seçimden sonra temizle ki aynı dosyayı tekrar seçebilsin
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      Array.from(e.dataTransfer.files).forEach(file => handleFile(file));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleRemoveFile = (indexToRemove: number) => {
    const newFiles = uploadedFiles.filter((_, idx) => idx !== indexToRemove);
    setUploadedFiles(newFiles);
    
    if (newFiles.length === 0) {
      onClear();
    } else {
      const totalPages = newFiles.reduce((sum, f) => sum + f.pages, 0);
      onUploadSuccess(newFiles.map(f => f.url), totalPages);
    }
  };

  return (
    <div>
      <h3 className="text-sm font-bold text-gray-900 mb-3">Tasarımınızı / Modelinizi Yükleyin</h3>
      
      {error && (
        <div className="mb-3 text-sm text-red-500 bg-red-50 p-2 rounded-md border border-red-100">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex flex-col justify-center items-center border-2 border-gray-200 rounded-lg p-10 bg-gray-50 mb-4">
          <svg className="animate-spin h-8 w-8 text-orange-500 mb-3" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-sm text-gray-600 font-medium">Dosyanız yükleniyor, lütfen bekleyin...</p>
        </div>
      )}

      <div className="space-y-3 mb-4">
        {uploadedFiles.map((file, idx) => (
          <div key={idx} className="relative border border-gray-200 rounded-lg p-3 bg-gray-50 shadow-sm flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span className="text-sm font-medium text-gray-700 truncate">{file.name} <span className="text-gray-400">({file.pages} Sayfa)</span></span>
              </div>
              <button
                onClick={() => handleRemoveFile(idx)}
                className="text-gray-400 hover:text-red-500 bg-white p-1 rounded-md border border-gray-200 transition-colors focus:outline-none"
                title="Dosyayı Kaldır"
                type="button"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            {file.preview && file.preview !== '/placeholder.svg' && (
              <div className="relative rounded-md overflow-hidden bg-white border border-gray-200 flex justify-center items-center h-24">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={file.preview} alt="Preview" className="object-contain w-full h-full" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="flex flex-col justify-center items-center border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50 hover:bg-orange-50 hover:border-orange-400 transition-colors cursor-pointer group"
      >
        <div className="bg-white p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
          <svg className="h-6 w-6 text-orange-500" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="text-sm text-gray-800 font-bold mb-1">
          {uploadedFiles.length > 0 ? "Fazladan Dosya Ekle" : "Dosyanızı sürükleyin veya göz atın"}
        </div>
        <p className="text-xs text-gray-500">
          Desteklenen formatlar: PDF, PNG, JPG, STL, OBJ (Max 50MB)
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/jpg,application/pdf,.stl,.obj"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
