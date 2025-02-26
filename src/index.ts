import { FilterFn } from '@tanstack/react-table';

export { Cotable, numberRangeFilter } from './components/Cotable';
export type { CotableProps } from './components/Cotable';

export type { FilterFn } from '@tanstack/react-table';
export type { ColumnDef } from '@tanstack/react-table';

declare module '@tanstack/table-core' {
  interface FilterFns {
    numberRange: FilterFn<any>;
  }
} 