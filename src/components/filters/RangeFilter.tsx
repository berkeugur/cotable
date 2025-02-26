import { Column } from '@tanstack/react-table';
import { useState } from 'react';
import { InputNumber, Space } from 'antd';

export interface RangeFilterValue {
  min?: number;
  max?: number;
}

interface RangeFilterProps {
  column: Column<any, unknown>;
  placeholder?: string;
}

export function RangeFilter({ column, placeholder }: RangeFilterProps) {
  const [min, setMin] = useState<number | null>(null);
  const [max, setMax] = useState<number | null>(null);

  const handleMinChange = (value: number | null) => {
    setMin(value);
    const newRange = { min: value ?? undefined, max: max ?? undefined };
    column.setFilterValue(newRange);
  };

  const handleMaxChange = (value: number | null) => {
    setMax(value);
    const newRange = { min: min ?? undefined, max: value ?? undefined };
    column.setFilterValue(newRange);
  };

  return (
    <Space direction="vertical" size="middle" className="w-full">
      <div>
        <div className="mb-1 text-xs text-gray-500">Minimum Değer</div>
        <InputNumber
          value={min}
          onChange={handleMinChange}
          placeholder="En az"
          className="w-full"
          size="middle"
        />
      </div>

      <div>
        <div className="mb-1 text-xs text-gray-500">Maksimum Değer</div>
        <InputNumber
          value={max}
          onChange={handleMaxChange}
          placeholder="En çok"
          className="w-full"
          size="middle"
        />
      </div>
    </Space>
  );
} 