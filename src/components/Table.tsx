import React from 'react';

/**
 * Table component props
 */
interface TableProps<T> {
  data: T[];
  columns: {
    header: string;
    accessor: keyof T | ((row: T) => React.ReactNode);
    className?: string;
    cell?:((row: T) => React.ReactNode);
  }[];
  onRowClick?: (row: T) => void;
  className?: string;
  isLoading?: boolean;
  emptyMessage?: string;
}

/**
 * Table component for displaying data in rows and columns
 * @param data - Array of data to display
 * @param columns - Configuration for table columns
 * @param onRowClick - Function to call when a row is clicked
 * @param className - Additional CSS classes
 * @param isLoading - Whether the table is in loading state
 * @param emptyMessage - Message to display when there is no data
 */
function Table<T extends Record<string, any>>({ 
  data, 
  columns, 
  onRowClick, 
  className = '',
  isLoading = false,
  emptyMessage = 'No data available'
}: TableProps<T>) {
  // Function to get cell value based on accessor
  const getCellValue = (row: T, accessor: keyof T | ((row: T) => React.ReactNode)) => {
    if (typeof accessor === 'function') {
      return accessor(row);
    }
    return row[accessor];
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="w-full overflow-auto">
        <table className={`w-full caption-bottom text-sm ${className}`}>
          <thead className="[&_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              {columns.map((column, index) => (
                <th key={index} className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b transition-colors hover:bg-muted/50">
                {columns.map((_, colIndex) => (
                  <td key={colIndex} className="p-4">
                    <div className="h-4 w-full animate-pulse rounded bg-muted"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Empty state
  if (data.length === 0) {
    return (
      <div className="w-full overflow-auto">
        <table className={`w-full caption-bottom text-sm ${className}`}>
          <thead className="[&_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              {columns.map((column, index) => (
                <th key={index} className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
        </table>
        <div className="flex h-[200px] w-full items-center justify-center text-muted-foreground">
          {emptyMessage}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto">
      <table className={`w-full caption-bottom text-sm ${className}`}>
        <thead className="[&_tr]:border-b">
          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
            {columns.map((column, index) => (
              <th 
                key={index} 
                className={`h-12 px-4 text-left align-middle font-medium text-muted-foreground ${column.className || ''}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {data.map((row, rowIndex) => (
            <tr 
              key={rowIndex} 
              className={`border-b transition-colors hover:bg-muted/50 ${onRowClick ? 'cursor-pointer' : ''}`}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((column, colIndex) => (
                <td 
                  key={colIndex} 
                  className={`p-4 align-middle ${column.className || ''}`}
                >
                  {getCellValue(row, column.accessor)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;