'use client';

import React from 'react';
import { Cotable } from '../components/Cotable';
import { ColumnDef } from '@tanstack/react-table';

type Person = {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  city: string;
};

const data: Person[] = [
  { id: 1, firstName: 'Ahmet', lastName: 'Yılmaz', age: 25, city: 'İstanbul' },
  { id: 2, firstName: 'Mehmet', lastName: 'Kaya', age: 30, city: 'Ankara' },
  { id: 3, firstName: 'Ayşe', lastName: 'Demir', age: 28, city: 'İzmir' },
  { id: 4, firstName: 'Fatma', lastName: 'Çelik', age: 35, city: 'Bursa' },
  { id: 5, firstName: 'Ali', lastName: 'Öz', age: 22, city: 'Antalya' },
  { id: 6, firstName: 'Melisa', lastName: 'Yılmaz', age: 25, city: 'İstanbul' },
  { id: 7, firstName: 'Mert', lastName: 'Kaya', age: 30, city: 'Ankara' },
  { id: 8, firstName: 'Ece', lastName: 'Demir', age: 28, city: 'İzmir' },
  { id: 9, firstName: 'Ege', lastName: 'Çelik', age: 35, city: 'Bursa' },
  { id: 10, firstName: 'Alper', lastName: 'Öz', age: 22, city: 'Antalya' },
];

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
  {
    accessorKey: 'city',
    header: 'Şehir',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="mb-8 text-3xl font-bold">Cotable Örnek</h1>
      <Cotable
        columns={columns}
        data={data}
        showFilters={true}
        showPagination={true}
      />
    </main>
  );
} 