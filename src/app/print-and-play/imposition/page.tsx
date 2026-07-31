"use client";

import { usePnpImpositionStore } from "@/store/usePnpImpositionStore";
import ImpositionSettings from "@/components/pnp/ImpositionSettings";
import ImpositionUploader from "@/components/pnp/ImpositionUploader";
import ImpositionPreview from "@/components/pnp/ImpositionPreview";
import Link from "next/link";
import { useEffect } from "react";

export default function PnpImpositionPage() {
  const { currentStep, setCurrentStep, layout, cards, resetStore } = usePnpImpositionStore();

  useEffect(() => {
    return () => resetStore();
  }, [resetStore]);

  const canGoNext = () => {
    if (currentStep === 1) return layout.cols > 0 && layout.rows > 0;
    if (currentStep === 2) return cards.length > 0;
    return false;
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Üst Menü */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/print-and-play" className="text-gray-500 hover:text-orange-600 transition-colors flex items-center gap-2 text-sm font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Print & Play'e Dön
          </Link>
        </div>

        {/* Başlık ve İlerleme Çubuğu */}
        <div className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Otomatik Kart Montaj Motoru</h1>
            <p className="text-gray-600">Tasarımlarınızı yükleyin, profesyonel baskı dizgisini otomatik hazırlayalım.</p>
          </div>
          
          <div className="flex items-center gap-3">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${currentStep === step ? 'bg-orange-500 text-white shadow-md' : currentStep > step ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'}`}>
                  {step}
                </div>
                {step < 3 && <div className={`w-12 h-1 mx-2 rounded-full ${currentStep > step ? 'bg-orange-200' : 'bg-gray-100'}`} />}
              </div>
            ))}
          </div>
        </div>

        {/* Dinamik İçerik Alanı */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
          {currentStep === 1 && <ImpositionSettings />}
          {currentStep === 2 && <ImpositionUploader />}
          {currentStep === 3 && <ImpositionPreview />}
        </div>

        {/* Alt Navigasyon (İleri/Geri) */}
        <div className="mt-8 flex justify-between">
          {currentStep > 1 ? (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-6 py-3 bg-white border border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              &larr; Geri
            </button>
          ) : (
            <div></div> // Boş div layout'u korumak için
          )}

          {currentStep < 3 && (
            <button
              disabled={!canGoNext()}
              onClick={() => setCurrentStep(currentStep + 1)}
              className="px-8 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              İleri &rarr;
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
