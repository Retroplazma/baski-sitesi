'use client';

import React, { useState, useRef } from 'react';
import { useBoxCoverStore, BoxImages } from '@/store/useBoxCoverStore';
import ImageCropper from '@/components/ImageCropper';

type Position = 'center' | 'top' | 'bottom' | 'left' | 'right' | 'all_sides';
type CoverType = 'lid' | 'base';

const WRAP_MM = 15;

export default function BoxCoverLayout() {
  const store = useBoxCoverStore();
  const { dimensions, baseImages, lidImages, setImage, setCurrentStep, mirrorEdges, setMirrorEdges } = store;
  
  const [editingInfo, setEditingInfo] = useState<{ type: CoverType, pos: Position } | null>(null);
  const [tempSrc, setTempSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pan / Zoom state
  const [zoomLevel, setZoomLevel] = useState(0.8);

  // Dimensions
  const H = dimensions.height;
  const H_WITH_WRAP = H + WRAP_MM;

  const lidW = dimensions.width + 3;
  const lidL = dimensions.length + 3;
  const baseW = dimensions.width;
  const baseL = dimensions.length;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && editingInfo) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setTempSrc(url);
    }
  };

  const openUploader = (type: CoverType, pos: Position) => {
    setEditingInfo({ type, pos });
    fileInputRef.current?.click();
  };

  const [selectedSide, setSelectedSide] = useState<{type: CoverType, pos: 'top'|'bottom'|'left'|'right'} | null>(null);

  const applyToTargets = async (type: CoverType, sourcePos: 'top' | 'bottom' | 'left' | 'right', srcUrl: string, targets: Array<'top'|'bottom'|'left'|'right'>) => {
    try {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = srcUrl;
      });

      const effectiveW = type === 'base' ? baseW : lidW;
      const effectiveL = type === 'base' ? baseL : lidL;

      const angles = { top: 0, right: 90, bottom: 180, left: 270 };
      const sourceAngle = angles[sourcePos];

      const rotateAndFit = (targetPos: 'top' | 'bottom' | 'left' | 'right'): Promise<string> => {
        return new Promise((resolve) => {
          const targetAngle = angles[targetPos];
          let rotation = targetAngle - sourceAngle;
          if (rotation < 0) rotation += 360;

          const tempCanvas = document.createElement('canvas');
          
          let targetW, targetH;
          if (targetPos === 'top' || targetPos === 'bottom') {
             targetW = effectiveW;
             targetH = H_WITH_WRAP;
          } else {
             targetW = H_WITH_WRAP;
             targetH = effectiveL;
          }

          // Use a scale factor for high quality output (e.g. 11.811 for 300 DPI)
          const SCALE = 11.811;

          tempCanvas.width = targetW * SCALE;
          tempCanvas.height = targetH * SCALE;

          const tCtx = tempCanvas.getContext('2d')!;
          tCtx.translate((targetW * SCALE) / 2, (targetH * SCALE) / 2);
          tCtx.rotate((rotation * Math.PI) / 180);

          let unrotatedW = targetW;
          let unrotatedH = targetH;
          if (rotation === 90 || rotation === 270) {
            unrotatedW = targetH;
            unrotatedH = targetW;
          }

          tCtx.drawImage(img, (-unrotatedW * SCALE) / 2, (-unrotatedH * SCALE) / 2, unrotatedW * SCALE, unrotatedH * SCALE);

          tempCanvas.toBlob(blob => {
            if (blob) resolve(URL.createObjectURL(blob));
          }, 'image/jpeg', 0.9);
        });
      };

      for (const target of targets) {
        if (target === sourcePos) continue; // no need to re-apply to self
        const url = await rotateAndFit(target);
        setImage(type, target, url);
      }

      // setSelectedSide(null); // Optional: deselect after applying

    } catch (err) {
      console.error(err);
      alert("Kenarlar oluşturulurken hata oluştu.");
    }
  };

  const applyToOpposite = (type: CoverType, sourcePos: 'top'|'bottom'|'left'|'right', srcUrl: string) => {
    const opposites: Record<string, 'top'|'bottom'|'left'|'right'> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };
    applyToTargets(type, sourcePos, srcUrl, [opposites[sourcePos]]);
  };

  const applyToAll = (type: CoverType, sourcePos: 'top'|'bottom'|'left'|'right', srcUrl: string) => {
    applyToTargets(type, sourcePos, srcUrl, ['top', 'bottom', 'left', 'right']);
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    if (editingInfo) {
      const url = URL.createObjectURL(croppedBlob);
      setImage(editingInfo.type, editingInfo.pos as keyof BoxImages, url);
      // Auto-select the side so action buttons appear immediately
      if (editingInfo.pos !== 'center') {
        setSelectedSide({ type: editingInfo.type, pos: editingInfo.pos as any });
      }
    }
    setEditingInfo(null);
    setTempSrc(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCancelCrop = () => {
    setEditingInfo(null);
    setTempSrc(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (type: CoverType, pos: Position, e: React.MouseEvent) => {
    e.stopPropagation();
    setImage(type, pos as keyof BoxImages, null);
    if (selectedSide?.type === type && selectedSide?.pos === pos) {
      setSelectedSide(null);
    }
  };

  const handleSideClick = (type: CoverType, pos: 'top'|'bottom'|'left'|'right', hasImage: boolean) => {
    if (hasImage) {
      setSelectedSide({ type, pos });
    } else {
      openUploader(type, pos);
    }
  };

  const isLidComplete = lidImages.center && lidImages.top && lidImages.bottom && lidImages.left && lidImages.right;
  const isBaseComplete = baseImages.center && baseImages.top && baseImages.bottom && baseImages.left && baseImages.right;
  const isComplete = isLidComplete && isBaseComplete;

  const renderLayout = (type: CoverType) => {
    const images = type === 'base' ? baseImages : lidImages;
    const effectiveW = type === 'base' ? baseW : lidW;
    const effectiveL = type === 'base' ? baseL : lidL;

    const baseSize = 250; 
    const maxDim = Math.max(effectiveW, effectiveL);
    const scale = baseSize / maxDim;

    const vw = effectiveW * scale;
    const vl = effectiveL * scale;
    const vh = H_WITH_WRAP * scale;
    const vFold = H * scale; // Fold line position from the inner edge

    const totalW = vw + 2 * vh;
    const totalL = vl + 2 * vh;

    return (
      <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-200 min-w-max">
        <div className="flex justify-between w-full mb-6 items-center">
          <h3 className="text-xl font-bold text-gray-800">
            {type === 'lid' ? 'Üst Kapak (Lid)' : 'Alt Kutu (Base)'}
          </h3>
        </div>

        <div className="relative" style={{ width: totalW, height: totalL }}>
          
          {/* Center */}
          <div 
            onClick={() => openUploader(type, 'center')}
            className="absolute group border border-dashed border-gray-400 bg-gray-50 flex items-center justify-center cursor-pointer overflow-hidden transition-all hover:border-indigo-400 hover:bg-indigo-50"
            style={{ left: vh, top: vh, width: vw, height: vl }}
          >
            {images.center ? (
              <>
                <img src={images.center} alt="Center" className="w-full h-full object-cover" />
                <button onClick={(e) => removeImage(type, 'center', e)} className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs">&times;</button>
              </>
            ) : (
              <div className="text-center text-gray-400 group-hover:text-indigo-500">
                <svg className="w-8 h-8 mx-auto mb-1 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                <span className="text-xs font-bold block">Merkez</span>
                <span className="text-[10px]">{effectiveW}x{effectiveL}</span>
              </div>
            )}
          </div>

          {/* Top */}
          <div 
            onClick={() => handleSideClick(type, 'top', !!images.top)}
            className={`absolute group border border-dashed bg-gray-50 flex items-center justify-center cursor-pointer overflow-hidden transition-all hover:bg-indigo-50 
              ${selectedSide?.type === type && selectedSide?.pos === 'top' ? 'border-indigo-500 border-2 z-30 ring-2 ring-indigo-200' : 'border-gray-400 hover:border-indigo-400'}`}
            style={{ left: vh, top: 0, width: vw, height: vh }}
          >
            {images.top && <img src={images.top} alt="Top" className="absolute inset-0 w-full h-full object-cover" />}
            
            {/* Wrap fold line (drawn H mm from the bottom edge of this side) */}
            <div className="absolute left-0 right-0 border-t-2 border-dashed border-gray-400/80 z-10 pointer-events-none" style={{ bottom: vFold }}></div>
            <div className="absolute inset-0 flex flex-col items-center justify-between py-1 z-0 pointer-events-none">
              <span className="text-[10px] font-bold text-gray-500 bg-white/70 px-1 rounded">İçe Kıvrılacak ({WRAP_MM}mm)</span>
              {!images.top && <span className="text-xs font-bold text-gray-400 mb-2">Üst Yüzey ({H}mm)</span>}
            </div>
          </div>

          {/* Bottom */}
          <div 
            onClick={() => handleSideClick(type, 'bottom', !!images.bottom)}
            className={`absolute group border border-dashed bg-gray-50 flex items-center justify-center cursor-pointer overflow-hidden transition-all hover:bg-indigo-50 
              ${selectedSide?.type === type && selectedSide?.pos === 'bottom' ? 'border-indigo-500 border-2 z-30 ring-2 ring-indigo-200' : 'border-gray-400 hover:border-indigo-400'}`}
            style={{ left: vh, top: vh + vl, width: vw, height: vh }}
          >
            {images.bottom && <img src={images.bottom} alt="Bottom" className="absolute inset-0 w-full h-full object-cover" />}
            
            {/* Wrap fold line (drawn H mm from the top edge of this side) */}
            <div className="absolute left-0 right-0 border-b-2 border-dashed border-gray-400/80 z-10 pointer-events-none" style={{ top: vFold }}></div>
            <div className="absolute inset-0 flex flex-col items-center justify-between py-1 z-0 pointer-events-none">
              {!images.bottom && <span className="text-xs font-bold text-gray-400 mt-2">Alt Yüzey ({H}mm)</span>}
              <span className="text-[10px] font-bold text-gray-500 bg-white/70 px-1 rounded">İçe Kıvrılacak ({WRAP_MM}mm)</span>
            </div>
          </div>

          {/* Left */}
          <div 
            onClick={() => handleSideClick(type, 'left', !!images.left)}
            className={`absolute group border border-dashed bg-gray-50 flex items-center justify-center cursor-pointer overflow-hidden transition-all hover:bg-indigo-50 
              ${selectedSide?.type === type && selectedSide?.pos === 'left' ? 'border-indigo-500 border-2 z-30 ring-2 ring-indigo-200' : 'border-gray-400 hover:border-indigo-400'}`}
            style={{ left: 0, top: vh, width: vh, height: vl }}
          >
            {images.left && <img src={images.left} alt="Left" className="absolute inset-0 w-full h-full object-cover" />}
            
            {/* Wrap fold line (drawn H mm from the right edge of this side) */}
            <div className="absolute top-0 bottom-0 border-l-2 border-dashed border-gray-400/80 z-10 pointer-events-none" style={{ right: vFold }}></div>
            
            {/* Wrap text (rotated for left side, aligned left) */}
            <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center z-0 pointer-events-none" style={{ width: vh - vFold }}>
              <span className="text-[10px] font-bold text-gray-500 bg-white/70 px-1 py-0.5 rounded -rotate-90 whitespace-nowrap">İçe Kıvrılacak</span>
            </div>
            <div className="absolute right-0 top-0 bottom-0 flex items-center justify-center z-0 pointer-events-none" style={{ width: vFold }}>
              {!images.left && <span className="text-xs font-bold text-gray-400 -rotate-90 whitespace-nowrap">Sol Yüzey ({H}mm)</span>}
            </div>
          </div>

          {/* Right */}
          <div 
            onClick={() => handleSideClick(type, 'right', !!images.right)}
            className={`absolute group border border-dashed bg-gray-50 flex items-center justify-center cursor-pointer overflow-hidden transition-all hover:bg-indigo-50 
              ${selectedSide?.type === type && selectedSide?.pos === 'right' ? 'border-indigo-500 border-2 z-30 ring-2 ring-indigo-200' : 'border-gray-400 hover:border-indigo-400'}`}
            style={{ left: vh + vw, top: vh, width: vh, height: vl }}
          >
            {images.right && <img src={images.right} alt="Right" className="absolute inset-0 w-full h-full object-cover" />}
            
            {/* Wrap fold line (drawn H mm from the left edge of this side) */}
            <div className="absolute top-0 bottom-0 border-r-2 border-dashed border-gray-400/80 z-10 pointer-events-none" style={{ left: vFold }}></div>
            
            {/* Wrap text (rotated for right side, aligned right) */}
            <div className="absolute right-0 top-0 bottom-0 flex items-center justify-center z-0 pointer-events-none" style={{ width: vh - vFold }}>
              <span className="text-[10px] font-bold text-gray-500 bg-white/70 px-1 py-0.5 rounded rotate-90 whitespace-nowrap">İçe Kıvrılacak</span>
            </div>
            <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center z-0 pointer-events-none" style={{ width: vFold }}>
              {!images.right && <span className="text-xs font-bold text-gray-400 rotate-90 whitespace-nowrap">Sağ Yüzey ({H}mm)</span>}
            </div>
          </div>

        </div>
        
        {/* Action Bar for Selected Side */}
        {selectedSide && selectedSide.type === type && images[selectedSide.pos] && (
          <div className="mt-8 p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex flex-col xl:flex-row items-center gap-4 justify-between w-full shadow-sm">
             <div className="font-bold text-indigo-900 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
               Seçili Kenar: {
                 selectedSide.pos === 'top' ? 'Üst' : 
                 selectedSide.pos === 'bottom' ? 'Alt' : 
                 selectedSide.pos === 'left' ? 'Sol' : 'Sağ'
               }
             </div>
             <div className="flex flex-wrap items-center justify-center gap-2">
                <button 
                  onClick={() => applyToAll(selectedSide.type, selectedSide.pos, images[selectedSide.pos]!)} 
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold shadow-sm hover:bg-indigo-700 transition-colors"
                >
                  Tüm Kenarlara Uygula
                </button>
                <button 
                  onClick={() => applyToOpposite(selectedSide.type, selectedSide.pos, images[selectedSide.pos]!)} 
                  className="px-4 py-2 bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold shadow-sm hover:bg-indigo-200 transition-colors"
                >
                  Karşı Kenara Uygula
                </button>
                <div className="w-px h-6 bg-indigo-200 mx-1"></div>
                <button 
                  onClick={() => openUploader(selectedSide.type, selectedSide.pos)} 
                  className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors"
                >
                  Değiştir
                </button>
                <button 
                  onClick={(e) => { removeImage(selectedSide.type, selectedSide.pos, e); setSelectedSide(null); }} 
                  className="px-4 py-2 bg-white text-red-600 border border-red-200 rounded-lg text-xs font-bold hover:bg-red-50 transition-colors"
                >
                  Sil
                </button>
             </div>
          </div>
        )}
      </div>
    );
  };

  let editAspect = 1;
  if (editingInfo) {
    const effectiveW = editingInfo.type === 'base' ? baseW : lidW;
    const effectiveL = editingInfo.type === 'base' ? baseL : lidL;
    
    if (editingInfo.pos === 'center') editAspect = effectiveW / effectiveL;
    else if (editingInfo.pos === 'top' || editingInfo.pos === 'bottom') editAspect = effectiveW / H_WITH_WRAP;
    else editAspect = H_WITH_WRAP / effectiveL;
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 h-full flex flex-col min-h-screen">
      
      <div className="w-full flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Görsel Yerleşimi (Kutu Açınımı)</h2>
          <p className="text-sm text-gray-500 mt-1">
            Alt Kutu ve Üst Kapak tasarımınızı tamamlayın. Çalışma alanını fareyle sürükleyebilir ve yakınlaştırabilirsiniz.
          </p>
        </div>
        <div className="flex gap-3 bg-white p-2 rounded-xl shadow-sm border border-gray-200">
          <button onClick={() => setZoomLevel(z => Math.max(0.5, z - 0.2))} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700" title="Uzaklaştır">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"></path></svg>
          </button>
          <span className="flex items-center text-sm font-bold text-gray-600 px-2">{Math.round(zoomLevel * 100)}%</span>
          <button onClick={() => setZoomLevel(z => Math.min(2, z + 0.2))} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700" title="Yakınlaştır">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>
          </button>
        </div>
      </div>

      {/* Modal for Cropper */}
      {tempSrc && editingInfo && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-900">
                {editingInfo.type === 'lid' ? 'Üst Kapak' : 'Alt Kutu'} - 
                {editingInfo.pos === 'center' ? ' Ana Görseli' : 
                 editingInfo.pos === 'top' ? ' Üst Kenarı' : 
                 editingInfo.pos === 'bottom' ? ' Alt Kenarı' : 
                 editingInfo.pos === 'left' ? ' Sol Kenarı' : ' Sağ Kenarı'} Kırp
              </h3>
              <button onClick={handleCancelCrop} className="text-gray-400 hover:text-red-500 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <div className="flex-1 relative bg-gray-900">
              <ImageCropper
                imageSrc={tempSrc}
                aspectRatio={
                  editingInfo.pos === 'center'
                    ? (editingInfo.type === 'base' ? baseW : lidW) / (editingInfo.type === 'base' ? baseL : lidL)
                    : (editingInfo.pos === 'top' || editingInfo.pos === 'bottom')
                    ? (editingInfo.type === 'base' ? baseW : lidW) / H_WITH_WRAP
                    : H_WITH_WRAP / (editingInfo.type === 'base' ? baseL : lidL)
                }
                wrapConfig={
                  editingInfo
                    ? { pos: editingInfo.pos, ratio: WRAP_MM / H_WITH_WRAP }
                    : undefined
                }
                onCropComplete={handleCropComplete}
                onCancel={handleCancelCrop}
              />
            </div>
          </div>
        </div>
      )}

      <input 
        type="file" 
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Pan / Zoom Area */}
      <div className="flex-1 overflow-auto bg-gray-200/50 rounded-2xl border border-gray-300 relative shadow-inner mb-6 w-full h-[500px] cursor-move">
        <div 
          className="p-10 flex flex-col xl:flex-row items-center xl:items-start justify-center gap-12 min-h-full transition-transform duration-200 ease-out origin-top-left"
          style={{ transform: `scale(${zoomLevel})`, width: 'max-content' }}
        >
          {renderLayout('lid')}
          {renderLayout('base')}
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="checkbox" 
            checked={mirrorEdges}
            onChange={(e) => setMirrorEdges(e.target.checked)}
            className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-600"
          />
          <span className="text-sm font-medium text-gray-700">Kenarları otomatik oluştururken resmi aynala (Mirror Bleed)</span>
        </label>

        <button
          onClick={() => setCurrentStep(3)}
          disabled={!isComplete}
          className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          Önizleme ve Sepet (Takım)
          <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
        </button>
      </div>

    </div>
  );
}
