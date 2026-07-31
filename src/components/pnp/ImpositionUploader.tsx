"use client";

import { usePnpImpositionStore } from "@/store/usePnpImpositionStore";
import { useCallback, useRef, useState } from "react";

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
    setGlobalBackFile,
    setCards
  } = usePnpImpositionStore();

  const [isSplitterOpen, setIsSplitterOpen] = useState(false);
  const [splitCols, setSplitCols] = useState(1);
  const [splitRows, setSplitRows] = useState(1);
  const [isSplitting, setIsSplitting] = useState(false);
  const [splitFile, setSplitFile] = useState<File | null>(null);

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSplitFile(e.target.files[0]);
    } else {
      setSplitFile(null);
    }
  };

  const handleSplitAction = async () => {
    if (!splitFile) {
      alert("Lütfen önce bir görsel (Sprite Sheet) yükleyin.");
      return;
    }
    
    if (splitCols < 1 || splitRows < 1) {
      alert("Satır ve sütun sayısı en az 1 olmalıdır.");
      return;
    }
    
    setIsSplitting(true);
    try {
      const objectUrl = URL.createObjectURL(splitFile);
      const img = new Image();
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = objectUrl;
      });

      const cardWidth = img.width / splitCols;
      const cardHeight = img.height / splitRows;
      const newCards: any[] = [];

      const canvas = document.createElement('canvas');
      canvas.width = cardWidth;
      canvas.height = cardHeight;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) throw new Error("Canvas context oluşturulamadı");

      for (let r = 0; r < splitRows; r++) {
        for (let c = 0; c < splitCols; c++) {
          ctx.clearRect(0, 0, cardWidth, cardHeight);
          ctx.drawImage(
            img,
            c * cardWidth, r * cardHeight, cardWidth, cardHeight,
            0, 0, cardWidth, cardHeight
          );

          const blob = await new Promise<Blob | null>(res => canvas.toBlob(res, 'image/png'));
          if (blob) {
            const splitFile = new File([blob], `split_${r}_${c}.png`, { type: 'image/png' });
            const previewUrl = URL.createObjectURL(splitFile);
            
            newCards.push({
              id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              frontFile: splitFile,
              backFile: null,
              count: 1,
              frontPreview: previewUrl
            });
          }
        }
      }
      
      setCards([...cards, ...newCards]);
      
      alert(`${newCards.length} adet kart başarıyla bölündü ve eklendi!`);
      setIsSplitterOpen(false);
      setSplitFile(null); // Reset selection after success
      
    } catch (error) {
      console.error("Görsel bölünürken hata oluştu:", error);
      alert("Görsel bölünürken bir hata oluştu.");
    } finally {
      setIsSplitting(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8">
      
      {/* Görsel Bölme (Toplu Yükleme) Aracı */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm mb-8">
        <button 
          onClick={() => setIsSplitterOpen(!isSplitterOpen)}
          className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 text-indigo-600 p-2 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 text-left">Görseli Bölerek Ekle (Toplu Yükleme)</h2>
              <p className="text-sm text-gray-500">Tek bir görsel içinde dizili birden fazla kartı otomatik parçalayın.</p>
            </div>
          </div>
          <svg className={`w-5 h-5 text-gray-400 transform transition-transform ${isSplitterOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </button>

        {isSplitterOpen && (
          <div className="p-6 border-t border-gray-100 bg-white">
            <div className="grid md:grid-cols-2 gap-6 items-end">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Görsel (Sprite Sheet) Yükle</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileSelect}
                  disabled={isSplitting}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 disabled:opacity-50"
                  id="split-upload"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Sütun Sayısı (Cols)</label>
                  <input 
                    type="number" 
                    min="1" 
                    value={splitCols} 
                    onChange={(e) => setSplitCols(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Satır Sayısı (Rows)</label>
                  <input 
                    type="number" 
                    min="1" 
                    value={splitRows} 
                    onChange={(e) => setSplitRows(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                onClick={handleSplitAction}
                disabled={isSplitting || !splitFile}
                className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSplitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Görsel parçalanıyor, lütfen bekleyin...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                    Görseli Parçala ve Kartlara Ekle
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

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

                  {/* Ortak Arka Plan Seç Butonu (Double & GlobalBack) */}
                  {pageSettings.printType === 'double' && globalBackMode && (
                    <div className="mt-auto">
                      <button 
                        onClick={() => {
                          setGlobalBackFile(card.frontFile, card.frontPreview);
                          alert("Arka plan başarıyla ayarlandı!");
                        }}
                        className="w-full text-xs py-1.5 px-2 bg-orange-100 text-orange-700 font-semibold rounded border border-orange-200 hover:bg-orange-200 transition-colors"
                      >
                        Bunu Ortak Arka Yüz Yap
                      </button>
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
