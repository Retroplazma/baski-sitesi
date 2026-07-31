'use client';

import React, { useState, useEffect } from 'react';
import { useBoxCoverStore } from '@/store/useBoxCoverStore';

export default function BoxCoverSettings() {
  const { dimensions, setDimensions, setCurrentStep } = useBoxCoverStore();
  const [error, setError] = useState<string | null>(null);

  // Derinlik 0'dan büyük olmalı, En ve Boy da makul olmalı
  const minDimension = 10;
  
  const validateDimensions = () => {
    const { width, length, height } = dimensions;
    
    if (width < minDimension || length < minDimension || height < 1) {
      setError("Lütfen geçerli kutu ölçüleri girin.");
      return false;
    }

    // Üst kapak için 3mm ekle (geçme payı)
    const lidW = width + 3;
    const lidL = length + 3;
    
    // Kıvrılma ve yapıştırma payları (her iki tarafa 15mm)
    const wrapTotal = 30; // 15 + 15
    const baseTotalW = width + (2 * height) + wrapTotal;
    const baseTotalL = length + (2 * height) + wrapTotal;
    
    const lidTotalW = lidW + (2 * height) + wrapTotal;
    const lidTotalL = lidL + (2 * height) + wrapTotal;

    // Maksimum alan 330x480 veya 480x330 (tabaka boyutu)
    const maxShort = 330;
    const maxLong = 480;
    
    const isBaseFit = (baseTotalW <= maxShort && baseTotalL <= maxLong) || (baseTotalW <= maxLong && baseTotalL <= maxShort);
    const isLidFit = (lidTotalW <= maxShort && lidTotalL <= maxLong) || (lidTotalW <= maxLong && lidTotalL <= maxShort);

    if (!isBaseFit || !isLidFit) {
      setError(`Girdiğiniz ölçülere göre kutu tabakası 33x48 cm sticker tabakasına sığmamaktadır. Lütfen daha küçük boyutlar girin.`);
      return false;
    }

    setError(null);
    return true;
  };

  useEffect(() => {
    validateDimensions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dimensions]);

  const handleNext = () => {
    if (validateDimensions()) {
      setCurrentStep(2);
    }
  };

  return (
    <div className="p-6 md:p-10">
      <div className="max-w-2xl mx-auto space-y-10">
        
        <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="bg-indigo-100 p-3 rounded-full text-indigo-600 shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div>
              <h3 className="font-bold text-indigo-900 text-lg mb-2">Nasıl Çalışır?</h3>
              <p className="text-sm text-indigo-700">
                Sadece <strong>Alt Kutu (Base)</strong> iç ölçülerini girmeniz yeterlidir. Üst Kapağın (Lid) alt kutuya rahatça geçebilmesi için gerekli olan <strong>+3mm tolerans payı</strong> sistem tarafından otomatik olarak eklenecek ve her iki parça (Taban + Kapak) için tasarım şablonu aynı anda oluşturulacaktır.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">İç Kutu Ölçüleri (mm)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Genişlik / En (W)</label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="number"
                  min={minDimension}
                  value={dimensions.width}
                  onChange={(e) => setDimensions({ width: parseInt(e.target.value) || 0 })}
                  className="block w-full rounded-md border-gray-300 pl-4 pr-12 py-3 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-semibold"
                  placeholder="200"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">mm</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Uzunluk / Boy (L)</label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="number"
                  min={minDimension}
                  value={dimensions.length}
                  onChange={(e) => setDimensions({ length: parseInt(e.target.value) || 0 })}
                  className="block w-full rounded-md border-gray-300 pl-4 pr-12 py-3 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-semibold"
                  placeholder="200"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">mm</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Yükseklik (H)</label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="number"
                  min={1}
                  value={dimensions.height}
                  onChange={(e) => setDimensions({ height: parseInt(e.target.value) || 0 })}
                  className="block w-full rounded-md border-gray-300 pl-4 pr-12 py-3 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-semibold"
                  placeholder="50"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">mm</span>
                </div>
              </div>
            </div>
            
          </div>
        </div>

        {error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 font-medium">
                  {error}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="ml-3 text-sm text-green-700 font-medium">
                Ölçüler uygun. Kutu kaplaması (Takım) 33x48 cm tabakalara sığıyor.
              </p>
            </div>
          </div>
        )}

        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <button
            onClick={handleNext}
            disabled={!!error}
            className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            Sonraki Adım: Görsel Yerleşimi
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
        </div>

      </div>
    </div>
  );
}
