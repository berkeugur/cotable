import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table';
import { useState } from 'react';
import { TableHeader } from './TableHeader';
import { Pagination } from './Pagination';
import { numberRangeFilter } from '../filters/filterFunctions';

export interface CotableProps<TData, TValue> {
  /** Tablo sütunlarının tanımları */
  columns: ColumnDef<TData, TValue>[];
  /** Tablo verileri */
  data: TData[];
  /** Filtreleme özelliğinin gösterilip gösterilmeyeceği */
  showFilters?: boolean;
  /** Sayfalama özelliğinin gösterilip gösterilmeyeceği */
  showPagination?: boolean;
  /** Ek CSS sınıfları */
  className?: string;
}

export function Cotable<TData, TValue>({
  columns,
  data,
  showFilters = true,
  showPagination = true,
  className = '',
}: CotableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    filterFns: {
      numberRange: numberRangeFilter,
      inNumberRange: numberRangeFilter,
    },
  });

  return (
    <div className={`cotable-wrapper w-full ${className}`}>
      <div className="cotable-container rounded-md border">
        <table className="cotable w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="cotable-header-row border-b bg-gray-50">
                {headerGroup.headers.map((header) => (
                  <TableHeader key={header.id} header={header} showFilters={showFilters} />
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="cotable-row border-b">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="cotable-cell px-4 py-3 text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPagination && <Pagination table={table} />}
    </div>
  );
} 