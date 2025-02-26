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
  });

  return (
    <div className={`cotable-wrapper w-full ${className}`}>
      <div className="cotable-container rounded-md border">
        <table className="cotable w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="cotable-header-row border-b bg-gray-50">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="cotable-header-cell px-4 py-3 text-left text-sm font-medium text-gray-700"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: `cotable-header-content ${
                            header.column.getCanSort() ? 'cursor-pointer select-none' : ''
                          }`,
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                    {showFilters && header.column.getCanFilter() ? (
                      <div className="cotable-filter mt-2">
                        <input
                          type="text"
                          value={(header.column.getFilterValue() as string) ?? ''}
                          onChange={(e) =>
                            header.column.setFilterValue(e.target.value)
                          }
                          className="cotable-filter-input w-full rounded border p-1 text-sm"
                          placeholder={`Filtrele...`}
                        />
                      </div>
                    ) : null}
                  </th>
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

      {showPagination && (
        <div className="cotable-pagination mt-4 flex items-center justify-between px-2">
          <div className="flex items-center gap-2 text-sm">
            <button
              className="cotable-pagination-button rounded border p-1"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              {'<<'}
            </button>
            <button
              className="cotable-pagination-button rounded border p-1"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {'<'}
            </button>
            <button
              className="cotable-pagination-button rounded border p-1"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {'>'}
            </button>
            <button
              className="cotable-pagination-button rounded border p-1"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              {'>>'}
            </button>
            <span className="cotable-pagination-info flex items-center gap-1">
              <div>Sayfa</div>
              <strong>
                {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
              </strong>
            </span>
          </div>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            className="cotable-page-size rounded border p-1 text-sm"
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize} satır göster
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
} 