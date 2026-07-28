import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hakkımızda - Baskı Atölyesi',
  description: 'Baskı Atölyesi vizyon, misyon ve kalite anlayışı.',
};

export default function HakkimizdaPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <article className="prose prose-slate lg:prose-lg max-w-none prose-headings:text-slate-900 prose-p:text-slate-700">
        <h1>Hakkımızda</h1>
        
        <p>
          Sanatı dijital dünyadan çıkarıp, dokunabileceğiniz fiziksel eserlere dönüştüren yolculuğumuza hoş geldiniz. Baskı Atölyesi, anılarınızı ve tasarımlarınızı en yüksek kaliteyle fiziksel ürünlere dönüştüren profesyonel bir baskı merkezidir.
        </p>
        
        <h2>Vizyonumuz ve Misyonumuz</h2>
        <p>
          Anıların sadece ekranlarda kalmasına karşı çıkıyoruz. İnsanların sevdikleriyle geçirdiği anıları, sanatsal bir çerçeveye veya özenle hazırlanmış bir baskıya dönüştürerek hayatlarına dahil etmelerini sağlamak en büyük amacımızdır.
        </p>
        
        <h2>Kalite Anlayışımız</h2>
        <p>
          Yüksek çözünürlüklü teknolojik baskı makinelerimiz ve uzman ekibimizle, renklerin en doğru, malzemenin en kaliteli halini sunuyoruz. Siz hayal edin, dosyanızı yükleyin; biz en yüksek endüstri standartlarında üretip kapınıza getirelim.
        </p>
      </article>
    </div>
  );
}
