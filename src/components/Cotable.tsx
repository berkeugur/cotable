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
import { useState, useMemo, useCallback, useEffect } from 'react';
import { Table, ConfigProvider, Button, Space, Input, InputNumber, Card, Divider, Checkbox, Empty } from 'antd';
import { FilterOutlined, ClearOutlined, SearchOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';
import trTR from 'antd/locale/tr_TR';
import debounce from 'lodash/debounce';
import React from 'react';

// Nested objeyi düzleştirme fonksiyonu
const flattenObject = (obj: Record<string, any>, prefix = ''): Record<string, any> => {
  if (!obj || typeof obj !== 'object') return {};

  return Object.keys(obj).reduce((acc: Record<string, any>, key: string) => {
    const propName = prefix ? `${prefix}.${key}` : key;
    
    if (obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      const nested = flattenObject(obj[key], propName);
      Object.assign(acc, nested);
    } else {
      acc[propName] = obj[key];
    }
    
    return acc;
  }, {});
};

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

export interface CotableProps<TData = any, TValue = unknown> {
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
  /** Global arama özelliğinin gösterilip gösterilmeyeceği */
  showGlobalSearch?: boolean;

}

function ValueFilter({ column, data, table }: { column: Column<any, unknown>, data: any[], table: any }) {
  const [searchText, setSearchText] = useState('');
  
  const uniqueValues = useMemo(() => {
    const values = new Set<string>();
    data.forEach(row => {
      const value = column.id.includes('.')
        ? column.id.split('.').reduce((obj: any, key: string) => obj?.[key], row)
        : (row as any)[column.id];

      if (value !== null && value !== undefined) {
        // Cell render fonksiyonu varsa, onun sonucunu kullan
        if (column.columnDef.cell && typeof column.columnDef.cell === 'function') {
          const cellContext = {
            getValue: () => value,
            row: { original: row },
            column,
            table,
            renderValue: () => value,
          } as any;
          
          const renderedValue = column.columnDef.cell(cellContext);
          if (React.isValidElement(renderedValue) && 'props' in renderedValue && 
              typeof renderedValue.props === 'object' && renderedValue.props !== null && 
              'children' in renderedValue.props) {
            const children = renderedValue.props.children;
            if (children !== null && children !== undefined) {
              values.add(children.toString());
            }
          } else if (renderedValue !== null && renderedValue !== undefined) {
            values.add(renderedValue.toString());
          }
        } else {
          values.add(value.toString());
        }
      }
    });
    return Array.from(values).sort();
  }, [data, column.id, column.columnDef.cell, table]);

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

function MultipleChoiceFilter({ column, data, table }: { column: Column<any, unknown>, data: any[], table: any }) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  
  const options = useMemo(() => {
    const uniqueOptions = new Set<string>();
    
    data.forEach(row => {
      const value = column.id.includes('.')
        ? column.id.split('.').reduce((obj: any, key: string) => obj?.[key], row)
        : (row as any)[column.id];

      if (value !== null && value !== undefined) {
        // Cell render fonksiyonu varsa, onun sonucunu kullan
        if (column.columnDef.cell && typeof column.columnDef.cell === 'function') {
          const cellContext = {
            getValue: () => value,
            row: { original: row },
            column,
            table,
            renderValue: () => value,
          } as any;
          
          const renderedValue = column.columnDef.cell(cellContext);
          if (React.isValidElement(renderedValue) && 'props' in renderedValue && 
              typeof renderedValue.props === 'object' && renderedValue.props !== null && 
              'children' in renderedValue.props) {
            const children = renderedValue.props.children;
            if (children !== null && children !== undefined) {
              uniqueOptions.add(children.toString());
            }
          } else if (renderedValue !== null && renderedValue !== undefined) {
            uniqueOptions.add(renderedValue.toString());
          }
        } else {
          value.toString().split(',').forEach((option: string) => 
            uniqueOptions.add(option.trim())
          );
        }
      }
    });
    return Array.from(uniqueOptions).sort();
  }, [data, column.id, column.columnDef.cell, table]);

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

// Türkçe karakterleri normalize etme fonksiyonu
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[ıİ]/g, 'i')
    .replace(/[şŞ]/g, 's')
    .replace(/[ğĞ]/g, 'g')
    .replace(/[üÜ]/g, 'u')
    .replace(/[öÖ]/g, 'o')
    .replace(/[çÇ]/g, 'c');
};

export function Cotable<TData, TValue>({
  columns,
  data,
  showFilters = true,
  showPagination = true,
  className = '',
  filterStyle = 'inline',
  showGlobalSearch = true,

}: CotableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [showAllFilters, setShowAllFilters] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  const [filteredData, setFilteredData] = useState<TData[]>(data);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Data değiştiğinde filteredData'yı güncelle
  useEffect(() => {
    if (!globalFilter) {
      setFilteredData(data);
      setCurrentPage(1);
      return;
    }

    const normalizedSearch = normalizeText(globalFilter);
    const filtered = data.filter((item) => {
      const flattenedItem = flattenObject(item as Record<string, any>);
      return Object.entries(flattenedItem).some(([key, value]) => {
        if (value === null || value === undefined) return false;
        if (typeof value === 'object') {
          const nestedStr = JSON.stringify(value);
          return normalizeText(nestedStr).includes(normalizedSearch);
        }
        return normalizeText(value.toString()).includes(normalizedSearch);
      });
    });

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [data, globalFilter]);

  const debouncedSearch = useCallback(
    debounce((searchTerm: string) => {
      if (!searchTerm) {
        setFilteredData(data);
        setCurrentPage(1);
        return;
      }

      const normalizedSearch = normalizeText(searchTerm);
      const filtered = data.filter((item) => {
        const flattenedItem = flattenObject(item as Record<string, any>);
        return Object.entries(flattenedItem).some(([key, value]) => {
          if (value === null || value === undefined) return false;
          if (typeof value === 'object') {
            const nestedStr = JSON.stringify(value);
            return normalizeText(nestedStr).includes(normalizedSearch);
          }
          return normalizeText(value.toString()).includes(normalizedSearch);
        });
      });

      setFilteredData(filtered);
      setCurrentPage(1);
    }, 300),
    [data]
  );

  // Kolon filtreleri değiştiğinde filtrelenmiş verileri güncelle
  useEffect(() => {
    let newFilteredData = data;

    // Her bir kolon filtresi için filtreleme uygula
    columnFilters.forEach(filter => {
      const column = table.getColumn(filter.id);
      if (!column) return;

      newFilteredData = newFilteredData.filter(item => {
        const value = filter.id.includes('.')
          ? filter.id.split('.').reduce((obj: any, key: string) => obj?.[key], item)
          : (item as any)[filter.id];

        if (value === null || value === undefined || value === '') return false;

        const filterFn = column.getFilterFn();
        if (!filterFn) return true;

        const row = {
          id: (item as any).id?.toString() || Math.random().toString(36).substr(2, 9),
          index: 0,
          original: item,
          depth: 0,
          getValue: () => value,
          getUniqueValues: () => new Set(),
          renderValue: () => value,
          subRows: [],
          getParentRow: () => null,
          getLeafRows: () => [],
          originalSubRows: [],
          getAllCells: () => [],
          getIsSelected: () => false,
          getIsGrouped: () => false,
          getCanExpand: () => false,
          getIsExpanded: () => false,
          toggleExpanded: () => {},
          getVisibleCells: () => [],
          _getAllVisibleCells: () => [],
          getCenterVisibleCells: () => [],
          getLeftVisibleCells: () => [],
          getRightVisibleCells: () => [],
          getParentRows: () => [],
          getCanPin: () => false,
          getIsPinned: () => false,
          getPinnedIndex: () => 0,
          getIsAllParentsExpanded: () => true,
          getIsFirstChild: () => false,
          getIsLastChild: () => false,
          getPrePinnedIndex: () => 0,
          getPostPinnedIndex: () => 0,
          getIsAllParentsFolded: () => false,
          getIsFolded: () => false,
          toggleFolded: () => {},
          getIsAllParentsFiltered: () => false,
          getIsFiltered: () => false,
          _getAllVisibleCellsById: () => ({})
        } as unknown as Row<any>;

        return filterFn(
          row,
          filter.id,
          filter.value,
          () => {}
        );
      });
    });

    setFilteredData(newFilteredData);
    setCurrentPage(1);
  }, [columnFilters, data]);

  const table = useReactTable({
    data: filteredData,
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
      pagination: {
        pageIndex: currentPage - 1,
        pageSize: pageSize,
      },
    },
    filterFns: {
      numberRange: numberRangeFilter,
      inNumberRange: numberRangeFilter,
      multiSelect: (row: Row<any>, columnId: string, filterValue: string[]) => {
        const column = table.getColumn(columnId);
        const value = row.getValue(columnId);
        let displayValue = value;

        // Cell render fonksiyonu varsa, onun sonucunu kullan
        if (column?.columnDef.cell && typeof column.columnDef.cell === 'function') {
          const cellContext = {
            getValue: () => value,
            row,
            column,
            table,
            renderValue: () => value,
          } as any;
          
          const renderedValue = column.columnDef.cell(cellContext);
          if (React.isValidElement(renderedValue) && 'props' in renderedValue && typeof renderedValue.props === 'object' && renderedValue.props !== null && 'children' in renderedValue.props) {
            displayValue = renderedValue.props.children;
          } else {
            displayValue = renderedValue;
          }
        }

        if (!Array.isArray(filterValue)) return true;
        if (filterValue.length === 0) return true;
        if (displayValue === null || displayValue === undefined) return false;
        return filterValue.includes(displayValue.toString());
      },
      searchFilter: (row: Row<any>, columnId: string, filterValue: string) => {
        const column = table.getColumn(columnId);
        const value = row.getValue(columnId);
        let displayValue = value;

        // Cell render fonksiyonu varsa, onun sonucunu kullan
        if (column?.columnDef.cell && typeof column.columnDef.cell === 'function') {
          const cellContext = {
            getValue: () => value,
            row,
            column,
            table,
            renderValue: () => value,
          } as any;
          
          const renderedValue = column.columnDef.cell(cellContext);
          if (React.isValidElement(renderedValue) && 'props' in renderedValue && typeof renderedValue.props === 'object' && renderedValue.props !== null && 'children' in renderedValue.props) {
            displayValue = renderedValue.props.children;
          } else {
            displayValue = renderedValue;
          }
        }

        if (!filterValue) return true;
        if (displayValue === null || displayValue === undefined) return false;
        return normalizeText(displayValue.toString()).includes(normalizeText(filterValue));
      },
      multipleChoiceFilter: (row: Row<any>, columnId: string, filterValue: string[]) => {
        const column = table.getColumn(columnId);
        const value = row.getValue(columnId);
        let displayValue = value;

        // Cell render fonksiyonu varsa, onun sonucunu kullan
        if (column?.columnDef.cell && typeof column.columnDef.cell === 'function') {
          const cellContext = {
            getValue: () => value,
            row,
            column,
            table,
            renderValue: () => value,
          } as any;
          
          const renderedValue = column.columnDef.cell(cellContext);
          if (React.isValidElement(renderedValue) && 'props' in renderedValue && typeof renderedValue.props === 'object' && renderedValue.props !== null && 'children' in renderedValue.props) {
            displayValue = renderedValue.props.children;
          } else {
            displayValue = renderedValue;
          }
        }

        if (!Array.isArray(filterValue)) return true;
        if (filterValue.length === 0) return true;
        if (displayValue === null || displayValue === undefined) return false;
        const normalizedValue = normalizeText(displayValue.toString());
        return filterValue.some(filter => 
          normalizedValue.includes(normalizeText(filter))
        );
      },
    },
  });

  const antData = useMemo(() => {
    return filteredData.map((item: any) => {
      const flattenedItem = flattenObject(item);
      const key = item.id || Math.random().toString(36).substr(2, 9);
      return {
        key,
        ...flattenedItem,
        original: item
      };
    });
  }, [filteredData]);

  const antColumns = table.getAllColumns().map((column) => {
    const header = table.getHeaderGroups()
      .flatMap(group => group.headers)
      .find(h => h.column.id === column.id);

    const columnConfig: any = {
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
        const value = column.id.includes('.')
          ? column.id.split('.').reduce((obj, key) => obj?.[key], record.original)
          : record[column.id];
        
        if (typeof cell === 'function') {
          const row = {
            id: record.key,
            index: 0,
            original: record.original || record,
            getValue: () => value,
            renderValue: () => value,
          };

          const cellContext = {
            table,
            row,
            column,
            getValue: () => value,
            renderValue: () => value,
            cell: {
              id: `${record.key}_${column.id}`,
              getValue: () => value,
              row,
              column,
              getContext: () => cellContext,
              renderValue: () => value,
              getIsAggregated: () => false,
              getIsGrouped: () => false,
              getIsPlaceholder: () => false,
            }
          } as unknown as CellContext<TData, unknown>;

          return flexRender(cell, {
            ...cellContext,
            table: {
              ...table,
              options: {
                ...table.options,
               
              },
            },
          });
        }
        return value;
      }
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
                <MultipleChoiceFilter column={column} data={data} table={table} />
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
                <ValueFilter column={column} data={data} table={table} />
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

  const tableProps: TableProps<any> = {
    columns: antColumns,
    dataSource: antData,
    rowKey: (record: any) => record.key || record.id || Math.random().toString(36).substr(2, 9),
    title: () => (
      <Space className="w-full justify-between">
        {showGlobalSearch && (
          <Input
            placeholder="Tüm alanlarda ara..."
            prefix={<SearchOutlined />}
            value={globalFilter}
            onChange={e => {
              setGlobalFilter(e.target.value);
              debouncedSearch(e.target.value);
            }}
            allowClear
            className="w-72"
          />
        )}
        <Space>
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
      </Space>
    ),
    pagination: showPagination ? {
      total: filteredData.length,
      pageSize: pageSize,
      current: currentPage,
      showSizeChanger: true,
      showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} kayıt`,
      pageSizeOptions: ['10', '20', '30', '40', '50'],
      onChange: (page, size) => {
        setCurrentPage(page);
        setPageSize(size);
        table.setPageIndex(page - 1);
        table.setPageSize(size);
      },
      locale: {
        items_per_page: '/ sayfa',
        jump_to: 'Git',
        jump_to_confirm: 'onayla',
        page: 'Sayfa',
        prev_page: 'Önceki Sayfa',
        next_page: 'Sonraki Sayfa',
        prev_5: 'Önceki 5 Sayfa',
        next_5: 'Sonraki 5 Sayfa',
        prev_3: 'Önceki 3 Sayfa',
        next_3: 'Sonraki 3 Sayfa'
      }
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