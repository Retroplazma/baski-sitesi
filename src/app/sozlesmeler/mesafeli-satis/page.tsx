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
      </article>
    </div>
  );
}
