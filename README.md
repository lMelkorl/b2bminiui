# Mücevherat B2B Yönetim Paneli

Modern, responsive ve kullanıcı dostu bir mücevherat B2B yönetim paneli. React 18+, TypeScript, TailwindCSS ve Headless UI ile geliştirilmiştir.

## 🚀 Özellikler

- **Kimlik Doğrulama**: Mock authentication ile güvenli giriş sistemi
- **Dashboard**: Özet kartlar ve son 5 sipariş gösterimi
- **Ürün Yönetimi**: Kolye, yüzük, bileklik ve küpe için tam CRUD işlemleri
- **Arama ve Filtreleme**: Ürün adı, açıklama ve kategoriye göre filtreleme
- **Sipariş Yönetimi**: Sipariş listesi ve detaylı sipariş görüntüleme
- **Tema Değiştirme**: Açık/Koyu mod desteği (localStorage'da kalıcı)
- **Responsive Tasarım**: Mobil öncelikli tasarım, hamburger menü
- **Form Doğrulama**: React Hook Form ile inline validation
- **Yükleme Durumları**: Kullanıcı dostu loading ve error gösterimleri
- **Mock API**: MSW (Mock Service Worker) ile gerçekçi API simülasyonu

## 🛠 Teknoloji Stack

### Zorunlu Teknolojiler
- **React 18+**: Modern React with hooks
- **React Router v6+**: Client-side routing
- **TailwindCSS**: Utility-first CSS framework
- **React Hook Form**: Form validation ve yönetimi
- **MSW**: API mocking

### Ek Kütüphaneler
- **TypeScript**: Type güvenliği
- **Vite**: Hızlı development ve build tool
- **Headless UI**: Erişilebilir UI bileşenleri
- **Lucide React**: Modern ikon seti
- **clsx**: Conditional className utility

## 📁 Proje Yapısı

```
src/
├── app/                     # Uygulama sayfaları
│   ├── Dashboard.tsx        # Ana sayfa
│   ├── Login.tsx            # Giriş sayfası
│   ├── Products.tsx         # Ürünler listesi ve CRUD
│   ├── Orders.tsx           # Siparişler listesi
│   ├── OrderDetail.tsx      # Sipariş detay
│   └── Settings.tsx         # Ayarlar sayfası
├── components/              # Yeniden kullanılabilir bileşenler
│   ├── layout/
│   │   ├── Layout.tsx       # Ana layout wrapper
│   │   └── Sidebar.tsx      # Sidebar navigasyon
│   └── ProtectedRoute.tsx   # Route koruma
├── lib/                     # Utilities ve helpers
│   ├── auth-context.tsx     # Authentication context
│   └── theme-context.tsx    # Tema yönetimi context
├── mocks/                   # Mock API yapılandırması
│   ├── browser.ts           # MSW browser setup
│   ├── handlers.ts          # API endpoint handlers
│   └── data.json            # Mock veri (ürünler, siparişler)
└── styles/
    └── index.css            # Global styles
```

## 🚦 Başlangıç

### Gereksinimler
- Node.js 16+ ve npm

### Kurulum

1. Projeyi klonlayın:
```bash
git clone <repository-url>
cd task
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Development sunucusunu başlatın:
```bash
npm run dev
```

4. Tarayıcınızda `http://localhost:5173` adresine gidin

### Demo Giriş Bilgileri

Giriş yapmak için bu bilgileri kullanın:
- **Email**: admin@mucevherat.com
- **Şifre**: admin123

## 📦 Kullanılabilir Komutlar

- `npm run dev` - Development sunucusunu başlatır
- `npm run build` - Production build oluşturur
- `npm run preview` - Production build önizlemesi
- `npm run lint` - ESLint çalıştırır

## 🎨 Özellikler Detayı

### Giriş Sayfası
- Email ve şifre validasyonu (React Hook Form)
- Hatalı giriş için error mesajları
- Başarılı girişte otomatik dashboard yönlendirmesi
- Demo bilgileri gösterimi

### Dashboard
- Özet kartlar (Toplam Gelir, Siparişler, Ürünler, Düşük Stok)
- Son 5 sipariş listesi
- Loading states ve skeleton screens
- Responsive grid layout

### Ürünler (Products)
- Grid view ile ürün kartları
- Gerçek zamanlı arama (ürün adı, açıklama, malzeme)
- Kategori filtresi (Kolye, Yüzük, Bileklik, Küpe)
- Ürün ekleme/düzenleme modal'ı (Headless UI Dialog)
- Form validasyonu ile inline error mesajları
- Ürün silme (onay ile)
- Session boyunca mock API persistence

### Siparişler (Orders)
- Sipariş listesi tablosu
- Durum badge'leri (Beklemede, Hazırlanıyor, Kargoda, Teslim Edildi)
- Durum filtreleme
- Sipariş detay sayfası
- Müşteri bilgileri, teslimat adresi, sipariş kalemleri
- Read-only görüntüleme

### Ayarlar (Settings)
- Light/Dark tema toggle (switch component)
- Tema tercihi localStorage'da kalıcı
- Kullanıcı profil bilgileri
- Çıkış yapma

## 🎯 Mock API Endpoints

Uygulama MSW (Mock Service Worker) kullanarak aşağıdaki endpoint'leri simüle eder:

- `POST /api/login` - Kullanıcı kimlik doğrulama
- `GET /api/summary` - Dashboard özet verileri
- `GET /api/products` - Tüm ürünleri getir (search ve category parametreleri desteklenir)
- `GET /api/products/:id` - Tek ürün detayı
- `POST /api/products` - Yeni ürün oluştur
- `PUT /api/products/:id` - Ürün güncelle
- `DELETE /api/products/:id` - Ürün sil
- `GET /api/orders` - Tüm siparişleri getir (status ve limit parametreleri)
- `GET /api/orders/:id` - Sipariş detayı
- `GET /api/categories` - Ürün kategorilerini getir

## 📱 Responsive Tasarım

- **Mobil** (<640px): Hamburger menü, tek sütun layout, dinamik tablo scroll
- **Tablet** (640px-1024px): İki sütunlu grid, optimize edilmiş spacing
- **Desktop** (>1024px): Sabit sidebar, tam tablo görünümü, 4 sütunlu ürün grid'i

### Dinamik Tablo Özellikleri
- `table-auto` ile içerik bazlı sütun genişlikleri
- Responsive font boyutları: `text-[9px]` (mobil) → `text-xs` (desktop)
- Responsive padding: `px-2` (mobil) → `px-6` (desktop)
- Overflow-x-auto ile yatay scroll (gerektiğinde)
- Tüm sütunlar her cihazda erişilebilir

## 🎨 Tasarım Prensipleri

- **Mobile-first**: Mobil için tasarlanıp masaüstüne ölçeklendirildi
- **Component-based**: Yeniden kullanılabilir bileşenler
- **Type-safe**: Tam TypeScript desteği
- **Erişilebilir**: Semantic HTML ve Headless UI kullanımı
- **Temiz kod**: Self-documenting, okunabilir kod
- **State yönetimi**: React Context API ile temiz ayrım

## 🔒 Authentication Akışı

1. Kullanıcı giriş sayfasında email ve şifre girer
2. Mock API credentials'ı doğrular
3. Başarılı ise token ve kullanıcı bilgisi localStorage'a kaydedilir
4. Protected route'lar authentication durumunu kontrol eder
5. Çıkış yapılınca localStorage temizlenir ve login'e yönlendirilir

## 📝 Notlar

- Gerçek backend yok - tüm veriler mock
- Ürün değişiklikleri sadece session boyunca kalıcı (sayfa yenilenince sıfırlanır)
- Tema tercihi kalıcı (localStorage)
- Tüm formlar inline validation içerir
- Tarih ve para formatları Türkçe locale (tr-TR) kullanır
- Mock veri: 8 ürün, 6 sipariş, 1 kullanıcı

## 🔧 Teknik İyileştirmeler

### Responsive Tablo Çözümü
- **Dinamik genişlik**: Sabit `minWidth` yerine `table-auto` kullanımı
- **İçerik bazlı**: Sütunlar içeriğe göre otomatik boyutlanır
- **Breakpoint'siz**: Manuel breakpoint yerine CSS native davranış
- **Scroll optimizasyonu**: Sadece tablo scroll, sayfa sabit
- **Font ölçekleme**: 9px (mobil) → 10px (sm) → 12px (md) → 14px (lg)

### Performance
- Lazy loading için hazır yapı
- Optimized re-renders
- Memoization stratejisi
- Efficient state management

## 🏗 Production Build

```bash
npm run build
```

Build dosyaları `dist/` klasörüne oluşturulur.

## 📋 Kabul Kriterleri (Tamamlandı)

- ✅ Login akışı doğru çalışıyor
- ✅ Ürün listesi, form ve filtreleme işlevsel
- ✅ Sipariş detayları görüntülenebilir
- ✅ Tema değişimi localStorage'da kalıcı
- ✅ Mobil responsive tasarım
- ✅ Inline form validation
- ✅ Loading ve error durumları

## 🎯 Kullanılan Mock Veri

- **Ürünler**: Altın kolye, pırlanta yüzük, gümüş bileklik, zümrüt küpe, safir kolye, elmas bileklik, inci küpe, solitaire yüzük
- **Kategoriler**: Kolye, Yüzük, Bileklik, Küpe
- **Siparişler**: 6 farklı sipariş (farklı durumlar)
- **Durum Tipleri**: Beklemede, Hazırlanıyor, Kargoda, Teslim Edildi

## 📄 Lisans

Bu proje B2B Frontend Assessment için geliştirilmiştir.

---

**Geliştirme Süresi**: 2 gün  
**Son Güncelleme**: 29 Ekim 2024  
**Responsive Tablo İyileştirmesi**: Dinamik, auto-responsive tablo yapısı eklendi
