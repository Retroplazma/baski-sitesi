'use client';

import React from 'react';
import Link from 'next/link';
import { useBoxCoverStore } from '@/store/useBoxCoverStore';
import BoxCoverSettings from '@/components/pnp/box/BoxCoverSettings';
import BoxCoverLayout from '@/components/pnp/box/BoxCoverLayout';
import BoxCoverPreview from '@/components/pnp/box/BoxCoverPreview';

export default function BoxCoverPage() {
  const { currentStep, setCurrentStep } = useBoxCoverStore();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Back Link */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Link href="/print-and-play" className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 mb-2">
              <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              PnP Menüsüne Dön
            </Link>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Kutu Kaplama (Sticker) Oluşturucu</h1>
            <p className="mt-2 text-lg text-gray-600">
              Kutu oyunlarınız için kalın mukavvaya sıvanacak 33x48 cm kapak şablonlarını otomatik hazırlayın.
            </p>
          </div>
        </div>

        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded"></div>
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-600 rounded transition-all duration-300"
              style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
            ></div>
            
            {[
              { num: 1, title: 'Ölçü Ayarları' },
              { num: 2, title: 'Görsel Yerleşimi' },
              { num: 3, title: 'Önizleme & Sepet' }
            ].map((step) => (
              <div key={step.num} className="relative z-10 flex flex-col items-center">
                <button
                  onClick={() => {
                    // Sadece geri gitmeye izin ver, ileri için form validasyonu gerekli
                    if (step.num < currentStep) setCurrentStep(step.num);
                  }}
                  disabled={step.num > currentStep}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors
                    ${currentStep === step.num ? 'bg-indigo-600 text-white shadow-lg ring-4 ring-indigo-100' : 
                      currentStep > step.num ? 'bg-indigo-600 text-white cursor-pointer' : 
                      'bg-white text-gray-400 border-2 border-gray-200 cursor-not-allowed'}`}
                >
                  {currentStep > step.num ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  ) : (
                    step.num
                  )}
                </button>
                <span className={`mt-3 text-sm font-semibold ${currentStep >= step.num ? 'text-gray-900' : 'text-gray-400'}`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          {currentStep === 1 && <BoxCoverSettings />}
          {currentStep === 2 && <BoxCoverLayout />}
          {currentStep === 3 && <BoxCoverPreview />}
        </div>
        
      </div>
    </div>
  );
}
