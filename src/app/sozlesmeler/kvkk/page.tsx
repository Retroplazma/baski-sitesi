import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'KVKK ve Gizlilik Politikası - Baskı Atölyesi',
  description: 'Baskı Atölyesi kişisel verilerin korunması ve gizlilik politikası.',
};

export default function KVKKPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <article className="prose prose-slate lg:prose-lg max-w-none prose-headings:text-slate-900 prose-p:text-slate-700">
        <h1>KVKK ve Gizlilik Politikası</h1>
        
        <p><strong>Veri Sorumlusu:</strong> Baskı Atölyesi</p>
        
        <p>
          6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, kişisel verileriniz veri sorumlusu olarak Baskı Atölyesi tarafından işlenebilecektir.
        </p>
        <p>
          Sitemize üye olmanız veya alışveriş yapmanız durumunda; Ad Soyad, TCKN (fatura için), E-posta adresi, Telefon numarası ve Adres bilgileriniz işlenmektedir. Bu veriler yalnızca mal/hizmet satış süreçlerinin yürütülmesi, siparişlerin kargo ile ulaştırılması ve fatura süreçleri için işlenir.
        </p>
        <p>
          Toplanan verileriniz sadece teslimat için kargo firmalarıyla ve yasal yükümlülükler için kamu kurumlarıyla paylaşılır. Kesinlikle üçüncü şahıslara ticari amaçla satılmaz.
        </p>
        <p>
          KVKK'nın 11. maddesi kapsamındaki haklarınızı kullanmak ve taleplerinizi iletmek için <a href="mailto:info@sode.com.tr">info@sode.com.tr</a> adresine e-posta gönderebilirsiniz.
        </p>
      </article>
    </div>
  );
}
