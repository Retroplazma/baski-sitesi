"use client";

import { usePnpImpositionStore } from "@/store/usePnpImpositionStore";
import { useEffect } from "react";

const PAPER_SIZES = {
  'A4': { width: 210, height: 297, label: 'A4 (210x297 mm)' },
  'A3': { width: 297, height: 420, label: 'A3 (297x420 mm)' },
  '33x48': { width: 330, height: 480, label: '33x48 (330x480 mm)' },
};

const TEMPLATES = [
  { name: 'Standart Poker', width: 63, height: 88 },
  { name: 'Tarot', width: 70, height: 120 },
  { name: 'Mini Oyun', width: 44, height: 68 },
  { name: 'Kare', width: 70, height: 70 },
];

export default function ImpositionSettings() {
  const { pageSettings, setPageSettings, layout, setLayout, cropMarks, setCropMarks } = usePnpImpositionStore();

  // Recalculate layout whenever settings change
  useEffect(() => {
    let paperW = PAPER_SIZES[pageSettings.pageSize].width;
    let paperH = PAPER_SIZES[pageSettings.pageSize].height;

    if (pageSettings.orientation === 'landscape') {
      const temp = paperW;
      paperW = paperH;
      paperH = temp;
    }

    const { cardWidth, cardHeight, gapX, gapY } = pageSettings;

    // Check if valid dimensions
    if (!cardWidth || !cardHeight || cardWidth <= 0 || cardHeight <= 0) {
      setLayout({ cols: 0, rows: 0, marginX: 0, marginY: 0, paperWidthMm: paperW, paperHeightMm: paperH });
      return;
    }

    // Formula: cols * w + (cols-1) * gapX <= paperW
    const cols = Math.floor((paperW + gapX) / (cardWidth + gapX));
    const rows = Math.floor((paperH + gapY) / (cardHeight + gapY));

    const finalCols = Math.max(0, cols);
    const finalRows = Math.max(0, rows);

    const usedWidth = finalCols > 0 ? (finalCols * cardWidth + (finalCols - 1) * gapX) : 0;
    const usedHeight = finalRows > 0 ? (finalRows * cardHeight + (finalRows - 1) * gapY) : 0;

    const marginX = (paperW - usedWidth) / 2;
    const marginY = (paperH - usedHeight) / 2;

    setLayout({
      cols: finalCols,
      rows: finalRows,
      marginX,
      marginY,
      paperWidthMm: paperW,
      paperHeightMm: paperH,
    });
  }, [pageSettings, setLayout]);

  const hUpdate = (field: keyof typeof pageSettings, value: any) => {
    setPageSettings({ [field]: value });
  };

  return (
    <div className="p-6 md:p-8 grid md:grid-cols-2 gap-12">
      
      {/* Sol: Ayarlar Formu */}
      <div className="space-y-8">
        
        {/* Kağıt Ayarları */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            Kağıt ve Yön
          </h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Kağıt Boyutu</label>
              <select 
                value={pageSettings.pageSize}
                onChange={(e) => hUpdate('pageSize', e.target.value)}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 py-2.5 px-3"
              >
                {Object.entries(PAPER_SIZES).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Yön</label>
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => hUpdate('orientation', 'portrait')}
                  className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${pageSettings.orientation === 'portrait' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Dikey
                </button>
                <button
                  type="button"
                  onClick={() => hUpdate('orientation', 'landscape')}
                  className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${pageSettings.orientation === 'landscape' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Yatay
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Kart Ayarları */}
        <div className="pt-6 border-t border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path></svg>
            Kart Boyutları
          </h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Genişlik (mm)</label>
              <input 
                type="number" 
                value={pageSettings.cardWidth}
                onChange={(e) => hUpdate('cardWidth', Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 py-2.5 px-3"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Yükseklik (mm)</label>
              <input 
                type="number" 
                value={pageSettings.cardHeight}
                onChange={(e) => hUpdate('cardHeight', Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 py-2.5 px-3"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-3">
            {TEMPLATES.map(t => (
              <button
                key={t.name}
                type="button"
                onClick={() => {
                  hUpdate('cardWidth', t.width);
                  hUpdate('cardHeight', t.height);
                }}
                className="text-xs font-medium px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full hover:bg-orange-100 hover:text-orange-700 transition-colors border border-gray-200"
              >
                {t.name} ({t.width}x{t.height})
              </button>
            ))}
          </div>
        </div>

        {/* Boşluk Ayarları */}
        <div className="pt-6 border-t border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
            Boşluk ve Tür
          </h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Yatay Boşluk (mm)</label>
              <input 
                type="number" 
                value={pageSettings.gapX}
                onChange={(e) => hUpdate('gapX', Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 py-2.5 px-3"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Dikey Boşluk (mm)</label>
              <input 
                type="number" 
                value={pageSettings.gapY}
                onChange={(e) => hUpdate('gapY', Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 py-2.5 px-3"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Baskı Türü</label>
            <div className="flex gap-4">
              <label className={`flex-1 border rounded-lg p-3 text-center cursor-pointer transition-colors ${pageSettings.printType === 'single' ? 'bg-orange-50 border-orange-500 text-orange-700 font-bold' : 'border-gray-200 hover:bg-gray-50'}`}>
                <input type="radio" name="printType" className="hidden" checked={pageSettings.printType === 'single'} onChange={() => hUpdate('printType', 'single')} />
                Tek Yönlü
              </label>
              <label className={`flex-1 border rounded-lg p-3 text-center cursor-pointer transition-colors ${pageSettings.printType === 'double' ? 'bg-orange-50 border-orange-500 text-orange-700 font-bold' : 'border-gray-200 hover:bg-gray-50'}`}>
                <input type="radio" name="printType" className="hidden" checked={pageSettings.printType === 'double'} onChange={() => hUpdate('printType', 'double')} />
                Arkalı Önlü
              </label>
            </div>
          </div>
        </div>

        {/* Kesim Çizgileri (Kros) Ayarları */}
        <div className="pt-6 border-t border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg>
              Kesim Çizgileri (Kros)
            </h2>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={cropMarks.enabled} onChange={(e) => setCropMarks({ enabled: e.target.checked })} />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </div>

          {cropMarks.enabled && (
            <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-4 space-y-4 animate-in fade-in slide-in-from-top-2">
              
              {/* Konum */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Çizgi Konumu</label>
                <div className="flex bg-white border border-gray-200 p-1 rounded-lg">
                  <button type="button" onClick={() => setCropMarks({ side: 'both' })} className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${cropMarks.side === 'both' ? 'bg-orange-100 text-orange-700' : 'text-gray-500 hover:text-gray-700'}`}>Her İkisi</button>
                  <button type="button" onClick={() => setCropMarks({ side: 'front' })} className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${cropMarks.side === 'front' ? 'bg-orange-100 text-orange-700' : 'text-gray-500 hover:text-gray-700'}`}>Sadece Ön</button>
                  <button type="button" onClick={() => setCropMarks({ side: 'back' })} className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${cropMarks.side === 'back' ? 'bg-orange-100 text-orange-700' : 'text-gray-500 hover:text-gray-700'}`}>Sadece Arka</button>
                </div>
              </div>

              {/* Stil ve Renk */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Çizgi Stili</label>
                  <select value={cropMarks.style} onChange={(e) => setCropMarks({ style: e.target.value as any })} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 py-2 px-3 text-sm">
                    <option value="corners">Köşeler (L)</option>
                    <option value="cross">Artı (+)</option>
                    <option value="continuous">Boydan Boya (Izgara)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Çizgi Rengi</label>
                  <div className="flex gap-2">
                    {['#000000', '#FFFFFF', '#FF0000', '#808080'].map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setCropMarks({ color })}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${cropMarks.color === color ? 'border-orange-500 scale-110 shadow-sm' : 'border-gray-200 hover:scale-105'}`}
                        style={{ backgroundColor: color }}
                        aria-label={`Renk seç: ${color}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Kalınlık */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex justify-between">
                  <span>Çizgi Kalınlığı</span>
                  <span className="text-orange-600">{cropMarks.thickness.toFixed(1)} pt</span>
                </label>
                <input 
                  type="range" 
                  min="0.5" 
                  max="3.0" 
                  step="0.5"
                  value={cropMarks.thickness}
                  onChange={(e) => setCropMarks({ thickness: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
              </div>

            </div>
          )}
        </div>

      </div>

      {/* Sağ: Görsel Önizleme ve Kilitli Şema */}
      <div className="bg-gray-100 rounded-2xl p-6 flex flex-col justify-center border border-gray-200 relative">
        <div className="text-center mb-6">
          <h3 className="text-lg font-bold text-gray-800">Yerleşim Önizlemesi</h3>
          <p className="text-sm text-gray-500 mt-1">1 sayfaya sığan kart sayısı: <strong className="text-orange-600 text-lg">{layout.cols * layout.rows} Adet</strong></p>
          <p className="text-xs text-gray-400 mt-1">({layout.cols} Sütun x {layout.rows} Satır)</p>
        </div>

        {/* Paper Simulation */}
        <div className="flex items-center justify-center flex-1">
          {layout.cols > 0 && layout.rows > 0 ? (
            <div 
              className="bg-white shadow-md mx-auto relative border border-gray-300"
              style={{
                width: `${layout.paperWidthMm}px`,
                height: `${layout.paperHeightMm}px`,
                transform: `scale(${Math.min(1, 300 / Math.max(layout.paperWidthMm, layout.paperHeightMm))})`,
                transformOrigin: 'center center'
              }}
            >
              <div 
                className="absolute"
                style={{
                  top: `${layout.marginY}px`,
                  left: `${layout.marginX}px`,
                  display: 'grid',
                  gridTemplateColumns: `repeat(${layout.cols}, ${pageSettings.cardWidth}px)`,
                  gridTemplateRows: `repeat(${layout.rows}, ${pageSettings.cardHeight}px)`,
                  columnGap: `${pageSettings.gapX}px`,
                  rowGap: `${pageSettings.gapY}px`,
                }}
              >
                {Array.from({ length: layout.cols * layout.rows }).map((_, i) => (
                  <div key={i} className="bg-orange-200 border-2 border-orange-400 rounded-sm"></div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center text-red-500 font-bold bg-red-50 px-6 py-4 rounded-xl border border-red-200">
              Bu boyutlarla kağıda hiçbir kart sığmıyor! Lütfen değerleri kontrol edin.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
