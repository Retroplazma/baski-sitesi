import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, UploadCloud, Paintbrush, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Nasıl Sipariş Verebilirim? - Baskı Atölyesi",
  description: "Baskı Atölyesi üzerinden nasıl sipariş oluşturabileceğinizi, tasarım onay sürecimizi ve iade koşullarımızı öğrenin.",
};

export default function HowToOrderPage() {
  const steps = [
    {
      id: 1,
      title: "Sepetinizi Oluşturun",
      description: "Geniş ürün yelpazemiz içerisinden dilediğiniz ürünü seçin ve ürüne uygulanacak olan tasarımı yükleyin.",
      icon: <ShoppingCart className="w-8 h-8 text-sky-500" />,
      color: "bg-sky-50",
      borderColor: "border-sky-200"
    },
    {
      id: 2,
      title: "Tasarım Yükleme ve Onay Süreci",
      description: "Tasarımlarınızı siparişinizi verirken yükleyebilirsiniz. Seçilen ürüne göre hızlı kontrol veya uzman grafiker kontrolü yapılır. Siparişlerim bölümünden ve e-posta yoluyla size baskınızı onaylamanız için bilgilendirme yapılır. Son halini görüp onayladıktan sonra ürün baskıya hazır hale gelir.",
      icon: <UploadCloud className="w-8 h-8 text-orange-500" />,
      color: "bg-orange-50",
      borderColor: "border-orange-200"
    },
    {
      id: 3,
      title: "Ücretsiz Tasarım Desteği",
      description: "Ürünün onaylanması süresince tarafınıza ürün baskısı ile ilgili geri dönütler yapılarak sizin onayınıza sunulacaktır.",
      icon: <Paintbrush className="w-8 h-8 text-purple-500" />,
      color: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      id: 4,
      title: "İade ve Güvence",
      description: "Eğer ürün baskısı sizin tarafınızdan onaylanmaz veya admin tarafından kabul edilmezse tarafınıza para iadesi yapılacaktır ve ürün basılmayacaktır.",
      icon: <ShieldCheck className="w-8 h-8 text-emerald-500" />,
      color: "bg-emerald-50",
      borderColor: "border-emerald-200"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="text-center space-y-6">
          <div className="flex justify-center mb-16 mt-8">
            <div className="w-[300px] flex justify-center">
              <Image 
                src="/logo.svg" 
                alt="Baskı Atölyesi" 
                width={300} 
                height={96} 
                className="h-24 w-auto scale-[2.5]"
                priority
              />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Nasıl Sipariş Verebilirim?
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hayalinizdeki tasarımları gerçeğe dönüştürmek çok kolay! 
            Baskı Atölyesi'nde sipariş süreciniz tamamen şeffaf ve sizin kontrolünüzdedir.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {steps.map((step) => (
            <div 
              key={step.id} 
              className={`relative p-8 rounded-2xl border ${step.borderColor} ${step.color} shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center`}
            >
              <div className="absolute -top-5 bg-white border-2 border-gray-900 rounded-full w-10 h-10 flex items-center justify-center font-bold text-gray-900 shadow-sm">
                {step.id}
              </div>
              <div className="mb-4 p-4 bg-white rounded-full shadow-sm">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-center shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Sipariş Vermeye Hazır Mısınız?
          </h2>
          <p className="text-slate-300 mb-8 max-w-xl mx-auto">
            Hemen ürünlerimizi inceleyin, tasarımınızı yükleyin ve gerisini uzman ekibimize bırakın.
          </p>
          <Link 
            href="/" 
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-bold rounded-xl text-slate-900 bg-orange-400 hover:bg-orange-300 md:py-4 md:text-lg md:px-10 transition-colors shadow-lg hover:shadow-xl"
          >
            Hemen Alışverişe Başla
          </Link>
        </div>

      </div>
    </div>
  );
}
