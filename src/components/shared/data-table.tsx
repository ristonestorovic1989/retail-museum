'use client';

import React, { useState } from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { CenteredSpinner } from '@/components/shared/centered-spiner';
import { TablePagination } from '@/components/shared/table-pagination';

type RowId = string | number;

export type ColumnDef<T extends { id: RowId }> = {
  id: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  className?: string;
};

type DataTableProps<T extends { id: RowId }> = {
  columns: ColumnDef<T>[];
  data: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  isLoading?: boolean;
  loadingLabel?: string;
  emptyMessage?: string;
  enableSelection?: boolean;
  selectedLabel?: (count: number) => string;
  bulkActionLabel?: string;
  clearSelectionLabel?: string;
  onBulkAction?: (rows: T[]) => Promise<void> | void;
  selectedIds?: RowId[];
  onSelectedIdsChange?: (ids: RowId[]) => void;
  onRowClick?: (row: T) => void;
};

export function DataTable<T extends { id: RowId }>(props: DataTableProps<T>) {
  const {
    columns,
    data,
    page,
    pageSize,
    totalCount,
    onPageChange,
    isLoading,
    loadingLabel = 'Loading…',
    emptyMessage = 'No data found.',
    enableSelection = false,
    selectedLabel,
    bulkActionLabel = 'Apply',
    clearSelectionLabel = 'Clear selection',
    onBulkAction,
    onRowClick,
    selectedIds: controlledSelectedIds,
    onSelectedIdsChange,
    onPageSizeChange,
    pageSizeOptions,
  } = props;

  const [uncontrolledSelectedIds, setUncontrolledSelectedIds] = useState<RowId[]>([]);

  const hasControlledSelection = enableSelection && controlledSelectedIds && onSelectedIdsChange;
  const selectedIds = hasControlledSelection ? controlledSelectedIds! : uncontrolledSelectedIds;

  const setSelectedIds = (next: RowId[]) => {
    if (hasControlledSelection) {
      onSelectedIdsChange!(next);
    } else {
      setUncontrolledSelectedIds(next);
    }
  };

  const rowsById = new Map<RowId, T>();
  data.forEach((row) => rowsById.set(row.id, row));

  const allIdsOnPage = data.map((row) => row.id);
  const allSelectedOnPage =
    enableSelection &&
    allIdsOnPage.length > 0 &&
    allIdsOnPage.every((id) => selectedIds.includes(id));

  const toggleSelectOne = (id: RowId) => {
    if (!enableSelection) return;
    const current = selectedIds;
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];

    setSelectedIds(next);
  };

  const toggleSelectAllOnPage = () => {
    if (!enableSelection) return;
    const current = selectedIds;

    let next: RowId[];
    if (allSelectedOnPage) {
      next = current.filter((id) => !allIdsOnPage.includes(id));
    } else {
      const merged = new Set<RowId>([...current, ...allIdsOnPage]);
      next = Array.from(merged);
    }

    setSelectedIds(next);
  };

  const selectedCount = enableSelection ? selectedIds.length : 0;

  const handleBulkActionClick = async () => {
    if (!enableSelection || !onBulkAction || selectedCount === 0) return;
    const selectedRows = selectedIds.map((id) => rowsById.get(id)).filter(Boolean) as T[];

    await onBulkAction(selectedRows);
    setSelectedIds([]);
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  if (isLoading) {
    return <CenteredSpinner label={loadingLabel} />;
  }

  const totalColumns = columns.length + (enableSelection ? 1 : 0);

  return (
    <>
      {enableSelection && onBulkAction && selectedCount > 0 && (
        <div className="mb-4 flex items-center justify-between rounded-md border bg-muted/50 px-3 py-2 text-sm">
          <span className="text-muted-foreground">
            {selectedLabel ? selectedLabel(selectedCount) : `${selectedCount} selected`}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleClearSelection}>
              {clearSelectionLabel}
            </Button>
            <Button variant="destructive" size="sm" onClick={handleBulkActionClick}>
              {bulkActionLabel}
            </Button>
          </div>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            {enableSelection && (
              <TableHead className="w-10">
                <Checkbox
                  checked={allSelectedOnPage}
                  aria-label="Select all"
                  onCheckedChange={() => toggleSelectAllOnPage()}
                />
              </TableHead>
            )}
            {columns.map((col) => (
              <TableHead key={col.id} className={col.className}>
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((row) => (
              <TableRow
                key={row.id}
                className={onRowClick ? 'cursor-pointer' : undefined}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {enableSelection && (
                  <TableCell className="w-10" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedIds.includes(row.id)}
                      onCheckedChange={() => toggleSelectOne(row.id)}
                      aria-label="Select row"
                    />
                  </TableCell>
                )}
                {columns.map((col) => (
                  <TableCell key={col.id} className={col.className}>
                    {col.cell(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={totalColumns} className="py-8 text-center text-muted-foreground">
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <TablePagination
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        pageSizeOptions={pageSizeOptions}
        onPageSizeChange={(newPageSize) => {
          setSelectedIds([]);
          if (onPageSizeChange) {
            onPageSizeChange(newPageSize);
          }
        }}
        onPageChange={(newPage) => {
          setSelectedIds([]);
          onPageChange(newPage);
        }}
      />
    </>
  );
}
