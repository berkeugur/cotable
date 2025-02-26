import { FilterFn } from '@tanstack/react-table';

export { Cotable } from './components/Cotable';
export type { CotableProps } from './components/Cotable';
export { numberRangeFilter } from './components/Cotable';
export type { RangeFilterValue } from './components/Cotable';

export type { FilterFn } from '@tanstack/react-table';
export type { ColumnDef } from '@tanstack/react-table';

declare module '@tanstack/table-core' {
  interface ColumnMeta<TData extends unknown, TValue> {
    isNumberRange?: boolean;
    isSearchFilter?: boolean;
    isMultipleChoiceFilter?: boolean;
  }

  interface FilterMeta {
    numberRange: 'numberRange';
    searchFilter: 'searchFilter';
    multipleChoiceFilter: 'multipleChoiceFilter';
  }

  interface FilterFns {
    numberRange: FilterFn<any>;
    searchFilter: FilterFn<any>;
    multipleChoiceFilter: FilterFn<any>;
  }
} 