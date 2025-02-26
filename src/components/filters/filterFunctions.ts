import { FilterFn } from '@tanstack/react-table';
import { RangeFilterValue } from './RangeFilter';

export const numberRangeFilter: FilterFn<any> = (row, columnId, filterValue: RangeFilterValue) => {
  const value = row.getValue(columnId) as number;
  const { min, max } = filterValue;

  if (min !== undefined && max !== undefined) {
    return value >= min && value <= max;
  }
  if (min !== undefined) {
    return value >= min;
  }
  if (max !== undefined) {
    return value <= max;
  }
  return true;
}; 