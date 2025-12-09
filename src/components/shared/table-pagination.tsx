'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;

type TablePaginationProps = {
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;

  pageSizeOptions?: readonly number[];

  onPageSizeChange?: (pageSize: number) => void;
};

export function TablePagination({
  page,
  pageSize,
  totalCount,
  onPageChange,
  pageSizeOptions = PAGE_SIZE_OPTIONS,
  onPageSizeChange,
}: TablePaginationProps) {
  const t = useTranslations('table');

  const totalPages = totalCount === 0 ? 1 : Math.ceil(totalCount / pageSize);

  const canPrev = page > 1;
  const canNext = page < totalPages;

  const from = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = totalCount === 0 ? 0 : Math.min(page * pageSize, totalCount);

  const summary =
    totalCount > 0 ? t('pagination', { from, to, total: totalCount }) : t('paginationEmpty');

  const handlePrev = () => {
    if (!canPrev) return;
    onPageChange(page - 1);
  };

  const handleNext = () => {
    if (!canNext) return;
    onPageChange(page + 1);
  };

  const handlePageSizeChange = (value: string) => {
    const size = Number(value);
    if (!Number.isNaN(size) && size > 0) {
      onPageSizeChange?.(size);
      onPageChange(1);
    }
  };

  return (
    <div className="flex flex-col gap-3 mt-4 items-start justify-between text-sm text-muted-foreground md:flex-row md:items-center">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <div>{summary}</div>

        <div className="flex items-center gap-2">
          <span>{t('rowsPerPage')}:</span>
          <Select
            value={String(pageSize)}
            onValueChange={handlePageSizeChange}
            disabled={!onPageSizeChange}
          >
            <SelectTrigger className="h-8 w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled={!canPrev} onClick={handlePrev}>
          {t('prev')}
        </Button>
        <span>
          {page} / {totalPages}
        </span>
        <Button variant="outline" size="sm" disabled={!canNext} onClick={handleNext}>
          {t('next')}
        </Button>
      </div>
    </div>
  );
}
