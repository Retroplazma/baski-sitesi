export default function KargoPage() {
  return (
    <div className="prose prose-orange max-w-none text-gray-700">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Kargo ve Teslimat</h1>
      
      <p className="mb-6 font-medium text-gray-900">
        Baskı Atölyesi, dijital tasarımlarınızı en yüksek kalitede fiziksel ürünlere dönüştürürken zamanın sizin için ne kadar değerli olduğunun farkındadır.
      </p>

      <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Üretim ve Kargoya Veriliş Süreleri</h2>
      <p className="mb-4">
        Siparişleriniz, tasarım onayınızın ardından üretime alınır. Ürün tipine göre değişiklik göstermekle birlikte genel üretim sürelerimiz aşağıdaki gibidir:
      </p>
      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li><strong>Poster ve Fotoğraf Baskıları:</strong> Aynı gün veya ertesi iş günü kargoya verilir (Saat 14:00'e kadar verilen siparişlerde).</li>
        <li><strong>Kupa, Kanvas ve Özel Kesim Ürünler:</strong> Ortalama 1-2 iş günü içerisinde üretilip kargolanır.</li>
        <li><strong>Toplu Siparişler ve Kurumsal Baskılar:</strong> Adede ve ürün niteliğine göre 3-5 iş günü içerisinde kargoya teslim edilir.</li>
      </ul>

      <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Teslimat Süreci</h2>
      <p className="mb-4">
        Ürünleriniz kargoya teslim edildikten sonra bulunduğunuz ile ve ilçeye göre değişmekle birlikte Türkiye'nin her yerine <strong>ortalama 1 ila 3 iş günü</strong> içerisinde ulaşmaktadır. Mobil (kargo şubesinin haftanın belli günleri dağıtım yaptığı) bölgelerde bu süre değişiklik gösterebilir.
      </p>

      <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Kargo Takibi</h2>
      <p className="mb-4">
        Siparişiniz kargo firmasına teslim edildiği anda sistemde kayıtlı cep telefonunuza ve e-posta adresinize bir kargo takip numarası iletilir. Ayrıca sitemize üye girişi yaparak "Siparişlerim" bölümünden de kargonuzun güncel durumunu anlık olarak takip edebilirsiniz.
      </p>
    </div>
  );
}
