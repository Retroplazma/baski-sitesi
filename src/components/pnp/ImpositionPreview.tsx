"use client";

import { usePnpImpositionStore } from "@/store/usePnpImpositionStore";
import { useEffect, useState } from "react";
import { PDFDocument, rgb, degrees } from 'pdf-lib';
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";

export default function ImpositionPreview() {
  const { pageSettings, layout, cards, globalBackMode, globalBackFile, cropMarks } = usePnpImpositionStore();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addToCart = useCartStore(state => state.addToCart);
  const openCart = useCartStore(state => state.openCart);
  const router = useRouter();

  // Utility to convert File to ArrayBuffer
  const fileToArrayBuffer = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const generatePDF = async (returnBlobOnly: boolean = false) => {
    setIsGenerating(true);
    setError(null);
    try {
      const pdfDoc = await PDFDocument.create();

      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16) / 255,
          g: parseInt(result[2], 16) / 255,
          b: parseInt(result[3], 16) / 255
        } : { r: 0, g: 0, b: 0 };
      };

      const cColor = hexToRgb(cropMarks.color);
      const markColor = rgb(cColor.r, cColor.g, cColor.b);
      const markThickness = cropMarks.thickness;
      const markLen = 14.17; // ~5mm in points


      // Calculate layout points based on pdf-lib (Points = mm * 2.83465)
      const MM_TO_PT = 2.83465;
      const paperW = layout.paperWidthMm * MM_TO_PT;
      const paperH = layout.paperHeightMm * MM_TO_PT;
      const cardW = pageSettings.cardWidth * MM_TO_PT;
      const cardH = pageSettings.cardHeight * MM_TO_PT;
      const gapX = pageSettings.gapX * MM_TO_PT;
      const gapY = pageSettings.gapY * MM_TO_PT;
      const marginX = layout.marginX * MM_TO_PT;
      const marginY = layout.marginY * MM_TO_PT;

      const itemsPerPage = layout.cols * layout.rows;
      if (itemsPerPage === 0) throw new Error("Kağıda kart sığmıyor.");

      // Flatten cards based on count
      const flatCards: any[] = [];
      for (const card of cards) {
        for (let i = 0; i < card.count; i++) {
          flatCards.push(card);
        }
      }

      // Cache embedded images to avoid duplicating same image bytes in PDF
      const imageCache = new Map<string, any>();

      const embedImage = async (file: File) => {
        // file.name + size as simple cache key
        const key = `${file.name}-${file.size}`;
        if (imageCache.has(key)) return imageCache.get(key);

        const buffer = await fileToArrayBuffer(file);
        let img;
        if (file.type === 'image/png') img = await pdfDoc.embedPng(buffer);
        else img = await pdfDoc.embedJpg(buffer); // Assuming JPG as fallback

        imageCache.set(key, img);
        return img;
      };

      const drawCropMarksOnPage = (page: any, isBackPage: boolean) => {
        if (!cropMarks.enabled) return;
        if (cropMarks.side === 'front' && isBackPage) return;
        if (cropMarks.side === 'back' && !isBackPage) return;

        const { style } = cropMarks;

        // X coordinate cut lines
        const xLines: number[] = [];
        for (let c = 0; c < layout.cols; c++) {
          const xLeft = marginX + c * (cardW + gapX);
          const xRight = xLeft + cardW;
          xLines.push(xLeft);
          if (gapX > 0 || c === layout.cols - 1) xLines.push(xRight);
        }
        
        // Y coordinate cut lines
        const yLines: number[] = [];
        for (let r = 0; r < layout.rows; r++) {
          const yTop = paperH - (marginY + r * (cardH + gapY));
          const yBottom = yTop - cardH;
          yLines.push(yTop);
          if (gapY > 0 || r === layout.rows - 1) yLines.push(yBottom);
        }

        const unique = (arr: number[]) => {
          const res: number[] = [];
          for (const v of arr) {
            if (!res.some(existing => Math.abs(existing - v) < 0.1)) res.push(v);
          }
          return res;
        };

        const uXLines = unique(xLines);
        const uYLines = unique(yLines);

        if (style === 'continuous') {
          for (const x of uXLines) {
            page.drawLine({ start: { x, y: 0 }, end: { x, y: paperH }, thickness: markThickness, color: markColor });
          }
          for (const y of uYLines) {
            page.drawLine({ start: { x: 0, y }, end: { x: paperW, y }, thickness: markThickness, color: markColor });
          }
        } else if (style === 'cross') {
          for (const x of uXLines) {
            for (const y of uYLines) {
              page.drawLine({ start: { x: x - markLen/2, y }, end: { x: x + markLen/2, y }, thickness: markThickness, color: markColor });
              page.drawLine({ start: { x, y: y - markLen/2 }, end: { x, y: y + markLen/2 }, thickness: markThickness, color: markColor });
            }
          }
        } else if (style === 'corners') {
          // Standard corners (pointing outwards) for each card
          for (let c = 0; c < layout.cols; c++) {
            for (let r = 0; r < layout.rows; r++) {
              const xL = marginX + c * (cardW + gapX);
              const xR = xL + cardW;
              const yT = paperH - (marginY + r * (cardH + gapY));
              const yB = yT - cardH;

              // Top-Left corner (points UP and LEFT)
              page.drawLine({ start: { x: xL, y: yT }, end: { x: xL, y: yT + markLen }, thickness: markThickness, color: markColor });
              page.drawLine({ start: { x: xL, y: yT }, end: { x: xL - markLen, y: yT }, thickness: markThickness, color: markColor });

              // Top-Right corner (points UP and RIGHT)
              page.drawLine({ start: { x: xR, y: yT }, end: { x: xR, y: yT + markLen }, thickness: markThickness, color: markColor });
              page.drawLine({ start: { x: xR, y: yT }, end: { x: xR + markLen, y: yT }, thickness: markThickness, color: markColor });

              // Bottom-Left corner (points DOWN and LEFT)
              page.drawLine({ start: { x: xL, y: yB }, end: { x: xL, y: yB - markLen }, thickness: markThickness, color: markColor });
              page.drawLine({ start: { x: xL, y: yB }, end: { x: xL - markLen, y: yB }, thickness: markThickness, color: markColor });

              // Bottom-Right corner (points DOWN and RIGHT)
              page.drawLine({ start: { x: xR, y: yB }, end: { x: xR, y: yB - markLen }, thickness: markThickness, color: markColor });
              page.drawLine({ start: { x: xR, y: yB }, end: { x: xR + markLen, y: yB }, thickness: markThickness, color: markColor });
            }
          }
        }
      };

      const pagesCount = Math.ceil(flatCards.length / itemsPerPage);

      for (let p = 0; p < pagesCount; p++) {
        // --- ÖN SAYFA (FRONT) ---
        const page = pdfDoc.addPage([paperW, paperH]);
        const startIndex = p * itemsPerPage;
        const pageCards = flatCards.slice(startIndex, startIndex + itemsPerPage);

        for (let i = 0; i < pageCards.length; i++) {
          const card = pageCards[i];
          const col = i % layout.cols;
          const row = Math.floor(i / layout.cols);

          const x = marginX + col * (cardW + gapX);
          // pdf-lib y-axis starts from bottom. We draw from top-left.
          const y = paperH - (marginY + row * (cardH + gapY) + cardH);

          const img = await embedImage(card.frontFile as File);
          page.drawImage(img, { x, y, width: cardW, height: cardH });
        }

        // Önizleme Filigranı (Sadece returnBlobOnly false ise, yani gerçek baskıya gitmeyecekse önizlemedir)
        if (!returnBlobOnly) {
          page.drawText('ONIZLEME - BASKI ATOLYESI', {
            x: paperW / 2 - 200,
            y: paperH / 2 - 50,
            size: 50,
            color: rgb(0.8, 0.2, 0.2),
            opacity: 0.3,
            rotate: degrees(45),
          });
        }
        
        drawCropMarksOnPage(page, false);

        // --- ARKA SAYFA (BACK) ---
        if (pageSettings.printType === 'double') {
          const backPage = pdfDoc.addPage([paperW, paperH]);

          for (let i = 0; i < pageCards.length; i++) {
            const card = pageCards[i];
            const col = i % layout.cols;
            const row = Math.floor(i / layout.cols);

            // AYNALAMA (MIRROR) EFEKTİ: Arka sayfada kolonlar ters çevrilir.
            const mirroredCol = (layout.cols - 1) - col;

            const x = marginX + mirroredCol * (cardW + gapX);
            const y = paperH - (marginY + row * (cardH + gapY) + cardH);

            let backFile = null;
            if (globalBackMode) {
              backFile = globalBackFile;
            } else {
              backFile = card.backFile;
            }

            if (backFile) {
              const img = await embedImage(backFile as File);
              backPage.drawImage(img, { x, y, width: cardW, height: cardH });
            }
          }

          // Arka sayfa filigranı
          if (!returnBlobOnly) {
            backPage.drawText('ONIZLEME - BASKI ATOLYESI', {
              x: paperW / 2 - 200,
              y: paperH / 2 - 50,
              size: 50,
              color: rgb(0.8, 0.2, 0.2),
              opacity: 0.3,
              rotate: degrees(-45),
            });
          }
          
          drawCropMarksOnPage(backPage, true);
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });

      if (returnBlobOnly) {
        return { blob };
      }

      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setIsGenerating(false);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "PDF oluşturulurken bir hata oluştu. Görsellerinizin PNG veya JPG formatında olduğundan emin olun.");
      setIsGenerating(false);
    }
  };

  const uploadPdfToStorage = async (blob: Blob): Promise<string> => {
    // Dynamically import supabase to avoid breaking if it's not initialized
    const { supabase } = await import('@/lib/supabaseClient');
    const { v4: uuidv4 } = await import('uuid');

    const fileName = `imposition-${uuidv4()}.pdf`;
    const { data, error } = await supabase.storage
      .from('print-uploads')
      .upload(fileName, blob);

    if (error) {
      throw new Error(`PDF yüklenirken hata oluştu: ${error.message}`);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('print-uploads')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleCheckout = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      let finalBlob = null;

      // If PDF wasn't generated yet, generate it for upload
      if (!pdfUrl) {
        const generated = await generatePDF(true); // pass true to just return blob, not set state
        if (!generated) throw new Error("PDF oluşturulamadı.");
        finalBlob = generated.blob;
      } else {
        // If already generated, we need the blob. Since we have the URL, we can fetch it,
        // or we just regenerate it. Regenerating is safer to avoid CORS issues on blob urls in some browsers.
        const generated = await generatePDF(true);
        if (!generated) throw new Error("PDF oluşturulamadı.");
        finalBlob = generated.blob;
      }

      // Upload to Supabase
      const uploadedUrl = await uploadPdfToStorage(finalBlob);

      // Calculate total pages for checkout
      const totalCards = cards.reduce((sum, c) => sum + c.count, 0);
      let sheets = Math.ceil(totalCards / (layout.cols * layout.rows));

      // Basit bir fiyat hesaplama (Örn: Tabaka başı 50 TL + Çift yön için * 1.5)
      let unitPrice = 50;
      if (pageSettings.printType === 'double') unitPrice *= 1.5;
      if (pageSettings.pageSize === 'A3') unitPrice *= 2;
      if (pageSettings.pageSize === '33x48') unitPrice *= 2.5;

      const finalPrice = sheets * unitPrice;

      addToCart({
        id: `pnp-imposition-${Date.now()}`,
        productId: 'pnp-imposition',
        name: `Montajlı Print & Play Baskı (${pageSettings.pageSize})`,
        price: finalPrice,
        quantity: 1,
        customImage: uploadedUrl, // Admin panel can download this URL
        variants: {
          'Kağıt Boyutu': pageSettings.pageSize,
          'Baskı Yönü': pageSettings.printType === 'single' ? 'Tek Yönlü' : 'Arkalı Önlü',
          'Hesaplanan Tabaka': sheets.toString(),
          'Toplam Kart': totalCards.toString(),
          'Tasarım Dosyası (PDF)': 'Yüklendi'
        }
      });

      openCart();
      router.push('/checkout');

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Sipariş oluşturulurken bir hata oluştu.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 md:p-8 flex flex-col h-full min-h-[600px]">

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Siparişi Tamamla</h2>
          <p className="text-gray-500 text-sm mt-1">Montajlı PDF dosyanız otomatik oluşturulup sepete eklenecektir.</p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => generatePDF(false)}
            disabled={isGenerating}
            className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors"
          >
            {isGenerating ? 'Bekleyiniz...' : (pdfUrl ? 'Önizlemeyi Yenile' : 'Önizleme Oluştur')}
          </button>

          <button
            onClick={handleCheckout}
            disabled={isGenerating}
            className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg shadow-sm hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? 'İşleniyor...' : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                Baskıya Gönder
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 mb-6 font-medium">
          {error}
        </div>
      )}

      {/* PDF Iframe */}
      <div className="flex-1 bg-gray-200 rounded-xl overflow-hidden border border-gray-300 relative shadow-inner flex items-center justify-center">
        {isGenerating ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm z-10">
            <svg className="animate-spin h-10 w-10 text-orange-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="font-bold text-gray-700">İşleniyor...</p>
            <p className="text-xs text-gray-500 mt-1">Lütfen bekleyiniz, işlem süresi görsellerin boyutuna bağlıdır.</p>
          </div>
        ) : null}

        {!pdfUrl && !isGenerating && (
          <div className="text-center p-8">
            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Önizleme Kapalı</h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
              Sistemi yavaşlatmamak için otomatik PDF oluşturma devre dışı bırakılmıştır. Tasarımlarınızın kağıda nasıl dizildiğini görmek isterseniz oluşturabilirsiniz.
            </p>
            <button
              onClick={() => generatePDF(false)}
              className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
            >
              Şimdi Önizleme Oluştur
            </button>
          </div>
        )}

        {pdfUrl && (
          <iframe
            src={`${pdfUrl}#toolbar=0&navpanes=0`}
            className="w-full h-full min-h-[500px]"
            title="PDF Preview"
          />
        )}
      </div>

    </div>
  );
}
