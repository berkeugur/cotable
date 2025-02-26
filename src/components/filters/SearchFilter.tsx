import { Column } from '@tanstack/react-table';

interface SearchFilterProps {
  column: Column<any, unknown>;
  placeholder?: string;
}

export function SearchFilter({ column, placeholder = 'Filtrele...' }: SearchFilterProps) {
  return (
    <input
      type="text"
      value={(column.getFilterValue() as string) ?? ''}
      onChange={(e) => column.setFilterValue(e.target.value)}
      className="cotable-filter-input w-full rounded border p-1 text-sm"
      placeholder={placeholder}
    />
  );
} 