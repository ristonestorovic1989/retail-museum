'use client';

import { Button } from '@/components/ui/button';
import { Download, Edit, ExternalLink, Hash, MoreVertical, Share2, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AssetListItem } from '@/features/assets/types';
import { TFn } from '@/types/i18n';

type AssetPreviewActionsDropdownProps = {
  asset: AssetListItem;
  t: TFn;
  onDelete: (asset: AssetListItem) => void;
  onDownload: () => void;
  onShare: () => void;
};

export const AssetPreviewActionsDropdown = ({
  asset,
  t,
  onDelete,
  onDownload,
  onShare,
}: AssetPreviewActionsDropdownProps) => {
  const handleCopyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
  };

  const handleOpenInNewTab = () => {
    window.open(asset.path, '_blank', 'noopener,noreferrer');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="cursor-pointer" onClick={onDownload}>
          <Download className="h-4 w-4 mr-2" />
          {t('actions.download', { defaultValue: 'Download' })}
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer" onClick={onShare}>
          <Share2 className="h-4 w-4 mr-2" />
          {t('preview.actions.shareLink', {
            defaultValue: 'Copy share link',
          })}
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => handleCopyToClipboard(asset.path)}
        >
          <Hash className="h-4 w-4 mr-2" />
          {t('preview.actions.copyDirectUrl', {
            defaultValue: 'Copy direct URL',
          })}
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => handleCopyToClipboard(asset.guid)}
        >
          <Hash className="h-4 w-4 mr-2" />
          {t('preview.actions.copyGuid', {
            defaultValue: 'Copy GUID',
          })}
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer" onClick={handleOpenInNewTab}>
          <ExternalLink className="h-4 w-4 mr-2" />
          {t('preview.actions.openInNewTab', {
            defaultValue: 'Open in new tab',
          })}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer text-destructive"
          onClick={() => onDelete(asset)}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          {t('delete.confirm', { defaultValue: 'Delete' })}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
