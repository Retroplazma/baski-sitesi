import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kullanım Koşulları - Baskı Atölyesi',
  description: 'Baskı Atölyesi kullanım koşulları ve şartları.',
};

export default function KullanimKosullariPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <article className="prose prose-slate lg:prose-lg max-w-none prose-headings:text-slate-900 prose-p:text-slate-700">
        <h1>Kullanım Koşulları</h1>
        
        <p>
          Baskı Atölyesi web sitesine hoş geldiniz. Sitemizi kullanarak aşağıdaki şartları ve koşulları kabul etmiş sayılırsınız.
        </p>

        <h2>Genel Hükümler</h2>
        <p>
          Site üzerindeki tüm hizmetler, belirtilen şartlara uygun olarak sunulmaktadır. Sitenin kullanımı ile ilgili olarak geçerli olan tüm yasal mevzuata uymak kullanıcıların sorumluluğundadır.
        </p>

        <h2>Fikri ve Sınai Mülkiyet Hakları ve İçerik Sorumluluğu</h2>
        <ol>
          <li><strong>İçeriklerin Mülkiyeti ve İzin Beyanı:</strong> Kullanıcı, siteye yüklediği, gönderdiği veya basılmasını talep ettiği her türlü tasarım, logo, fotoğraf, çizim, metin ve kutu oyunu materyalinin ("İçerik") yasal sahibi olduğunu veya FSEK ve SMK kapsamında eser/marka sahibinden gerekli tüm çoğaltma, işleme ve yayma izinlerini yazılı olarak aldığını beyan ve taahhüt eder.</li>
          <li><strong>Münhasır Sorumluluk ve Rücu Hakkı:</strong> Yüklenen İçerik'in üçüncü kişilerin telif, marka veya patent haklarını ihlal etmesi durumunda doğacak her türlü hukuki, cezai ve mali sorumluluk münhasıran Kullanıcı'ya aittir. Baskı Atölyesi'nin uğrayacağı her türlü zarar (tazminat, idari para cezası, avukatlık ücreti), ilk talebinde Kullanıcı tarafından nakden ve defaten ödenecektir.</li>
          <li><strong>Siparişi Reddetme ve İptal Hakkı:</strong> Baskı Atölyesi; yasaya, genel ahlaka aykırı bulduğu veya üçüncü kişilerin fikri haklarını ihlal ettiğinden şüphe duyduğu (bilindik marka logoları, lisanslı kutu oyunları vb.) siparişleri dilediği zaman reddetme, basım işlemini durdurma ve sözleşmeyi feshetme hakkını saklı tutar.</li>
          <li><strong>Yasal Makamlarla Bilgi Paylaşımı:</strong> Telif hakkı ihlali şüphesi veya yasal talep halinde Baskı Atölyesi, Kullanıcı'ya ait IP adresi, kimlik ve yüklenen dosyaları adli/idari mercilerle paylaşma hakkına sahiptir.</li>
        </ol>
      </article>
    </div>
  );
}
