import { useState } from 'react';
import { Column } from '@tanstack/react-table';
import { RangeFilter } from './RangeFilter';
import { SearchFilter } from './SearchFilter';
import { Dropdown, Button, Space } from 'antd';
import { FilterFilled, DownOutlined } from '@ant-design/icons';

interface FilterPopoverProps {
  column: Column<any, unknown>;
  isNumberRange?: boolean;
}

export function FilterPopover({ column, isNumberRange }: FilterPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasFilter = column.getFilterValue() != null;

  const handleClearFilter = () => {
    column.setFilterValue(undefined);
    setIsOpen(false);
  };

  const dropdownContent = (
    <div className="bg-white rounded-lg shadow-lg min-w-[300px]">
      <div className="px-4 py-2.5 border-b flex items-center justify-between">
        <span className="text-sm text-gray-900">
          {column.columnDef.header as string}
        </span>
        {hasFilter && (
          <Button
            type="text"
            danger
            size="small"
            onClick={handleClearFilter}
            className="flex items-center"
          >
            Temizle
          </Button>
        )}
      </div>
      <div className="p-4">
        {isNumberRange ? (
          <RangeFilter column={column} />
        ) : (
          <SearchFilter column={column} />
        )}
      </div>
    </div>
  );

  return (
    <Dropdown
      open={isOpen}
      onOpenChange={setIsOpen}
      trigger={['click']}
      dropdownRender={() => dropdownContent}
      placement="bottomRight"
    >
      <Button
        type={hasFilter ? 'primary' : 'default'}
        ghost={hasFilter}
        size="small"
        icon={<FilterFilled />}
        className="ml-2"
      >
        <Space>
          Filtre
          <DownOutlined className={isOpen ? 'transform rotate-180' : ''} />
        </Space>
      </Button>
    </Dropdown>
  );
} 