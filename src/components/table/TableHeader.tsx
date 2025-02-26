import { Header, flexRender } from '@tanstack/react-table';
import { RangeFilter } from '../filters/RangeFilter';
import { SearchFilter } from '../filters/SearchFilter';

interface TableHeaderProps {
  header: Header<any, unknown>;
  showFilters: boolean;
}

export function TableHeader({ header, showFilters }: TableHeaderProps) {
  return (
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
          {flexRender(header.column.columnDef.header, header.getContext())}
          {{
            asc: ' 🔼',
            desc: ' 🔽',
          }[header.column.getIsSorted() as string] ?? null}
        </div>
      )}
      {showFilters && header.column.getCanFilter() && (
        <div className="cotable-filter mt-2">
          {header.column.columnDef.meta?.isNumberRange ? (
            <RangeFilter column={header.column} />
          ) : (
            <SearchFilter column={header.column} />
          )}
        </div>
      )}
    </th>
  );
} 