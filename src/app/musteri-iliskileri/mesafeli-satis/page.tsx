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

      <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Madde 5 - Fikri ve Sınai Mülkiyet Hakları ve İçerik Sorumluluğu</h2>
      <ol className="list-decimal pl-5 mb-4 space-y-2">
        <li><strong>İçeriklerin Mülkiyeti ve İzin Beyanı:</strong> ALICI, siteye yüklediği, gönderdiği veya basılmasını talep ettiği her türlü tasarım, logo, fotoğraf, çizim, metin ve kutu oyunu materyalinin ("İçerik") yasal sahibi olduğunu veya FSEK ve SMK kapsamında eser/marka sahibinden gerekli tüm çoğaltma, işleme ve yayma izinlerini yazılı olarak aldığını beyan ve taahhüt eder.</li>
        <li><strong>Münhasır Sorumluluk ve Rücu Hakkı:</strong> Yüklenen İçerik'in üçüncü kişilerin telif, marka veya patent haklarını ihlal etmesi durumunda doğacak her türlü hukuki, cezai ve mali sorumluluk münhasıran ALICI'ya aittir. SATICI'nın uğrayacağı her türlü zarar (tazminat, idari para cezası, avukatlık ücreti), SATICI'nın ilk talebinde ALICI tarafından nakden ve defaten ödenecektir.</li>
        <li><strong>Siparişi Reddetme ve İptal Hakkı:</strong> SATICI; yasaya, genel ahlaka aykırı bulduğu veya üçüncü kişilerin fikri haklarını ihlal ettiğinden şüphe duyduğu (bilindik marka logoları, lisanslı kutu oyunları vb.) siparişleri dilediği zaman reddetme, basım işlemini durdurma ve sözleşmeyi feshetme hakkını saklı tutar.</li>
        <li><strong>Yasal Makamlarla Bilgi Paylaşımı:</strong> Telif hakkı ihlali şüphesi veya yasal talep halinde SATICI, ALICI'ya ait IP adresi, kimlik ve yüklenen dosyaları adli/idari mercilerle paylaşma hakkına sahiptir.</li>
      </ol>
    </div>
  );
}
