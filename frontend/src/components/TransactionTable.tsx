import React from "react";
import { DataTable } from "primereact/datatable";
import type {
  DataTableExpandedRows,
  DataTablePageEvent
} from "primereact/datatable";
import type { VirtualScrollerLazyEvent } from "primereact/virtualscroller";

export interface TransactionTableProps<T> {
  data: T[];
  dataKey: string;
  expandedRows?: DataTableExpandedRows;
  onToggleRows?: (e: { data: DataTableExpandedRows }) => void;
  rowExpansionTemplate?: (data: T) => React.ReactNode;
  children: React.ReactNode;
  paginator?: boolean;
  first?: number;
  rows?: number;
  totalRecords?: number;
  onPage?: (e: DataTablePageEvent) => void;
  scrollable?: boolean;
  scrollHeight?: string;
  lazy?: boolean;
  onLazyLoad?: (e: VirtualScrollerLazyEvent) => void;
}

const TransactionTable = <T extends object>({
  data,
  dataKey,
  expandedRows,
  onToggleRows,
  rowExpansionTemplate,
  paginator,
  first,
  rows,
  totalRecords,
  onPage,
  scrollable,
  scrollHeight,
  lazy,
  onLazyLoad,
  children,
  
}: TransactionTableProps<T>) => {
  return (
    <DataTable
      value={data}
      dataKey={dataKey}
      {...(expandedRows !== undefined && { expandedRows })}
      {...(onToggleRows && { onRowToggle: onToggleRows })}
      {...(rowExpansionTemplate && { rowExpansionTemplate })}
      {...(paginator !== undefined && { paginator })}
      {...(first !== undefined && { first })}
      {...(rows !== undefined && { rows })}
      {...(totalRecords !== undefined && { totalRecords })}
      {...(onPage && { onPage })}
      {...(scrollable && { scrollable })}
      {...(scrollHeight && { scrollHeight })}
      {...(lazy && { lazy })}
      {...(onLazyLoad && { onLazyLoad })}
    >
      {children}
    </DataTable>
  );
};

export default TransactionTable;