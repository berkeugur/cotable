import { Table } from '@tanstack/react-table';

interface PaginationProps {
  table: Table<any>;
}

export function Pagination({ table }: PaginationProps) {
  return (
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
  );
} 