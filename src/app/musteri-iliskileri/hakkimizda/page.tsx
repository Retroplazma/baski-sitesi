export default function HakkimizdaPage() {
  return (
    <div className="prose prose-orange max-w-none text-gray-700">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Hakkımızda</h1>
      
      <p className="mb-6 text-lg font-medium text-gray-900 leading-relaxed">
        Sanatı dijital dünyadan çıkarıp, dokunabileceğiniz fiziksel eserlere dönüştüren yolculuğumuza hoş geldiniz. Baskı Atölyesi, Eğitimto Derneği'nin bir iştiraki olarak kurulan, eğitime ve sanata destek vizyonu taşıyan bir "Anı Atölyesi"dir.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Vizyonumuz</h2>
          <p className="mb-4">
            Anıların sadece ekranlarda veya telefon hafızalarında kalmasına karşı çıkıyoruz. İnsanların sevdikleriyle geçirdiği anıları, sanatsal bir çerçeveye veya özenle hazırlanmış bir baskıya dönüştürerek duvarlarına ve hayatlarına dahil etmelerini sağlamak en büyük vizyonumuz.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Misyonumuz</h2>
          <p className="mb-4">
            Eğitimto Derneği çatısı altında, elde edilen gelirlerin bir kısmıyla dezavantajlı bölgelerdeki okullara sanat ve eğitim desteği sağlamayı amaçlıyoruz. Bizden alacağınız her baskı, sadece duvarınızı süslemekle kalmıyor, aynı zamanda eğitime de doğrudan bir katkıya dönüşüyor.
          </p>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Kalite Anlayışımız</h2>
      <p className="mb-4">
        Yüksek çözünürlüklü teknolojik baskı makinelerimiz ve alanında uzman grafik tasarım ekibimizle, renklerin en doğru, malzemenin en kaliteli halini sunuyoruz. Çevreye duyarlı (ekolojik) mürekkepler kullanıyor, sürdürülebilirlik ilkesiyle hareket ediyoruz. 
      </p>
      <p className="mb-4">
        Siz hayal edin, dosyanızı yükleyin; biz en yüksek endüstri standartlarında üretip kapınıza getirelim.
      </p>
    </div>
  );
}
