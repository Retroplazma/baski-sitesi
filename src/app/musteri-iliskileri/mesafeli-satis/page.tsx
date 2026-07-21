export default function MesafeliSatisPage() {
  return (
    <div className="prose prose-orange max-w-none text-gray-700">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mesafeli Satış Sözleşmesi</h1>
      
      <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Madde 1 - Taraflar</h2>
      <p className="mb-4">
        <strong>SATICI:</strong><br />
        Unvanı: Eğitimto Derneği İktisadi İşletmesi (Baskı Atölyesi)<br />
        Adresi: Caferağa Mh. Şair Nefi Sk. No:46 D:5 Kadıköy/İstanbul<br />
        Telefon: 0850 241 0 232<br />
        E-posta: info@baskiatolyesi.com
      </p>
      <p className="mb-4">
        <strong>ALICI:</strong><br />
        Siparişi veren ve ödemeyi yapan, formlarda bilgileri bulunan gerçek veya tüzel kişi müşteri.
      </p>

      <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Madde 2 - Sözleşmenin Konusu</h2>
      <p className="mb-4">
        İşbu sözleşmenin konusu, ALICI'nın SATICI'ya ait www.baskiatolyesi.com internet sitesinden elektronik ortamda siparişini yaptığı ürünlerin satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerinin saptanmasıdır.
      </p>

      <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Madde 3 - Sipariş ve Teslimat Süreci</h2>
      <p className="mb-4">
        ALICI'nın yüklediği tasarımlar veya siteden seçtiği şablonlar, ödeme yapıldıktan sonra SATICI tarafından üretime alınır. Üretim süreci tamamlanan ürün, ALICI'nın belirttiği teslimat adresine anlaşmalı kargo şirketleri aracılığıyla teslim edilir. Kargo bedeli aksi belirtilmedikçe ALICI tarafından karşılanmaz, site üzerinde belirtilen tutarlara dahildir veya sipariş esnasında ayrıca tahsil edilir.
      </p>

      <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Madde 4 - Cayma Hakkı ve İstisnalar</h2>
      <p className="mb-4">
        İşbu sözleşmeye konu olan ürünler <strong>ALICI'nın istekleri veya kişisel ihtiyaçları doğrultusunda özel olarak üretildiği (özel baskı, ebatlama, isim yazımı vb.)</strong> için Tüketicinin Korunması Hakkında Kanun gereği <strong>CAYMA HAKKI KULLANILAMAZ.</strong> Üretim veya kargo kaynaklı (hatalı baskı, yırtılma vb.) durumlarda ürün birebir değiştirilir veya iade alınır.
      </p>
    </div>
  );
}
