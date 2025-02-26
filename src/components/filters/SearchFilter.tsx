import { Column } from '@tanstack/react-table';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

interface SearchFilterProps {
  column: Column<any, unknown>;
  placeholder?: string;
}

export function SearchFilter({ column, placeholder = 'Ara...' }: SearchFilterProps) {
  return (
    <div>
      <div className="mb-1 text-xs text-gray-500">Metin Ara</div>
      <Input
        value={(column.getFilterValue() as string) ?? ''}
        onChange={(e) => column.setFilterValue(e.target.value)}
        placeholder={placeholder}
        prefix={<SearchOutlined className="text-gray-400" />}
        allowClear
      />
    </div>
  );
} 