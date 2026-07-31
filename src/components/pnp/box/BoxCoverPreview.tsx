'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useBoxCoverStore, BoxImages } from '@/store/useBoxCoverStore';
import { useCartStore } from '@/store/cartStore';
import { PDFDocument } from 'pdf-lib';

export default function BoxCoverPreview() {
  const { dimensions, baseImages, lidImages, setCurrentStep } = useBoxCoverStore();
  const cartStore = useCartStore();
  
  const baseCanvasRef = useRef<HTMLCanvasElement>(null);
  const lidCanvasRef = useRef<HTMLCanvasElement>(null);
  
  const [basePreviewUrl, setBasePreviewUrl] = useState<string | null>(null);
  const [lidPreviewUrl, setLidPreviewUrl] = useState<string | null>(null);
  
  const [isGenerating, setIsGenerating] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Constants
  const MM_TO_PX = 11.811; // 300 DPI
  const WRAP_MM = 15;
  const H = dimensions.height;
  
  const baseW = dimensions.width;
  const baseL = dimensions.length;
  
  const lidW = dimensions.width + 3;
  const lidL = dimensions.length + 3;

  const paperShort = 330;
  const paperLong = 480;

  useEffect(() => {
    generateAllCanvases();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const generateSingleCanvas = async (
    canvas: HTMLCanvasElement, 
    images: BoxImages, 
    W: number, 
    L: number,
    setPreview: (url: string) => void
  ) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const totalW_MM = W + (2 * H) + (2 * WRAP_MM);
    const totalL_MM = L + (2 * H) + (2 * WRAP_MM);
    
    const isPortrait = totalW_MM <= paperShort && totalL_MM <= paperLong;
    const paperW_MM = isPortrait ? paperShort : paperLong;
    const paperL_MM = isPortrait ? paperLong : paperShort;

    canvas.width = Math.round(paperW_MM * MM_TO_PX);
    canvas.height = Math.round(paperL_MM * MM_TO_PX);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const layoutW_px = totalW_MM * MM_TO_PX;
    const layoutL_px = totalL_MM * MM_TO_PX;
    const startX = Math.round((canvas.width - layoutW_px) / 2);
    const startY = Math.round((canvas.height - layoutL_px) / 2);

    const [imgCenter, imgTop, imgBottom, imgLeft, imgRight] = await Promise.all([
      loadImage(images.center!),
      loadImage(images.top!),
      loadImage(images.bottom!),
      loadImage(images.left!),
      loadImage(images.right!),
    ]);

    const drawImg = (img: HTMLImageElement, x_mm: number, y_mm: number, w_mm: number, l_mm: number) => {
      ctx.drawImage(img, startX + x_mm * MM_TO_PX, startY + y_mm * MM_TO_PX, w_mm * MM_TO_PX, l_mm * MM_TO_PX);
    };

    // Center
    drawImg(imgCenter, WRAP_MM + H, WRAP_MM + H, W, L);

    // Sides (now include wrap areas within their cropped dimensions)
    drawImg(imgTop, WRAP_MM + H, 0, W, H + WRAP_MM);
    drawImg(imgBottom, WRAP_MM + H, WRAP_MM + H + L, W, H + WRAP_MM);
    drawImg(imgLeft, 0, WRAP_MM + H, H + WRAP_MM, L);
    drawImg(imgRight, WRAP_MM + H + W, WRAP_MM + H, H + WRAP_MM, L);

    // Corner Tabs
    ctx.fillStyle = '#f3f4f6';
    const drawTab = (points: [number, number][]) => {
      ctx.beginPath();
      ctx.moveTo(startX + points[0][0] * MM_TO_PX, startY + points[0][1] * MM_TO_PX);
      for (let i = 1; i < points.length; i++) ctx.lineTo(startX + points[i][0] * MM_TO_PX, startY + points[i][1] * MM_TO_PX);
      ctx.closePath();
      ctx.fill();
      
      // Make tab outlines dashed
      ctx.save();
      ctx.setLineDash([5 * MM_TO_PX, 5 * MM_TO_PX]);
      ctx.strokeStyle = 'rgba(156, 163, 175, 0.8)';
      ctx.lineWidth = 0.5 * MM_TO_PX;
      ctx.stroke();
      ctx.restore();
    };

    drawTab([[WRAP_MM + H, WRAP_MM + H], [WRAP_MM, WRAP_MM + H], [WRAP_MM + H, WRAP_MM]]);
    drawTab([[WRAP_MM + H, WRAP_MM + H + L], [WRAP_MM, WRAP_MM + H + L], [WRAP_MM + H, WRAP_MM + H + L + H]]);
    drawTab([[WRAP_MM + H + W, WRAP_MM + H], [WRAP_MM + H + W + H, WRAP_MM + H], [WRAP_MM + H + W, WRAP_MM]]);
    drawTab([[WRAP_MM + H + W, WRAP_MM + H + L], [WRAP_MM + H + W + H, WRAP_MM + H + L], [WRAP_MM + H + W, WRAP_MM + H + L + H]]);

    // Fold Lines
    ctx.beginPath();
    ctx.setLineDash([]); // Solid line
    ctx.strokeStyle = 'rgba(120, 120, 120, 0.7)'; // Gray
    ctx.lineWidth = 0.1 * MM_TO_PX; // Very thin (0.1mm)

    const drawDashedLine = (x1: number, y1: number, x2: number, y2: number) => {
      ctx.moveTo(startX + x1 * MM_TO_PX, startY + y1 * MM_TO_PX);
      ctx.lineTo(startX + x2 * MM_TO_PX, startY + y2 * MM_TO_PX);
    };

    // Center rectangle lines removed as requested by user.

    // Wrap lines
    drawDashedLine(WRAP_MM + H, WRAP_MM, WRAP_MM + H + W, WRAP_MM); 
    drawDashedLine(WRAP_MM + H, WRAP_MM + H + L + H, WRAP_MM + H + W, WRAP_MM + H + L + H); 
    drawDashedLine(WRAP_MM, WRAP_MM + H, WRAP_MM, WRAP_MM + H + L); 
    drawDashedLine(WRAP_MM + H + W + H, WRAP_MM + H, WRAP_MM + H + W + H, WRAP_MM + H + L); 

    ctx.stroke();
    ctx.setLineDash([]);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setPreview(dataUrl);
  };

  const generateAllCanvases = async () => {
    try {
      if (baseCanvasRef.current) await generateSingleCanvas(baseCanvasRef.current, baseImages, baseW, baseL, setBasePreviewUrl);
      if (lidCanvasRef.current) await generateSingleCanvas(lidCanvasRef.current, lidImages, lidW, lidL, setLidPreviewUrl);
    } catch (error) {
      console.error("Canvas oluşturulurken hata:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      if (!baseCanvasRef.current || !lidCanvasRef.current) return;

      const pdfDoc = await PDFDocument.create();
      
      const addCanvasToPdf = async (canvas: HTMLCanvasElement) => {
          // Convert canvas to high-res JPEG
          const imgData = canvas.toDataURL('image/jpeg', 0.95);
          const img = await pdfDoc.embedJpg(imgData);
          
          // Calculate paper dimensions based on the canvas orientation
          const mm2pt = 2.83465;
          const isLandscape = canvas.width > canvas.height;
          const wPt = (isLandscape ? paperLong : paperShort) * mm2pt;
          const hPt = (isLandscape ? paperShort : paperLong) * mm2pt;
          
          const page = pdfDoc.addPage([wPt, hPt]);
          // Draw the image exactly matching the page dimensions
          page.drawImage(img, { x: 0, y: 0, width: wPt, height: hPt });
      };

      await addCanvasToPdf(lidCanvasRef.current);
      await addCanvasToPdf(baseCanvasRef.current);

      const pdfBytes = await pdfDoc.save();
      const pdfBlob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      const pdfFileUrl = URL.createObjectURL(pdfBlob);

      // Generate a thumbnail JPG for the cart UI
      const baseJpgBlob = await new Promise<Blob | null>(res => baseCanvasRef.current!.toBlob(res, 'image/jpeg', 0.8));
      const baseFileUrl = baseJpgBlob ? URL.createObjectURL(baseJpgBlob) : '';

      cartStore.addToCart({
        id: `boxcover-${Date.now()}`,
        productId: 'pnp-custom',
        name: `Özel Kutu Kaplama Takımı (Taban + Kapak) - İç Ölçü: ${dimensions.width}x${dimensions.length}x${dimensions.height}mm.`,
        price: 99.80, // Set placeholder price
        quantity: 1,
        customImage: baseFileUrl, // Base as main thumbnail
        customImages: [pdfFileUrl], // The real print-ready PDF
        variants: {},
      });

      // Show cart drawer/popup instead of navigating to 404 page
      cartStore.openCart();
      
    } catch (err) {
      console.error(err);
      alert('Sepete eklerken hata oluştu.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Sonuç ve Önizleme</h2>
          <p className="mt-2 text-gray-600">33x48 cm baskı tabakaları üzerinde şablonlarınız hazırlandı.</p>
        </div>

        <canvas ref={lidCanvasRef} className="hidden"></canvas>
        <canvas ref={baseCanvasRef} className="hidden"></canvas>

        {isGenerating ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl shadow-sm border border-gray-200">
            <svg className="animate-spin h-12 w-12 text-indigo-600 mb-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <p className="text-lg font-bold text-gray-900">Baskı Dosyaları Oluşturuluyor...</p>
            <p className="text-gray-500">Bu işlem bilgisayarınızın hızına bağlı olarak birkaç saniye sürebilir.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-10 items-start">
            
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-3xl shadow-md border border-gray-200 relative overflow-hidden group">
                <h4 className="font-bold text-gray-700 mb-2 px-2">Üst Kapak (Lid)</h4>
                {lidPreviewUrl && <img src={lidPreviewUrl} alt="Lid Preview" className="w-full h-auto rounded-2xl shadow-inner border border-gray-100" />}
              </div>
              
              <div className="bg-white p-4 rounded-3xl shadow-md border border-gray-200 relative overflow-hidden group">
                <h4 className="font-bold text-gray-700 mb-2 px-2">Alt Kutu (Base)</h4>
                {basePreviewUrl && <img src={basePreviewUrl} alt="Base Preview" className="w-full h-auto rounded-2xl shadow-inner border border-gray-100" />}
              </div>
            </div>

            <div className="space-y-6 sticky top-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg text-gray-900 mb-4">Şablon Detayları</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex justify-between border-b border-gray-50 pb-2">
                    <span>Ürün</span>
                    <span className="font-bold text-gray-900">Alt Kutu + Üst Kapak Takımı</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-50 pb-2">
                    <span>Alt Kutu İç Ölçüsü</span>
                    <span className="font-bold text-gray-900">{dimensions.width} x {dimensions.length} x {dimensions.height} mm</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-50 pb-2">
                    <span>Üst Kapak İç Ölçüsü</span>
                    <span className="font-bold text-gray-900">{lidW} x {lidL} x {dimensions.height} mm</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-50 pb-2">
                    <span>Kıvrılma Payı (Wrap)</span>
                    <span className="font-bold text-gray-900">{WRAP_MM} mm (İçe Katlama)</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-50 pb-2">
                    <span>Çözünürlük</span>
                    <span className="font-bold text-gray-900">300 DPI Yüksek Kalite</span>
                  </li>
                </ul>

                <div className="mt-6 bg-indigo-50 text-indigo-700 p-4 rounded-xl text-sm font-medium">
                  <p>✓ Alt ve Üst kapaklar 2 adet 33x48 cm tabakaya yerleştirildi.</p>
                  <p>✓ Yapıştırma kulakçıkları (45°) eklendi.</p>
                  <p>✓ Katlama çizgileri yerleştirildi.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-4 bg-white text-gray-700 font-bold rounded-xl border-2 border-gray-200 hover:bg-gray-50 transition-colors w-1/3 text-center"
                >
                  Geri Dön
                </button>
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 text-lg"
                >
                  {isAddingToCart ? (
                    <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                  )}
                  {isAddingToCart ? 'Ekleniyor...' : 'Sepete Ekle (Takım)'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
