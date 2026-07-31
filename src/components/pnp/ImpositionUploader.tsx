"use client";

import { usePnpImpositionStore } from "@/store/usePnpImpositionStore";
import { useCallback, useRef } from "react";

export default function ImpositionUploader() {
  const { 
    pageSettings, 
    cards, 
    addCard, 
    updateCardCount, 
    removeCard, 
    updateCardBack,
    globalBackMode,
    setGlobalBackMode,
    globalBackPreview,
    setGlobalBackFile
  } = usePnpImpositionStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const globalBackInputRef = useRef<HTMLInputElement>(null);

  const handleFrontUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      Array.from(e.target.files).forEach(file => {
        const previewUrl = URL.createObjectURL(file);
        addCard({
          id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          frontFile: file,
          backFile: null,
          count: 1,
          frontPreview: previewUrl
        });
      });
    }
    // reset
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [addCard]);

  const handleGlobalBackUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      setGlobalBackFile(file, previewUrl);
    }
  }, [setGlobalBackFile]);

  const handleIndividualBackUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      updateCardBack(id, file, previewUrl);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8">
      
      {/* Çift Yönlü ise Arka Plan Modu Seçimi */}
      {pageSettings.printType === 'double' && (
        <div className="bg-orange-50 border border-orange-200 p-6 rounded-2xl mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Arka Yüz Ayarı</h2>
          
          <div className="flex flex-col sm:flex-row gap-6 mb-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="radio" 
                checked={globalBackMode} 
                onChange={() => setGlobalBackMode(true)}
                className="w-5 h-5 text-orange-500 focus:ring-orange-500 border-gray-300"
              />
              <span className="font-semibold text-gray-800">Tüm kartlara aynı arka planı uygula</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="radio" 
                checked={!globalBackMode} 
                onChange={() => setGlobalBackMode(false)}
                className="w-5 h-5 text-orange-500 focus:ring-orange-500 border-gray-300"
              />
              <span className="font-semibold text-gray-800">Her kart için ayrı arka plan seçeceğim</span>
            </label>
          </div>

          {globalBackMode && (
            <div className="flex items-center gap-6 bg-white p-4 rounded-xl border border-orange-100">
              <div className="flex-1">
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={globalBackInputRef}
                  onChange={handleGlobalBackUpload}
                  className="hidden" 
                  id="global-back-upload"
                />
                <label 
                  htmlFor="global-back-upload"
                  className="cursor-pointer inline-flex items-center justify-center px-6 py-3 border-2 border-dashed border-orange-300 rounded-lg text-sm font-medium text-orange-700 hover:bg-orange-50 transition-colors w-full"
                >
                  Ortak Arka Plan Yükle (Tıkla)
                </label>
              </div>
              {globalBackPreview && (
                <div className="w-16 h-24 flex-shrink-0 rounded shadow-sm border border-gray-200 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={globalBackPreview} alt="Global Back" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Kart Yükleme Alanı */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Kart Tasarımları (Ön Yüz)</h2>
          
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            ref={fileInputRef}
            onChange={handleFrontUpload}
            className="hidden"
            id="front-upload"
          />
          <label 
            htmlFor="front-upload"
            className="cursor-pointer bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-sm flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Kart Ekle
          </label>
        </div>

        {cards.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center bg-gray-50">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-sm font-medium text-gray-900">Henüz kart eklemediniz</h3>
            <p className="mt-1 text-sm text-gray-500">Montaj için ön yüz görsellerinizi (JPG, PNG vb.) yükleyin.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {cards.map(card => (
              <div key={card.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow relative">
                
                {/* Sil Butonu */}
                <button 
                  onClick={() => removeCard(card.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white w-7 h-7 rounded-full flex items-center justify-center hover:bg-red-600 shadow-sm z-10"
                >
                  &times;
                </button>

                {/* Görsel */}
                <div className="aspect-[2.5/3.5] bg-gray-100 relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={card.frontPreview} alt="Card Front" className="w-full h-full object-cover" />
                </div>

                {/* Kontroller */}
                <div className="p-3 bg-gray-50 border-t border-gray-100 flex-1 flex flex-col">
                  
                  {/* Adet */}
                  <div className="flex items-center justify-between mb-3 bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <button 
                      onClick={() => updateCardCount(card.id, card.count - 1)}
                      className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 font-bold"
                    >-</button>
                    <span className="font-semibold text-gray-900">{card.count}</span>
                    <button 
                      onClick={() => updateCardCount(card.id, card.count + 1)}
                      className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 font-bold"
                    >+</button>
                  </div>

                  {/* Ayrı Arka Plan İsteniyorsa (Double & !GlobalBack) */}
                  {pageSettings.printType === 'double' && !globalBackMode && (
                    <div className="mt-auto">
                      <input 
                        type="file" 
                        accept="image/*" 
                        id={`back-${card.id}`}
                        className="hidden"
                        onChange={(e) => handleIndividualBackUpload(card.id, e)}
                      />
                      <label 
                        htmlFor={`back-${card.id}`}
                        className={`block text-center text-xs font-semibold py-1.5 rounded border border-dashed cursor-pointer transition-colors ${card.backPreview ? 'bg-green-50 border-green-300 text-green-700' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                      >
                        {card.backPreview ? 'Arka Yüz Yüklendi (Değiştir)' : '+ Özel Arka Yüz Yükle'}
                      </label>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
