import { FilterFn } from '@tanstack/react-table';

export { Cotable } from './components/table/Cotable';
export type { CotableProps } from './components/table/Cotable';
export { numberRangeFilter } from './components/filters/filterFunctions';
export type { RangeFilterValue } from './components/filters/RangeFilter';

export type { FilterFn } from '@tanstack/react-table';
export type { ColumnDef } from '@tanstack/react-table';

declare module '@tanstack/table-core' {
  interface ColumnMeta<TData extends unknown, TValue> {
    isNumberRange?: boolean;
  }

  interface FilterFns {
    numberRange: FilterFn<any>;
    inNumberRange: FilterFn<any>;
  }
} 