"use client";

import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { RotateCcw, RotateCw, FlipHorizontal, FlipVertical, AlertTriangle } from "lucide-react";

interface ImageCropperProps {
  imageSrc: string;
  aspectRatio: number;
  printWidth?: number | null;
  printHeight?: number | null;
  bleed?: number;
  onCropComplete: (croppedBlob: Blob) => void;
  onCancel: () => void;
}

const getRadianAngle = (degreeValue: number) => {
  return (degreeValue * Math.PI) / 180;
};

const rotateSize = (width: number, height: number, rotation: number) => {
  const rotRad = getRadianAngle(rotation);
  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
};

export default function ImageCropper({ 
  imageSrc, 
  aspectRatio, 
  printWidth, 
  printHeight, 
  bleed = 0,
  onCropComplete, 
  onCancel 
}: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [flip, setFlip] = useState({ horizontal: false, vertical: false });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropCompleteHandler = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: any,
    rotation: number,
    flip: { horizontal: boolean; vertical: boolean }
  ): Promise<Blob | null> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return null;

    const rotRad = getRadianAngle(rotation);
    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(image.width, image.height, rotation);

    canvas.width = bBoxWidth;
    canvas.height = bBoxHeight;

    ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
    ctx.rotate(rotRad);
    ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
    ctx.translate(-image.width / 2, -image.height / 2);

    ctx.drawImage(image, 0, 0);

    const croppedCanvas = document.createElement("canvas");
    const croppedCtx = croppedCanvas.getContext("2d");

    if (!croppedCtx) return null;

    croppedCanvas.width = pixelCrop.width;
    croppedCanvas.height = pixelCrop.height;

    croppedCtx.drawImage(
      canvas,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve) => {
      croppedCanvas.toBlob((blob) => {
        resolve(blob);
      }, "image/jpeg", 0.9);
    });
  };

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.src = url;
    });

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels, rotation, flip);
      if (croppedBlob) {
        onCropComplete(croppedBlob);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const safeZoneX = (printWidth && bleed) ? (bleed / (printWidth + bleed * 2)) * 100 : 5;
  const safeZoneY = (printHeight && bleed) ? (bleed / (printHeight + bleed * 2)) * 100 : 5;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <style>{`
        .custom-crop-area {
          border: 1px solid rgba(255, 255, 255, 0.5) !important;
        }
        .custom-crop-area::after {
          content: '';
          position: absolute;
          top: ${safeZoneY}%;
          left: ${safeZoneX}%;
          right: ${safeZoneX}%;
          bottom: ${safeZoneY}%;
          border: 2px dashed #ef4444;
          pointer-events: none;
        }
      `}</style>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl flex flex-col overflow-hidden max-h-screen">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">Resmi Kırp ve Düzenle</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="bg-amber-50 border-b border-amber-200 p-4 flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-900">
            <strong className="font-bold block mb-1">Tasarımınızı Kesim Çizgilerine Göre Ayarlayın</strong>
            Dış çerçeve ile kırmızı kesik çizgi arasındaki alan <strong>Taşma Payıdır</strong> ve baskı sonrası kesilerek atılacaktır. Önemli yazı ve logolarınızın kırmızı kesik çizginin (Güvenli Alan) içinde kaldığından, ancak arka plan renginizin en dış çerçeveye kadar taştığından emin olun.
          </div>
        </div>

        <div className="relative w-full h-[50vh] bg-gray-900">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspectRatio}
            transform={`translate(${crop.x}px, ${crop.y}px) rotate(${rotation}deg) scale(${zoom}) scaleX(${flip.horizontal ? -1 : 1}) scaleY(${flip.vertical ? -1 : 1})`}
            onCropChange={setCrop}
            onCropComplete={onCropCompleteHandler}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            classes={{ cropAreaClassName: "custom-crop-area" }}
          />
        </div>
        
        <div className="p-4 bg-white border-t flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
              <button onClick={() => setRotation((r) => r - 90)} className="p-2 text-gray-700 hover:bg-white rounded-md shadow-sm transition-all" title="Sola Döndür">
                <RotateCcw className="w-5 h-5" />
              </button>
              <button onClick={() => setRotation((r) => r + 90)} className="p-2 text-gray-700 hover:bg-white rounded-md shadow-sm transition-all" title="Sağa Döndür">
                <RotateCw className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
              <button onClick={() => setFlip(f => ({ ...f, horizontal: !f.horizontal }))} className={`p-2 rounded-md shadow-sm transition-all ${flip.horizontal ? 'bg-white text-sky-600' : 'text-gray-700 hover:bg-white'}`} title="Yatay Yansıt">
                <FlipHorizontal className="w-5 h-5" />
              </button>
              <button onClick={() => setFlip(f => ({ ...f, vertical: !f.vertical }))} className={`p-2 rounded-md shadow-sm transition-all ${flip.vertical ? 'bg-white text-sky-600' : 'text-gray-700 hover:bg-white'}`} title="Dikey Yansıt">
                <FlipVertical className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 min-w-[200px] flex flex-col gap-1">
              <div className="flex justify-between text-xs text-gray-500 font-bold">
                <span>Döndürme ({rotation}°)</span>
                <span onClick={() => setRotation(0)} className="cursor-pointer hover:text-sky-500">Sıfırla</span>
              </div>
              <input
                type="range"
                value={rotation}
                min={0}
                max={360}
                onChange={(e) => setRotation(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div className="flex-1 min-w-[200px] flex flex-col gap-1">
              <label className="text-xs text-gray-500 font-bold">Yakınlaştırma</label>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 mt-2">
            <button onClick={onCancel} className="px-6 py-2 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 transition-colors">
              İptal
            </button>
            <button onClick={handleConfirm} className="px-6 py-2 rounded-lg text-sm font-medium text-white bg-sky-500 hover:bg-sky-600 transition-colors">
              Onayla ve Yükle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
