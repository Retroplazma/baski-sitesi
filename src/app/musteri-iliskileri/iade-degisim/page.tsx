export default function IadeDegisimPage() {
  return (
    <div className="prose prose-orange max-w-none text-gray-700">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">İade ve Değişim Politikası</h1>
      <p className="mb-4 font-medium text-gray-900">
        Baskı Atölyesi olarak önceliğimiz %100 müşteri memnuniyetidir. İade ve değişim süreçlerimiz, Mesafeli Sözleşmeler Yönetmeliği ve Tüketicinin Korunması Hakkında Kanun çerçevesinde yürütülmektedir.
      </p>
      
      <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Kişiye Özel Ürünlerde İade</h2>
      <p className="mb-4">
        Sitemizde yer alan ve tamamen <strong>sizin yüklediğiniz tasarımlarla, kişiye veya firmaya özel olarak üretilen</strong> (posterler, tablolar, baskılı kupa vb.) ürünler, 6502 sayılı yasa gereğince cayma hakkının kullanılamayacağı ürünler kapsamındadır. Bu nedenle, tasarım veya ölçü kaynaklı kullanıcı hatalarında (düşük çözünürlüklü görsel yükleme, yanlış ebat seçimi) iade yapılamamaktadır.
      </p>

      <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Üretim veya Kargo Kaynaklı Hatalar</h2>
      <p className="mb-4">
        Ancak, aşağıda belirtilen üretim veya kargo kaynaklı durumlarda ürünlerin iadesi veya yeniden üretimi <strong>koşulsuz şartsız sağlanmaktadır:</strong>
      </p>
      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li>Baskıda belirgin renk kayması, solukluk veya kalite problemi olması.</li>
        <li>Ürünün kargo sırasında ezilmiş, yırtılmış veya kırılmış olması.</li>
        <li>Sipariş verilen üründen farklı veya eksik ürün gönderilmesi.</li>
      </ul>

      <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">İade/Değişim Süreci Nasıl İşler?</h2>
      <ol className="list-decimal pl-6 space-y-3">
        <li>Ürünü teslim aldığınız tarihten itibaren <strong>14 gün içerisinde</strong> Bize Ulaşın sayfası veya info@baskiatolyesi.com adresi üzerinden sorunu anlatan bir e-posta gönderin.</li>
        <li>E-postanıza mutlaka hasarlı/hatalı ürünün net görsellerini ekleyin.</li>
        <li>Müşteri temsilcilerimiz en geç 24 saat içerisinde başvurunuzu inceleyecek ve size bir iade kodu iletecektir.</li>
        <li>Anlaşmalı kargo firmamızla ürünü ücretsiz olarak bize geri gönderebilir veya (duruma göre) yenisinin tarafınıza hemen basılıp gönderilmesini talep edebilirsiniz.</li>
      </ol>
    </div>
  );
}
