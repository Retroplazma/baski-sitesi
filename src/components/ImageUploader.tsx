"use client";

import { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/lib/supabaseClient";

import ImageCropper from "./ImageCropper";

interface ImageUploaderProps {
  allowMultiple?: boolean;
  onUploadSuccess: (urls: string | string[]) => void;
  onClear: () => void;
  printWidth?: number | null;
  printHeight?: number | null;
  bleed?: number | null;
}

export default function ImageUploader({ allowMultiple = false, onUploadSuccess, onClear, printWidth, printHeight, bleed }: ImageUploaderProps) {
  const [cropData, setCropData] = useState<{ imageSrc: string; file: File } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopyrightAccepted, setIsCopyrightAccepted] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{name: string, url: string, preview: string | null}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);

    // Validasyonlar
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setError("Sadece JPG, PNG ve PDF formatları desteklenmektedir.");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setError("Dosya boyutu 15 MB'ı geçemez.");
      return;
    }

    setLoading(true);

    try {
      // Benzersiz dosya ismi oluştur
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}-${file.name.replace(/[^a-zA-Z0-9]/g, '_')}`;
      
      // Supabase'e yükle
      const { data, error: uploadError } = await supabase.storage
        .from('print-uploads')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      // Public URL'i al
      const { data: { publicUrl } } = supabase.storage
        .from('print-uploads')
        .getPublicUrl(fileName);

      let preview = null;
      if (file.type.startsWith('image/')) {
        preview = URL.createObjectURL(file);
      } else {
        preview = '/placeholder.svg'; // PDF için genel ikon gösterilebilir
      }

      let newFiles = uploadedFiles;
      if (allowMultiple) {
        newFiles = [...uploadedFiles, { name: file.name, url: publicUrl, preview }];
      } else {
        newFiles = [{ name: file.name, url: publicUrl, preview }];
      }
      
      setUploadedFiles(newFiles);

      if (allowMultiple) {
        onUploadSuccess(newFiles.map(f => f.url));
      } else {
        onUploadSuccess(publicUrl);
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setError("Dosya yüklenirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (printWidth && printHeight && file.type.startsWith("image/")) {
        setCropData({ imageSrc: URL.createObjectURL(file), file });
      } else {
        if (allowMultiple) {
          Array.from(e.target.files).forEach(f => handleFile(f));
        } else {
          handleFile(file);
        }
      }
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isCopyrightAccepted) {
      setError("Lütfen telif hakkı beyanını onaylayın.");
      return;
    }
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (printWidth && printHeight && file.type.startsWith("image/")) {
        setCropData({ imageSrc: URL.createObjectURL(file), file });
      } else {
        if (allowMultiple) {
          Array.from(e.dataTransfer.files).forEach(f => handleFile(f));
        } else {
          handleFile(file);
        }
      }
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
      if (allowMultiple) {
        onUploadSuccess(newFiles.map(f => f.url));
      } else {
        onUploadSuccess(newFiles[0].url);
      }
    }
  };

  return (
    <div>
      {cropData && printWidth && printHeight && (
        <ImageCropper
          imageSrc={cropData.imageSrc}
          aspectRatio={printWidth / printHeight}
          printWidth={printWidth}
          printHeight={printHeight}
          bleed={bleed || 0}
          onCropComplete={(croppedBlob) => {
            const croppedFile = new File([croppedBlob], cropData.file.name, { type: "image/jpeg" });
            setCropData(null);
            handleFile(croppedFile);
          }}
          onCancel={() => setCropData(null)}
        />
      )}
      
      <h3 className="text-sm font-bold text-gray-900 mb-3">Tasarımınızı Yükleyin</h3>
      
      <div className="mb-4 flex items-start gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
        <input 
          type="checkbox" 
          id="copyright-accept-uploader"
          checked={isCopyrightAccepted}
          onChange={(e) => {
            setIsCopyrightAccepted(e.target.checked);
            if (e.target.checked && error === "Lütfen telif hakkı beyanını onaylayın.") setError(null);
          }}
          className="mt-1 w-4 h-4 rounded border-gray-300 text-sky-500 focus:ring-sky-500"
        />
        <label htmlFor="copyright-accept-uploader" className="text-xs text-gray-600 leading-relaxed cursor-pointer select-none">
          Yüklediğim dosyaların telif hakkının bana ait olduğunu veya telif sahibinden gerekli baskı/çoğaltma izinlerini aldığımı beyan ve kabul ederim.
        </label>
      </div>
      
      {error && (
        <div className="mb-3 text-sm text-red-500 bg-red-50 p-2 rounded-md border border-red-100">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col justify-center items-center border-2 border-gray-200 rounded-lg p-10 bg-gray-50">
          <svg className="animate-spin h-8 w-8 text-sky-500 mb-3" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-sm text-gray-600 font-medium">Dosyanız yükleniyor, lütfen bekleyin...</p>
        </div>
      ) : uploadedFiles.length === 0 || allowMultiple ? (
        <div className="space-y-4">
          {uploadedFiles.map((file, idx) => (
            <div key={idx} className="relative border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 overflow-hidden">
                  <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <span className="text-sm font-medium text-gray-700 truncate">{file.name}</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleRemoveFile(idx); }}
                  className="text-gray-400 hover:text-red-500 bg-white p-1 rounded-md border border-gray-200 transition-colors focus:outline-none"
                  title="Dosyayı Kaldır"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              {file.preview && file.preview !== '/placeholder.svg' && (
                <div className="relative rounded-md overflow-hidden bg-white border border-gray-200 flex justify-center items-center h-24 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={file.preview} alt="Preview" className="object-contain w-full h-full" />
                </div>
              )}
            </div>
          ))}

          {(!uploadedFiles.length || allowMultiple) && (
            <div
              onClick={() => {
                if (!isCopyrightAccepted) {
                  setError("Lütfen telif hakkı beyanını onaylayın.");
                  return;
                }
                fileInputRef.current?.click();
              }}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="flex flex-col justify-center items-center border-2 border-dashed border-gray-300 rounded-lg p-10 text-center bg-gray-50 hover:bg-sky-50 hover:border-sky-400 transition-colors cursor-pointer group"
            >
              <div className="bg-white p-4 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
                <svg className="h-8 w-8 text-sky-500" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="text-base text-gray-800 font-bold mb-1">
                {uploadedFiles.length > 0 ? "Yeni Dosya Ekle veya " : "Dosyanızı sürükleyin veya "}
                <span className="text-sky-500 underline">göz atın</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Desteklenen formatlar: PDF, PNG, JPG (Max 15MB)
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="relative border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 overflow-hidden">
              <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span className="text-sm font-medium text-gray-700 truncate">{uploadedFiles[0].name}</span>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleRemoveFile(0); }}
              className="text-gray-400 hover:text-red-500 bg-white p-1 rounded-md border border-gray-200 transition-colors focus:outline-none"
              title="Dosyayı Kaldır"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          {uploadedFiles[0].preview && uploadedFiles[0].preview !== '/placeholder.svg' && (
            <div className="relative rounded-md overflow-hidden bg-white border border-gray-200 flex justify-center items-center h-48 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={uploadedFiles[0].preview} alt="Preview" className="object-contain w-full h-full" />
            </div>
          )}
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg,application/pdf"
        multiple={allowMultiple}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
