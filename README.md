# Cotable

Modern ve kullanışlı bir React tablo kütüphanesi. TanStack Table (React Table v8) üzerine inşa edilmiş, TypeScript ile yazılmış, sıralama, filtreleme ve sayfalama özellikleri içeren bir tablo bileşeni.

## Özellikler

- 🔍 Sütun bazlı filtreleme
- 🔄 Sıralama
- 📄 Sayfalama
- 💅 Özelleştirilebilir stil
- 📱 Responsive tasarım
- 🎯 TypeScript desteği

## Kurulum

```bash
npm install cotable
# veya
yarn add cotable
# veya
pnpm add cotable
```

## Kullanım

```tsx
import { Cotable } from 'cotable';
import { ColumnDef } from '@tanstack/react-table';

type Person = {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
};

const columns: ColumnDef<Person>[] = [
  {
    accessorKey: 'firstName',
    header: 'Ad',
  },
  {
    accessorKey: 'lastName',
    header: 'Soyad',
  },
  {
    accessorKey: 'age',
    header: 'Yaş',
  },
];

const data: Person[] = [
  { id: 1, firstName: 'Ahmet', lastName: 'Yılmaz', age: 25 },
  { id: 2, firstName: 'Mehmet', lastName: 'Kaya', age: 30 },
];

function App() {
  return (
    <Cotable
      columns={columns}
      data={data}
      showFilters={true}
      showPagination={true}
    />
  );
}
```

## Props

| Prop | Tip | Varsayılan | Açıklama |
|------|-----|------------|-----------|
| columns | `ColumnDef<TData, TValue>[]` | Gerekli | Tablo sütunlarının tanımları |
| data | `TData[]` | Gerekli | Tablo verileri |
| showFilters | `boolean` | `true` | Filtreleme özelliğinin gösterilip gösterilmeyeceği |
| showPagination | `boolean` | `true` | Sayfalama özelliğinin gösterilip gösterilmeyeceği |
| className | `string` | `''` | Ek CSS sınıfları |

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
