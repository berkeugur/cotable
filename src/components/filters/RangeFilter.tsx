import { Column } from '@tanstack/react-table';
import { useState } from 'react';

export interface RangeFilterValue {
  min?: number;
  max?: number;
}

interface RangeFilterProps {
  column: Column<any, unknown>;
  placeholder?: string;
}

export function RangeFilter({ column, placeholder }: RangeFilterProps) {
  const [min, setMin] = useState<string>('');
  const [max, setMax] = useState<string>('');

  const handleMinChange = (value: string) => {
    setMin(value);
    const newRange = { min: value ? Number(value) : undefined, max: max ? Number(max) : undefined };
    column.setFilterValue(newRange);
  };

  const handleMaxChange = (value: string) => {
    setMax(value);
    const newRange = { min: min ? Number(min) : undefined, max: value ? Number(value) : undefined };
    column.setFilterValue(newRange);
  };

  return (
    <div className="flex gap-2">
      <input
        type="number"
        value={min}
        onChange={(e) => handleMinChange(e.target.value)}
        placeholder="Min"
        className="w-20 rounded border p-1 text-sm"
      />
      <input
        type="number"
        value={max}
        onChange={(e) => handleMaxChange(e.target.value)}
        placeholder="Max"
        className="w-20 rounded border p-1 text-sm"
      />
    </div>
  );
} 