import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mesafeli Satış Sözleşmesi - Baskı Atölyesi',
  description: 'Baskı Atölyesi mesafeli satış sözleşmesi ve kullanım şartları.',
};

export default function MesafeliSatisPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <article className="prose prose-slate lg:prose-lg max-w-none prose-headings:text-slate-900 prose-p:text-slate-700">
        <h1>Mesafeli Satış Sözleşmesi</h1>
        
        <h2>Madde 1 - Taraflar</h2>
        <h3>SATICI:</h3>
        <p>
          <strong>Unvanı:</strong> Baskı Atölyesi<br />
          <strong>Adresi:</strong> İzmir, Türkiye<br />
          <strong>Telefon:</strong> +90 535 293 16 58<br />
          <strong>E-posta:</strong> info@sode.com.tr
        </p>
        <h3>ALICI:</h3>
        <p>Siparişi veren ve ödemeyi yapan gerçek veya tüzel kişi müşteri.</p>

        <h2>Madde 2 - Sözleşmenin Konusu</h2>
        <p>
          İşbu sözleşmenin konusu, ALICI'nın SATICI'ya ait www.baski-atolyesi.com internet sitesinden elektronik ortamda siparişini yaptığı ürünlerin satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerinin saptanmasıdır.
        </p>

        <h2>Madde 3 - Sipariş ve Teslimat Süreci</h2>
        <p>
          ALICI'nın yüklediği tasarımlar veya siteden seçtiği şablonlar, ödeme yapıldıktan sonra SATICI tarafından üretime alınır. Üretim süreci tamamlanan ürün, ALICI'nın belirttiği teslimat adresine anlaşmalı kargo şirketleri aracılığıyla teslim edilir.
        </p>

        <h2>Madde 4 - Cayma Hakkı ve İstisnalar</h2>
        <p>
          İşbu sözleşmeye konu olan ürünler ALICI'nın istekleri veya kişisel ihtiyaçları doğrultusunda özel olarak üretildiği (özel baskı, ebatlama vb.) için Tüketicinin Korunması Hakkında Kanun gereği <strong>CAYMA HAKKI KULLANILAMAZ</strong>. Üretim veya kargo kaynaklı (hatalı baskı, yırtılma vb.) durumlarda ürün birebir değiştirilir veya iade alınır.
        </p>

        <h2>Madde 5 - Fikri ve Sınai Mülkiyet Hakları ve İçerik Sorumluluğu</h2>
        <ol>
          <li><strong>İçeriklerin Mülkiyeti ve İzin Beyanı:</strong> ALICI, siteye yüklediği, gönderdiği veya basılmasını talep ettiği her türlü tasarım, logo, fotoğraf, çizim, metin ve kutu oyunu materyalinin ("İçerik") yasal sahibi olduğunu veya FSEK ve SMK kapsamında eser/marka sahibinden gerekli tüm çoğaltma, işleme ve yayma izinlerini yazılı olarak aldığını beyan ve taahhüt eder.</li>
          <li><strong>Münhasır Sorumluluk ve Rücu Hakkı:</strong> Yüklenen İçerik'in üçüncü kişilerin telif, marka veya patent haklarını ihlal etmesi durumunda doğacak her türlü hukuki, cezai ve mali sorumluluk münhasıran ALICI'ya aittir. SATICI'nın uğrayacağı her türlü zarar (tazminat, idari para cezası, avukatlık ücreti), SATICI'nın ilk talebinde ALICI tarafından nakden ve defaten ödenecektir.</li>
          <li><strong>Siparişi Reddetme ve İptal Hakkı:</strong> SATICI; yasaya, genel ahlaka aykırı bulduğu veya üçüncü kişilerin fikri haklarını ihlal ettiğinden şüphe duyduğu (bilindik marka logoları, lisanslı kutu oyunları vb.) siparişleri dilediği zaman reddetme, basım işlemini durdurma ve sözleşmeyi feshetme hakkını saklı tutar.</li>
          <li><strong>Yasal Makamlarla Bilgi Paylaşımı:</strong> Telif hakkı ihlali şüphesi veya yasal talep halinde SATICI, ALICI'ya ait IP adresi, kimlik ve yüklenen dosyaları adli/idari mercilerle paylaşma hakkına sahiptir.</li>
        </ol>
      </article>
    </div>
  );
}
