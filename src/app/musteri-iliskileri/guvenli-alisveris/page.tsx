export default function GuvenliAlisverisPage() {
  return (
    <div className="prose prose-orange max-w-none text-gray-700">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Güvenli Alışveriş</h1>
      
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mb-8 flex items-start gap-4">
        <div className="bg-blue-100 text-blue-600 p-3 rounded-full flex-shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-blue-900 mb-2">256-Bit SSL Sertifikası</h3>
          <p className="text-blue-800 text-sm">
            Baskı Atölyesi üzerinde yapacağınız tüm bilgi girişleri ve ödeme işlemleri dünyaca kabul görmüş 256-Bit SSL (Secure Socket Layer) teknolojisi ile şifrelenmektedir. Bilgileriniz tarayıcınızdan sunucularımıza ulaşana kadar kırılamaz bir şifreleme altındadır.
          </p>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Kredi Kartı Güvenliği (3D Secure)</h2>
      <p className="mb-4">
        Sitemizde yapacağınız tüm kredi kartı alışverişlerinde BDDK lisanslı ödeme kuruluşlarının altyapısı kullanılmaktadır. Kredi kartı bilgileriniz doğrudan bankanızın ekranlarına girilir, <strong>kredi kartı bilgileriniz hiçbir şekilde Baskı Atölyesi sunucularında tutulmaz, kaydedilmez ve saklanmaz.</strong>
      </p>
      <p className="mb-4">
        Ödeme işlemi sırasında bankanız tarafından cep telefonunuza gönderilen tek kullanımlık SMS şifresi (3D Secure) ile işleminizi doğrularsınız. Bu sayede kartınızın sizin bilginiz dışında kullanılması imkansız hale getirilir.
      </p>

      <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Kişisel Veri Güvenliği</h2>
      <p className="mb-4">
        Sisteme kayıt olurken kullandığınız e-posta, adres ve telefon numarası gibi kişisel bilgileriniz yüksek güvenlikli sunucularımızda barındırılmaktadır. KVKK politikamız gereği bu bilgiler sadece kargo firmaları ve yasal zorunluluk gerektiren kurumlarla (fatura süreçleri için) paylaşılır.
      </p>
    </div>
  );
}
