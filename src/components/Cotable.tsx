import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  getPaginationRowModel,
  Column,
  FilterFn,
  Row,
  CellContext,
  HeaderContext,
  Header,
} from '@tanstack/react-table';
import { useState, useMemo } from 'react';
import { Table, ConfigProvider, Button, Space, Input, InputNumber, Card, Divider, Checkbox, Empty } from 'antd';
import { FilterOutlined, ClearOutlined, SearchOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';
import trTR from 'antd/locale/tr_TR';

declare module '@tanstack/table-core' {
  interface ColumnMeta<TData extends unknown, TValue> {
    isNumberRange?: boolean;
    isSearchFilter?: boolean;
    isMultipleChoiceFilter?: boolean;
  }

  interface FilterFns {
    numberRange: FilterFn<any>;
    inNumberRange: FilterFn<any>;
    multiSelect: FilterFn<any>;
    searchFilter: FilterFn<any>;
    multipleChoiceFilter: FilterFn<any>;
  }
}

export type CotableFilterType = 'inNumberRange' | 'multiSelect' | 'searchFilter' | 'multipleChoiceFilter';

export interface RangeFilterValue {
  min?: number;
  max?: number;
}

interface RangeFilterProps {
  column: Column<any, unknown>;
  placeholder?: string;
}

function RangeFilter({ column, placeholder }: RangeFilterProps) {
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
    <Space direction="vertical" className="w-full">
      <div className="flex items-center gap-2">
        <InputNumber
          className="flex-1"
          value={min}
          onChange={(value) => handleMinChange(value?.toString() ?? '')}
          placeholder="Min"
          size="small"
        />
        <span className="text-gray-400">-</span>
        <InputNumber
          className="flex-1"
          value={max}
          onChange={(value) => handleMaxChange(value?.toString() ?? '')}
          placeholder="Max"
          size="small"
        />
      </div>
    </Space>
  );
}

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

export interface CotableProps<TData, TValue> {
  /** Tablo sütunlarının tanımları */
  columns: Array<ColumnDef<TData, TValue> & { filterFn?: CotableFilterType }>;
  /** Tablo verileri */
  data: TData[];
  /** Filtreleme özelliğinin gösterilip gösterilmeyeceği */
  showFilters?: boolean;
  /** Sayfalama özelliğinin gösterilip gösterilmeyeceği */
  showPagination?: boolean;
  /** Ek CSS sınıfları */
  className?: string;
  /** Filtre stili ('popover' | 'inline') */
  filterStyle?: 'popover' | 'inline';
  /** Tablo başlığı */
}

function ValueFilter({ column, data }: { column: Column<any, unknown>, data: any[] }) {
  const [searchText, setSearchText] = useState('');
  
  const uniqueValues = useMemo(() => {
    const values = new Set<string>();
    data.forEach(row => {
      const value = row[column.id];
      if (value !== null && value !== undefined) {
        values.add(value.toString());
      }
    });
    return Array.from(values).sort();
  }, [data, column.id]);

  const filteredValues = uniqueValues.filter(value => 
    value.toLowerCase().includes(searchText.toLowerCase())
  );

  const selectedValues = (column.getFilterValue() as string[]) || [];

  const handleChange = (checkedValues: string[]) => {
    column.setFilterValue(checkedValues.length > 0 ? checkedValues : []);
  };

  const handleSelectAll = () => {
    column.setFilterValue(uniqueValues);
  };

  const handleUnselectAll = () => {
    column.setFilterValue([]);
  };

  return (
    <div className="space-y-3">
      <Input
        size="small"
        placeholder="Değerlerde ara..."
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
        prefix={<SearchOutlined className="text-gray-400" />}
      />
      <div className="flex justify-between text-xs">
        <Button type="link" size="small" onClick={handleSelectAll} className="p-0">
          Tümünü Seç
        </Button>
        <Button type="link" size="small" onClick={handleUnselectAll} className="p-0">
          Hiçbirini Seçme
        </Button>
      </div>
      <div 
        style={{ 
          maxHeight: '200px', 
          overflowY: 'auto',
          paddingRight: '8px',
        }} 
        className="scrollable-content"
      >
        {filteredValues.length > 0 ? (
          <Checkbox.Group 
            value={selectedValues} 
            onChange={handleChange} 
            className="flex flex-col gap-2"
            style={{ width: '100%' }}
          >
            {filteredValues.map(value => (
              <div key={value} className="checkbox-item">
                <Checkbox value={value} style={{ width: '100%', margin: 0 }}>
                  <span className="truncate" style={{ display: 'block' }}>{value}</span>
                </Checkbox>
              </div>
            ))}
          </Checkbox.Group>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Sonuç bulunamadı" />
        )}
      </div>
      <style>
        {`
          .scrollable-content {
            scrollbar-width: thin;
            scrollbar-color: #d9d9d9 #f5f5f5;
          }
          .scrollable-content::-webkit-scrollbar {
            width: 6px;
          }
          .scrollable-content::-webkit-scrollbar-track {
            background: #f5f5f5;
            border-radius: 3px;
          }
          .scrollable-content::-webkit-scrollbar-thumb {
            background-color: #d9d9d9;
            border-radius: 3px;
          }
          .scrollable-content::-webkit-scrollbar-thumb:hover {
            background-color: #bfbfbf;
          }
          .checkbox-item {
            padding: 4px 8px;
            border-radius: 4px;
          }
          .checkbox-item:hover {
            background-color: #f5f5f5;
          }
          .ant-checkbox-wrapper {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .ant-checkbox-wrapper span:last-child {
            padding-right: 8px;
          }
        `}
      </style>
    </div>
  );
}

function SearchFilter({ column }: { column: Column<any, unknown> }) {
  const [searchText, setSearchText] = useState('');

  const handleSearch = (value: string) => {
    setSearchText(value);
    column.setFilterValue(value);
  };

  return (
    <div className="space-y-3">
      <Input
        size="small"
        placeholder="Ara..."
        value={searchText}
        onChange={e => handleSearch(e.target.value)}
        prefix={<SearchOutlined className="text-gray-400" />}
        allowClear
      />
    </div>
  );
}

function MultipleChoiceFilter({ column, data }: { column: Column<any, unknown>, data: any[] }) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  
  const options = useMemo(() => {
    const uniqueOptions = new Set<string>();
    data.forEach(row => {
      const value = row[column.id];
      if (value !== null && value !== undefined) {
        value.toString().split(',').forEach((option: string) => 
          uniqueOptions.add(option.trim())
        );
      }
    });
    return Array.from(uniqueOptions).sort();
  }, [data, column.id]);

  const handleChange = (values: string[]) => {
    setSelectedOptions(values);
    column.setFilterValue(values);
  };

  return (
    <div className="space-y-3">
      <Checkbox.Group
        options={options.map(option => ({ label: option, value: option }))}
        value={selectedOptions}
        onChange={handleChange as any}
        className="flex flex-col gap-2"
      />
    </div>
  );
}

export function Cotable<TData, TValue>({
  columns,
  data,
  showFilters = true,
  showPagination = true,
  className = '',
  filterStyle = 'inline',
}: CotableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [showAllFilters, setShowAllFilters] = useState(false);

  const table = useReactTable({
    data,
    columns: columns.map(column => ({
      ...column,
      filterFn: column.meta?.isNumberRange
        ? 'inNumberRange'
        : column.meta?.isSearchFilter
        ? 'searchFilter'
        : column.meta?.isMultipleChoiceFilter
        ? 'multipleChoiceFilter'
        : 'multiSelect'
    })),
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    filterFns: {
      numberRange: numberRangeFilter,
      inNumberRange: numberRangeFilter,
      multiSelect: (row: Row<any>, columnId: string, filterValue: string[]) => {
        const value = row.getValue(columnId);
        if (!Array.isArray(filterValue)) return true;
        if (filterValue.length === 0) return true;
        if (value === null || value === undefined) return false;
        return filterValue.includes(value.toString());
      },
      searchFilter: (row: Row<any>, columnId: string, filterValue: string) => {
        const value = row.getValue(columnId);
        if (!filterValue) return true;
        if (value === null || value === undefined) return false;
        return value.toString().toLowerCase().includes(filterValue.toLowerCase());
      },
      multipleChoiceFilter: (row: Row<any>, columnId: string, filterValue: string[]) => {
        const value = row.getValue(columnId);
        if (!Array.isArray(filterValue)) return true;
        if (filterValue.length === 0) return true;
        if (value === null || value === undefined) return false;
        return filterValue.some(filter => 
          value.toString().toLowerCase().includes(filter.toLowerCase())
        );
      },
    },
  });

  const antColumns = table.getAllColumns().map((column) => {
    const header = table.getHeaderGroups()
      .flatMap(group => group.headers)
      .find(h => h.column.id === column.id);

    const columnConfig = {
      title: typeof column.columnDef.header === 'string'
        ? column.columnDef.header
        : header
          ? flexRender(column.columnDef.header, {
              column,
              header,
              table,
              renderValue: () => header.id,
            } as HeaderContext<TData, unknown>)
          : column.id,
      dataIndex: column.id,
      key: column.id,
      sorter: column.getCanSort(),
      render: (text: any, record: any) => {
        const cell = column.columnDef.cell;
        if (typeof cell === 'function') {
          const row = table.getRowModel().rows.find(r => r.original === record) || table.getRowModel().rows[0];
          const context: CellContext<TData, unknown> = {
            table,
            column,
            row,
            getValue: () => text,
            renderValue: () => text,
            cell: {
              id: `${row.id}_${column.id}`,
              getValue: () => text,
              row,
              column,
              getContext: () => context,
              renderValue: () => text,
              getIsAggregated: () => false,
              getIsGrouped: () => false,
              getIsPlaceholder: () => false,
            },
          };
          return flexRender(cell, context);
        }
        return text;
      },
    };

    if (showFilters && column.getCanFilter()) {
      const filterConfig = {
        ...columnConfig,
        filterMultiple: true,
        filtered: column.getFilterValue() != null,
        filters: undefined,
        filteredValue: undefined,
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
          <Card
            className="shadow-lg"
            bodyStyle={{ padding: 12 }}
            style={{ minWidth: column.columnDef.meta?.isNumberRange ? '280px' : '240px' }}
          >
            {column.columnDef.meta?.isNumberRange ? (
              <div className="space-y-3">
                <RangeFilter column={column} />
                <Divider className="my-2" />
                <Button
                  size="small"
                  onClick={() => {
                    clearFilters?.();
                    column.setFilterValue(undefined);
                  }}
                >
                  Temizle
                </Button>
              </div>
            ) : column.columnDef.meta?.isSearchFilter ? (
              <div className="space-y-3">
                <SearchFilter column={column} />
                <Divider className="my-2" />
                <Button
                  size="small"
                  onClick={() => {
                    clearFilters?.();
                    column.setFilterValue(undefined);
                  }}
                >
                  Temizle
                </Button>
              </div>
            ) : column.columnDef.meta?.isMultipleChoiceFilter ? (
              <div className="space-y-3">
                <MultipleChoiceFilter column={column} data={data} />
                <Divider className="my-2" />
                <Button
                  size="small"
                  onClick={() => {
                    clearFilters?.();
                    column.setFilterValue(undefined);
                  }}
                >
                  Temizle
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <ValueFilter column={column} data={data} />
                <Divider className="my-2" />
                <Button
                  size="small"
                  onClick={() => {
                    clearFilters?.();
                    column.setFilterValue(undefined);
                  }}
                >
                  Temizle
                </Button>
              </div>
            )}
          </Card>
        ),
        filterIcon: (filtered: boolean) => (
          <FilterOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
      };

      return filterConfig;
    }

    return columnConfig;
  });

  const antData = table.getRowModel().rows.map((row, index) => ({
    key: index,
    ...row.original,
  }));

  const tableProps: TableProps<any> = {
    columns: antColumns,
    dataSource: antData,
    title: () => (
      <Space className="w-full justify-end">
        {showFilters && (
          <>
          
            {columnFilters.length > 0 && (
              <Button
                icon={<ClearOutlined />}
                onClick={() => {
                  table.resetColumnFilters();
                  setShowAllFilters(false);
                }}
                danger
              >
                Filtreleri Temizle
              </Button>
            )}
          </>
        )}
      </Space>
    ),
    pagination: showPagination ? {
      total: data.length,
      pageSize: table.getState().pagination.pageSize,
      current: table.getState().pagination.pageIndex + 1,
      showSizeChanger: true,
      showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} kayıt`,
      pageSizeOptions: ['10', '20', '30', '40', '50'],
      onChange: (page, pageSize) => {
        table.setPageIndex(page - 1);
        table.setPageSize(pageSize);
      },
    } : false,
    onChange: (pagination, filters, sorter: any) => {
      if (Array.isArray(sorter)) {
        setSorting(
          sorter.map((s) => ({
            id: s.field as string,
            desc: s.order === 'descend',
          }))
        );
      } else if (sorter.field) {
        setSorting([
          {
            id: sorter.field as string,
            desc: sorter.order === 'descend',
          },
        ]);
      } else {
        setSorting([]);
      }
    },
    size: 'middle',
    bordered: true,
  };

  return (
    <ConfigProvider locale={trTR}>
      <div className={`cotable-wrapper ${className}`}>
        <Table {...tableProps} />
      </div>
    </ConfigProvider>
  );
} 