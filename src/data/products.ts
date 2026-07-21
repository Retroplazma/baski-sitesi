export interface Category {
  slug: string;
  name: string;
}

export interface Variant {
  name: string;
  options: string[];
}

export interface QuantityOption {
  quantity: number;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  categorySlug: string;
  image: string;
  isNew?: boolean;
  isPopular?: boolean;
  basePrice?: number;
  variants?: Variant[];
  quantityOptions?: QuantityOption[];
}

export const CATEGORIES: Category[] = [
  { slug: 'yayin-ve-kirtasiye', name: 'Yayın ve Kırtasiye Ürünleri' },
  { slug: 'giyim-ve-tekstil', name: 'Giyim ve Tekstil Ürünleri' },
  { slug: 'ev-dekorasyonu', name: 'Ev Dekorasyonu ve Duvar Sanatı' },
  { slug: 'icecek-ve-mutfak', name: 'İçecek ve Mutfak Ürünleri' },
  { slug: 'teknoloji-aksesuarlari', name: 'Teknoloji Aksesuarları' },
  { slug: 'oyun-eglence-ve-hobi', name: 'Oyun, Eğlence ve Hobi' },
  { slug: 'gunluk-kullanim-ve-hediyelik', name: 'Günlük Kullanım ve Hediyelik' },
];

// Helper to generate some common variants
const TEXTILE_VARIANTS: Variant[] = [
  { name: 'Beden', options: ['S', 'M', 'L', 'XL', 'XXL'] },
  { name: 'Renk', options: ['Beyaz', 'Siyah', 'Gri Melanj', 'Lacivert'] }
];

const MUG_VARIANTS: Variant[] = [
  { name: 'Kupa Rengi', options: ['Beyaz', 'Siyah', 'Kırmızı İçi', 'Sarı İçi'] }
];

const POSTER_VARIANTS: Variant[] = [
  { name: 'Ebat', options: ['21x30 cm (A4)', '30x40 cm (A3)', '50x70 cm'] },
  { name: 'Çerçeve', options: ['Çerçevesiz', 'Siyah Ahşap Çerçeve', 'Beyaz Ahşap Çerçeve'] }
];

const DEFAULT_QTY_OPTIONS = (basePrice: number): QuantityOption[] => [
  { quantity: 1, price: basePrice },
  { quantity: 3, price: Math.round(basePrice * 2.8) },
  { quantity: 5, price: Math.round(basePrice * 4.5) },
  { quantity: 10, price: Math.round(basePrice * 8) }
];

export const PRODUCTS: Product[] = [
  // Yayın ve Kırtasiye
  { 
    id: '101', name: 'Yıl Sonu Sanat Albümü (Sert Kapak)', description: 'Öğrencinin tüm yılki eserlerinin derlendiği ciltli kitap', categorySlug: 'yayin-ve-kirtasiye', image: '/placeholder.svg', isPopular: true,
    basePrice: 450,
    variants: [{ name: 'Sayfa Sayısı', options: ['24 Sayfa', '36 Sayfa', '48 Sayfa'] }],
    quantityOptions: DEFAULT_QTY_OPTIONS(450)
  },
  { 
    id: '102', name: 'Yıl Sonu Sanat Albümü (Yumuşak Kapak)', description: 'Dergi formunda portfolyo', categorySlug: 'yayin-ve-kirtasiye', image: '/placeholder.svg',
    basePrice: 200,
    variants: [{ name: 'Kapak Tipi', options: ['Mat Selefon', 'Parlak Selefon'] }],
    quantityOptions: DEFAULT_QTY_OPTIONS(200)
  },
  { id: '103', name: 'Duvar Takvimi (12 Aylık)', description: 'Her aya özel bir resim içeren duvar takvimi', categorySlug: 'yayin-ve-kirtasiye', image: '/placeholder.svg', isPopular: true, basePrice: 150, quantityOptions: DEFAULT_QTY_OPTIONS(150) },
  { id: '104', name: 'Masa Takvimi', description: 'Çalışma masaları için pratik ve şık takvim', categorySlug: 'yayin-ve-kirtasiye', image: '/placeholder.svg', basePrice: 90, quantityOptions: DEFAULT_QTY_OPTIONS(90) },
  { id: '105', name: 'Spiralli Defter', description: 'Not almak için dayanıklı spiralli defter', categorySlug: 'yayin-ve-kirtasiye', image: '/placeholder.svg', isNew: true, basePrice: 120, variants: [{ name: 'Boyut', options: ['A5', 'A4'] }], quantityOptions: DEFAULT_QTY_OPTIONS(120) },
  { id: '106', name: 'Tebrik Kartı Seti (Zarflı)', description: 'Özel günler için zarflı tebrik kartları', categorySlug: 'yayin-ve-kirtasiye', image: '/placeholder.svg', basePrice: 80, quantityOptions: DEFAULT_QTY_OPTIONS(80) },
  { id: '107', name: 'Kartpostal Seti', description: 'Anılarınızı paylaşmak için kartpostallar', categorySlug: 'yayin-ve-kirtasiye', image: '/placeholder.svg', basePrice: 60, quantityOptions: DEFAULT_QTY_OPTIONS(60) },
  { id: '108', name: 'Çıkartma (Sticker) Sayfası', description: 'Kendi çizimlerinizden oluşan çıkartmalar', categorySlug: 'yayin-ve-kirtasiye', image: '/placeholder.svg', isNew: true, basePrice: 40, quantityOptions: DEFAULT_QTY_OPTIONS(40) },
  { id: '109', name: 'Kitap Ayracı Seti', description: 'Okuma keyfinizi artıracak renkli kitap ayraçları', categorySlug: 'yayin-ve-kirtasiye', image: '/placeholder.svg', basePrice: 30, quantityOptions: DEFAULT_QTY_OPTIONS(30) },
  { id: '110', name: 'Hediye Paket Kağıdı', description: 'Özel tasarım desenli ambalaj kağıdı', categorySlug: 'yayin-ve-kirtasiye', image: '/placeholder.svg', basePrice: 50, quantityOptions: DEFAULT_QTY_OPTIONS(50) },

  // Giyim ve Tekstil
  { 
    id: '201', name: 'Kısa Kollu Tişört', description: '%100 pamuklu, nefes alabilen baskılı tişört', categorySlug: 'giyim-ve-tekstil', image: '/placeholder.svg', isPopular: true,
    basePrice: 250,
    variants: TEXTILE_VARIANTS,
    quantityOptions: DEFAULT_QTY_OPTIONS(250)
  },
  { 
    id: '202', name: 'Uzun Kollu Tişört', description: 'Mevsim geçişleri için ideal uzun kollu tişört', categorySlug: 'giyim-ve-tekstil', image: '/placeholder.svg',
    basePrice: 280,
    variants: TEXTILE_VARIANTS,
    quantityOptions: DEFAULT_QTY_OPTIONS(280)
  },
  { 
    id: '203', name: 'Kapüşonlu Sweatshirt (Hoodie)', description: 'Sıcak tutan, rahat kesim kapüşonlu', categorySlug: 'giyim-ve-tekstil', image: '/placeholder.svg', isPopular: true,
    basePrice: 550,
    variants: TEXTILE_VARIANTS,
    quantityOptions: DEFAULT_QTY_OPTIONS(550)
  },
  { id: '204', name: 'Mutfak Önlüğü', description: 'Leke tutmaz kumaştan şef önlüğü', categorySlug: 'giyim-ve-tekstil', image: '/placeholder.svg', basePrice: 180, variants: [{ name: 'Renk', options: ['Siyah', 'Bordo', 'Krem'] }], quantityOptions: DEFAULT_QTY_OPTIONS(180) },
  { id: '205', name: 'Sanat/Boya Önlüğü', description: 'Çocuklar için koruyucu boya önlüğü', categorySlug: 'giyim-ve-tekstil', image: '/placeholder.svg', isNew: true, basePrice: 160, quantityOptions: DEFAULT_QTY_OPTIONS(160) },
  { id: '206', name: 'Bez Çanta (Tote Bag)', description: 'Doğa dostu pamuklu bez çanta', categorySlug: 'giyim-ve-tekstil', image: '/placeholder.svg', isPopular: true, basePrice: 90, variants: [{ name: 'Kumaş Rengi', options: ['Ham Bez', 'Siyah'] }], quantityOptions: DEFAULT_QTY_OPTIONS(90) },
  { id: '207', name: 'Büzgülü Bez Sırt Çantası', description: 'Pratik kullanımlı ipli sırt çantası', categorySlug: 'giyim-ve-tekstil', image: '/placeholder.svg', basePrice: 110, quantityOptions: DEFAULT_QTY_OPTIONS(110) },
  { id: '208', name: 'Bebek Zıbını (Onesie)', description: 'Hassas ciltlere uygun organik pamuk zıbın', categorySlug: 'giyim-ve-tekstil', image: '/placeholder.svg', isNew: true, basePrice: 150, variants: [{ name: 'Beden', options: ['0-3 Ay', '3-6 Ay', '6-9 Ay', '9-12 Ay'] }], quantityOptions: DEFAULT_QTY_OPTIONS(150) },
  { id: '209', name: 'Şapka (Kep)', description: 'Ayarlanabilir, nakış veya baskı seçenekli şapka', categorySlug: 'giyim-ve-tekstil', image: '/placeholder.svg', basePrice: 130, quantityOptions: DEFAULT_QTY_OPTIONS(130) },
  { id: '210', name: 'Kumaş Kalemlik', description: 'Fermuarlı bez kalemlik', categorySlug: 'giyim-ve-tekstil', image: '/placeholder.svg', basePrice: 85, quantityOptions: DEFAULT_QTY_OPTIONS(85) },

  // Ev Dekorasyonu
  { 
    id: '301', name: 'Kanvas Tablo', description: 'Ahşap şaseye gerilmiş yüksek çözünürlüklü kanvas', categorySlug: 'ev-dekorasyonu', image: '/placeholder.svg', isPopular: true,
    basePrice: 350,
    variants: POSTER_VARIANTS,
    quantityOptions: DEFAULT_QTY_OPTIONS(350)
  },
  { 
    id: '302', name: 'Çerçeveli Poster', description: 'Mat kuşe kağıt üzerine kaliteli çerçeveli baskı', categorySlug: 'ev-dekorasyonu', image: '/placeholder.svg', isPopular: true,
    basePrice: 280,
    variants: POSTER_VARIANTS,
    quantityOptions: DEFAULT_QTY_OPTIONS(280)
  },
  { id: '303', name: 'Akrilik Baskı', description: 'Parlak ve derinlikli cam efekti veren akrilik tablo', categorySlug: 'ev-dekorasyonu', image: '/placeholder.svg', isNew: true, basePrice: 600, variants: [{ name: 'Ebat', options: ['30x40 cm', '50x70 cm'] }], quantityOptions: DEFAULT_QTY_OPTIONS(600) },
  { id: '304', name: 'Metal Panel Baskı', description: 'Alüminyum üzerine canlı renklerle modern baskı', categorySlug: 'ev-dekorasyonu', image: '/placeholder.svg', basePrice: 500, quantityOptions: DEFAULT_QTY_OPTIONS(500) },
  { id: '305', name: 'Kırlent / Yastık Kılıfı', description: 'Gizli fermuarlı, çift yön baskılı yastık kılıfı', categorySlug: 'ev-dekorasyonu', image: '/placeholder.svg', isPopular: true, basePrice: 140, quantityOptions: DEFAULT_QTY_OPTIONS(140) },
  { id: '306', name: 'Polar Battaniye', description: 'Yumuşacık dokulu, sıcacık tutan polar battaniye', categorySlug: 'ev-dekorasyonu', image: '/placeholder.svg', isNew: true, basePrice: 400, variants: [{ name: 'Boyut', options: ['130x170 cm', '150x200 cm'] }], quantityOptions: DEFAULT_QTY_OPTIONS(400) },
  { id: '307', name: 'Duvar Örtüsü (Tapestry)', description: 'Geniş duvarlar için dekoratif kumaş örtü', categorySlug: 'ev-dekorasyonu', image: '/placeholder.svg', basePrice: 220, quantityOptions: DEFAULT_QTY_OPTIONS(220) },
  { id: '308', name: 'Amerikan Servis', description: 'Silinebilir yüzeyli yemek masası matı', categorySlug: 'ev-dekorasyonu', image: '/placeholder.svg', basePrice: 65, quantityOptions: DEFAULT_QTY_OPTIONS(65) },

  // İçecek ve Mutfak
  { 
    id: '401', name: 'Klasik Seramik Kupa', description: 'Güne kahve ile başlayanlar için klasik beyaz kupa', categorySlug: 'icecek-ve-mutfak', image: '/placeholder.svg', isPopular: true,
    basePrice: 95,
    variants: MUG_VARIANTS,
    quantityOptions: DEFAULT_QTY_OPTIONS(95)
  },
  { id: '402', name: 'Sihirli Kupa', description: 'Sıcak sıvı eklendiğinde resmi ortaya çıkan kupa', categorySlug: 'icecek-ve-mutfak', image: '/placeholder.svg', isPopular: true, basePrice: 150, quantityOptions: DEFAULT_QTY_OPTIONS(150) },
  { id: '403', name: 'İçi ve Kulpu Renkli Kupa', description: 'Tasarımınıza uygun renkli kulplu kupa', categorySlug: 'icecek-ve-mutfak', image: '/placeholder.svg', basePrice: 120, variants: [{ name: 'Renk', options: ['Sarı', 'Kırmızı', 'Mavi', 'Yeşil'] }], quantityOptions: DEFAULT_QTY_OPTIONS(120) },
  { id: '404', name: 'Seyahat Termosu', description: 'İçecekleri uzun süre sıcak/soğuk tutan termos', categorySlug: 'icecek-ve-mutfak', image: '/placeholder.svg', isNew: true, basePrice: 350, quantityOptions: DEFAULT_QTY_OPTIONS(350) },
  { id: '405', name: 'Çelik Su Matarası', description: 'Sporda, okulda yanınızdan ayırmayacağınız matara', categorySlug: 'icecek-ve-mutfak', image: '/placeholder.svg', basePrice: 280, quantityOptions: DEFAULT_QTY_OPTIONS(280) },
  { id: '406', name: 'Seramik Bardak Altlığı', description: 'Altı mantar destekli seramik bardak altlığı', categorySlug: 'icecek-ve-mutfak', image: '/placeholder.svg', basePrice: 45, quantityOptions: DEFAULT_QTY_OPTIONS(45) },
  { id: '407', name: 'Ahşap Bardak Altlığı', description: 'Lazer kazıma veya renkli baskılı MDF bardak altlığı', categorySlug: 'icecek-ve-mutfak', image: '/placeholder.svg', basePrice: 35, quantityOptions: DEFAULT_QTY_OPTIONS(35) },

  // Teknoloji Aksesuarları
  { id: '501', name: 'Telefon Kılıfı', description: 'Darbeye dayanıklı, tam korumalı telefon kılıfı', categorySlug: 'teknoloji-aksesuarlari', image: '/placeholder.svg', isPopular: true, basePrice: 160, variants: [{ name: 'Telefon Modeli', options: ['iPhone 15 Pro Max', 'iPhone 14', 'Samsung S24 Ultra', 'Samsung A54'] }], quantityOptions: DEFAULT_QTY_OPTIONS(160) },
  { id: '502', name: 'Pop-Socket', description: 'Telefonu kavramayı kolaylaştıran arka tutucu', categorySlug: 'teknoloji-aksesuarlari', image: '/placeholder.svg', basePrice: 50, quantityOptions: DEFAULT_QTY_OPTIONS(50) },
  { id: '503', name: 'Laptop Kılıfı', description: 'Sünger dolgulu bilgisayar koruyucu kılıf', categorySlug: 'teknoloji-aksesuarlari', image: '/placeholder.svg', isNew: true, basePrice: 250, variants: [{ name: 'Ekran Boyutu', options: ['13 İnç', '15.6 İnç', '17 İnç'] }], quantityOptions: DEFAULT_QTY_OPTIONS(250) },
  { id: '504', name: 'Tablet Kılıfı', description: 'Stand özellikli kapaklı tablet kılıfı', categorySlug: 'teknoloji-aksesuarlari', image: '/placeholder.svg', basePrice: 300, quantityOptions: DEFAULT_QTY_OPTIONS(300) },
  { id: '505', name: 'Mousepad', description: 'Kaymaz tabanlı, pürüzsüz yüzeyli mousepad', categorySlug: 'teknoloji-aksesuarlari', image: '/placeholder.svg', isPopular: true, basePrice: 90, variants: [{ name: 'Ebat', options: ['Standart (20x24cm)', 'XXL (40x90cm)'] }], quantityOptions: DEFAULT_QTY_OPTIONS(90) },

  // Oyun ve Hobi
  { id: '601', name: 'Karton Yapboz (Puzzle)', description: 'Sevdiklerinizi birleştirin (96 veya 130 parça)', categorySlug: 'oyun-eglence-ve-hobi', image: '/placeholder.svg', isPopular: true, basePrice: 180, variants: [{ name: 'Parça Sayısı', options: ['96 Parça (A4)', '130 Parça (A3)', '500 Parça'] }], quantityOptions: DEFAULT_QTY_OPTIONS(180) },
  { id: '602', name: 'Eşleştirme Kartları (Hafıza Oyunu)', description: 'Eğitici ve eğlenceli hafıza oyunu kartları', categorySlug: 'oyun-eglence-ve-hobi', image: '/placeholder.svg', isNew: true, basePrice: 140, quantityOptions: DEFAULT_QTY_OPTIONS(140) },
  { id: '603', name: 'Litofani (Gece Lambası Paneli)', description: 'Işık vurunca fotoğrafı gösteren 3D gece lambası', categorySlug: 'oyun-eglence-ve-hobi', image: '/placeholder.svg', isNew: true, basePrice: 450, quantityOptions: DEFAULT_QTY_OPTIONS(450) },

  // Günlük Kullanım ve Hediyelik
  { id: '701', name: 'Buzdolabı Magneti', description: 'Anılarınızı mutfağınıza taşıyan magnet', categorySlug: 'gunluk-kullanim-ve-hediyelik', image: '/placeholder.svg', isPopular: true, basePrice: 25, quantityOptions: DEFAULT_QTY_OPTIONS(25) },
  { id: '702', name: 'Anahtarlık', description: 'Metal veya pleksi malzemeden şık anahtarlık', categorySlug: 'gunluk-kullanim-ve-hediyelik', image: '/placeholder.svg', basePrice: 35, variants: [{ name: 'Malzeme', options: ['Metal', 'Pleksi', 'Ahşap'] }], quantityOptions: DEFAULT_QTY_OPTIONS(35) },
  { id: '703', name: 'Rozet (İğneli)', description: 'Çantalara veya yakaya takılabilir iğneli rozet', categorySlug: 'gunluk-kullanim-ve-hediyelik', image: '/placeholder.svg', basePrice: 15, quantityOptions: DEFAULT_QTY_OPTIONS(15) },
  { id: '704', name: 'Yılbaşı Ağacı Süsü', description: 'Yeni yıl ruhunu yansıtan kişiye özel süs', categorySlug: 'gunluk-kullanim-ve-hediyelik', image: '/placeholder.svg', isNew: true, basePrice: 40, quantityOptions: DEFAULT_QTY_OPTIONS(40) },
];
