"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  RowSelectionState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  getRowId?: (row: TData) => string;
  /** Column id used by the search box. Omit to hide the search box. */
  searchColumnId?: string;
  searchPlaceholder?: string;
  /** Noun used in the footer count, e.g. { one: "account", other: "accounts" }. */
  countNoun?: { one: string; other: string };
  emptyMessage?: React.ReactNode;
  onRowClick?: (row: TData) => void;
  renderToolbar?: (
    selectedRows: TData[],
    clearSelection: () => void,
  ) => React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  getRowId,
  searchColumnId,
  searchPlaceholder = "Search...",
  countNoun = { one: "row", other: "rows" },
  emptyMessage = "No results.",
  onRowClick,
  renderToolbar,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  const table = useReactTable({
    data,
    columns,
    getRowId,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      columnFilters,
      rowSelection,
    },
  });

  const selectedRows = table.getSelectedRowModel().rows.map((r) => r.original);
  const clearSelection = React.useCallback(() => setRowSelection({}), []);
  const rowCount = table.getFilteredRowModel().rows.length;
  const searchColumn = searchColumnId
    ? table.getColumn(searchColumnId)
    : undefined;

  return (
    <div>
      {(searchColumn || renderToolbar) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-4">
          {searchColumn ? (
            <Input
              placeholder={searchPlaceholder}
              value={(searchColumn.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                searchColumn.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
          ) : (
            <span />
          )}
          {renderToolbar && selectedRows.length > 0 ? (
            <div className="flex items-center gap-2">
              {renderToolbar(selectedRows, clearSelection)}
            </div>
          ) : null}
        </div>
      )}
      <div className="rounded-md border shadow-sm bg-white overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "text-xs uppercase font-semibold text-slate-500 py-3 px-6",
                      (
                        header.column.columnDef.meta as
                          | { className?: string }
                          | undefined
                      )?.className,
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={
                    onRowClick ? () => onRowClick(row.original) : undefined
                  }
                  className={cn(
                    "hover:bg-slate-50/50 data-[state=selected]:bg-blue-50/60 transition-colors",
                    onRowClick && "cursor-pointer",
                  )}
                >
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta as
                      | { stopClick?: boolean; className?: string }
                      | undefined;
                    return (
                      <TableCell
                        key={cell.id}
                        className={cn("py-3 px-6", meta?.className)}
                        onClick={
                          meta?.stopClick
                            ? (e) => e.stopPropagation()
                            : undefined
                        }
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-slate-500"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between gap-2 py-4">
        <p className="text-xs text-slate-500">
          {selectedRows.length > 0
            ? `${selectedRows.length} of ${rowCount} selected`
            : `${rowCount} ${rowCount === 1 ? countNoun.one : countNoun.other}`}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
