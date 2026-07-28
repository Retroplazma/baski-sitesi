import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'İptal ve İade Şartları - Baskı Atölyesi',
  description: 'Baskı Atölyesi iptal ve iade şartları detayları.',
};

export default function IptalIadePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <article className="prose prose-slate lg:prose-lg max-w-none prose-headings:text-slate-900 prose-p:text-slate-700">
        <h1>İptal ve İade Şartları</h1>
        
        <p>
          Baskı Atölyesi olarak önceliğimiz müşteri memnuniyetidir. Sitemizde yer alan ve tamamen sizin yüklediğiniz tasarımlarla, kişiye özel olarak üretilen ürünler, 6502 sayılı yasa gereğince cayma hakkının kullanılamayacağı ürünler kapsamındadır. Bu nedenle, tasarım veya ölçü kaynaklı kullanıcı hatalarında iade yapılamamaktadır.
        </p>
        <p>
          Ancak; baskıda belirgin renk kayması, kargo sırasında ürünün hasar görmesi veya yanlış ürün gönderilmesi durumlarında koşulsuz şartsız yeniden üretim veya iade sağlanır.
        </p>
        <p>
          Sorun yaşamanız halinde ürünü teslim aldığınız tarihten itibaren 14 gün içerisinde, hasarlı/hatalı ürünün net görselleriyle birlikte <a href="mailto:info@sode.com.tr">info@sode.com.tr</a> adresine e-posta göndermeniz yeterlidir.
        </p>
      </article>
    </div>
  );
}
