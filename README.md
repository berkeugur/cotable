# Cotable

Cotable, React ve TypeScript ile geliştirilmiş, TanStack Table ve Ant Design tabanlı, güçlü ve özelleştirilebilir bir tablo bileşenidir.

## Özellikler

- 🔍 Gelişmiş Filtreleme Seçenekleri
  - Çoklu Seçim Filtresi (multiSelect)
  - Metin Arama Filtresi (searchFilter)
  - Sayısal Aralık Filtresi (numberRange)
  - Özel Seçim Filtresi (multipleChoiceFilter)
- 📊 Akıllı Sıralama
- 📑 Gelişmiş Sayfalama
  - Sayfa Başına Kayıt Sayısı Seçimi
  - Toplam Kayıt Gösterimi
- 🎨 Ant Design Tema Desteği
- 🌍 Türkçe Dil Desteği
- 💪 TypeScript ile Tam Tip Güvenliği
- 🔄 Otomatik Filtre Tipi Belirleme
- 🧹 Toplu Filtre Temizleme

## Kurulum

```bash
npm install cotable
# veya
yarn add cotable
```

## Kullanım

```tsx
import { Cotable } from 'cotable';

// Tablo verisi
const data = [
  { id: 1, name: 'Ahmet', age: 25, city: 'İstanbul' },
  // ...
];

// Sütun tanımlamaları
const columns = [
  {
    accessorKey: 'name',
    header: 'İsim',
    meta: {
      isSearchFilter: true // Metin araması için
    }
  },
  {
    accessorKey: 'age',
    header: 'Yaş',
    meta: {
      isNumberRange: true // Sayısal aralık filtresi için
    }
  },
  {
    accessorKey: 'tags',
    header: 'Etiketler',
    meta: {
      isMultipleChoiceFilter: true // Çoklu seçim filtresi için
    }
  },
  {
    accessorKey: 'city',
    header: 'Şehir',
    enableColumnFilter: true // Standart çoklu seçim filtresi için
  }
];

// Bileşen kullanımı
function App() {
  return (
    <Cotable
      columns={columns}
      data={data}
      showFilters={true}
      showPagination={true}
      filterStyle="popover"
    />
  );
}
```

## Filtre Türleri

### 1. Metin Arama Filtresi (searchFilter)
- Anlık arama yapabilme
- Büyük/küçük harf duyarsız arama
- Otomatik temizleme butonu
- Prefix olarak arama ikonu

### 2. Sayısal Aralık Filtresi (numberRange)
- Minimum ve maksimum değer girişi
- Tek yönlü filtreleme imkanı (sadece min veya sadece max)
- Sayısal değer kontrolü
- InputNumber bileşeni ile kolay giriş

### 3. Çoklu Seçim Filtresi (multipleChoiceFilter)
- Virgülle ayrılmış değerleri otomatik seçeneklere dönüştürme
- Çoklu seçim yapabilme
- Checkbox grubu ile kolay seçim
- Otomatik değer ayrıştırma

### 4. Standart Çoklu Seçim Filtresi (multiSelect)
- Benzersiz değerlerden otomatik seçenek oluşturma
- Tümünü seç/hiçbirini seçme butonları
- Seçenekler arasında anlık arama
- Kaydırılabilir liste görünümü
- Seçenek bulunamadığında özel mesaj

## Props

| Prop | Tip | Varsayılan | Açıklama |
|------|-----|------------|-----------|
| columns | `ColumnDef<TData, TValue>[]` | - | Tablo sütunlarının tanımları |
| data | `TData[]` | - | Tablo verileri |
| showFilters | `boolean` | `true` | Filtreleme özelliğinin gösterilip gösterilmeyeceği |
| showPagination | `boolean` | `true` | Sayfalama özelliğinin gösterilip gösterilmeyeceği |
| className | `string` | `''` | Ek CSS sınıfları |
| filterStyle | `'popover' \| 'inline'` | `'inline'` | Filtre stili |

## Sütun Meta Özellikleri

| Özellik | Tip | Açıklama | Otomatik Filtre |
|---------|-----|-----------|-----------------|
| isNumberRange | `boolean` | Sayısal aralık filtresi kullanımı | inNumberRange |
| isSearchFilter | `boolean` | Metin arama filtresi kullanımı | searchFilter |
| isMultipleChoiceFilter | `boolean` | Çoklu seçim filtresi kullanımı | multipleChoiceFilter |
| - | - | Standart sütun | multiSelect |

## Özelleştirme

### CSS Sınıfları
- `.cotable-wrapper`: Ana tablo konteyneri
- `.scrollable-content`: Kaydırılabilir filtre listesi
- `.checkbox-item`: Filtre seçenek öğesi

### Stil Özelleştirme
- Özel scrollbar tasarımı
- Hover efektleri
- Responsive tasarım
- Ant Design tema desteği

## Geliştirme

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme modunda çalıştır
npm run dev

# Derleme
npm run build

# Lint kontrolü
npm run lint
```

## Lisans

MIT
