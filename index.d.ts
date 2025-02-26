import { ColumnDef, FilterFn } from '@tanstack/react-table';
import { CotableProps } from './src/components/Cotable';
declare module 'cotable' {
  export const CotableProps: CotableProps<any, any>;
  export const Cotable: <TData, TValue>(props: CotableProps<TData, TValue>) => JSX.Element;
  export const numberRangeFilter: FilterFn<any>;
  export const searchFilter: FilterFn<any>;
  export const multipleChoiceFilter: FilterFn<any>;
  export const ColumnDef: ColumnDef<any>;
} 