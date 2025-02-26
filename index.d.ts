import { ColumnDef, FilterFn } from '@tanstack/react-table';

declare module 'cotable' {
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

  export const Cotable: <TData, TValue>(props: CotableProps<TData, TValue>) => JSX.Element;
  export const numberRangeFilter: FilterFn<any>;
} 