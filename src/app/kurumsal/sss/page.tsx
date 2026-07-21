export default function SSSPage() {
  const faqs = [
    {
      question: "Siparişim kaç günde ulaşır?",
      answer: "Siparişleriniz ortalama 1-2 iş günü içerisinde üretilerek kargoya teslim edilir. Kargo firmasının bulunduğunuz bölgeye göre teslimatı ise genellikle 1-3 iş günü sürmektedir."
    },
    {
      question: "Kendi resmimi yükleyebilir miyim?",
      answer: "Evet! Sitemizdeki ürünlerin pek çoğuna kendi fotoğraflarınızı veya tasarımlarınızı yükleyerek kişiye özel baskı alabilirsiniz."
    },
    {
      question: "Hangi kargo şirketiyle çalışıyorsunuz?",
      answer: "Siparişleriniz ağırlıklı olarak Yurtiçi Kargo ve MNG Kargo güvencesiyle sizlere ulaştırılmaktadır."
    },
    {
      question: "İade yapabilir miyim?",
      answer: "Kişiye özel baskılı ürünlerde tasarım veya ölçü kaynaklı iade kabul edilmemektedir. Ancak üretim hatası veya kargo hasarı durumlarında 14 gün içerisinde koşulsuz iade/değişim hakkınız bulunmaktadır."
    },
    {
      question: "Toplu siparişlerde indirim yapıyor musunuz?",
      answer: "Evet, kurumsal ve toplu siparişleriniz (50 adet ve üzeri) için özel fiyatlandırma yapmaktayız. 'Teklif İste' sayfamızdan bizimle iletişime geçebilirsiniz."
    }
  ];

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Sıkça Sorulan Sorular</h1>
      <p className="text-gray-600 mb-8">Baskı Atölyesi hakkında en çok merak edilen soruların cevaplarını aşağıda bulabilirsiniz.</p>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <details key={index} className="group bg-white border border-gray-200 rounded-lg shadow-sm [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-5 text-gray-900">
              <h2 className="font-medium text-lg">{faq.question}</h2>

              <span className="shrink-0 rounded-full bg-gray-50 p-1.5 text-gray-900 sm:p-3 group-open:bg-orange-50 group-open:text-orange-600 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5 shrink-0 transition duration-300 group-open:-rotate-180"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </summary>

            <div className="border-t border-gray-100 px-5 py-4 leading-relaxed text-gray-700 bg-gray-50/50">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
