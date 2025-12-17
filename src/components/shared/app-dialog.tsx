'use client';

import { ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button, type ButtonBaseProps } from '@/components/ui/button';

type DialogAction = {
  label: ReactNode;
  onClick: () => void;
  variant?: ButtonBaseProps['variant'];
  disabled?: boolean;
};

type AppDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRequestClose?: () => void;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  primaryAction?: DialogAction;
  showCancel?: boolean;
  cancelLabel?: ReactNode;
  isBusy?: boolean;
  showCloseButton?: boolean;
};

export function AppDialog({
  open,
  onOpenChange,
  onRequestClose,
  title,
  description,
  children,
  primaryAction,
  showCancel = true,
  cancelLabel = 'Cancel',
  isBusy = false,
  showCloseButton,
}: AppDialogProps) {
  const handleClose = () => {
    if (isBusy) return;
    onRequestClose?.();
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          handleClose();
        } else {
          onOpenChange(true);
        }
      }}
    >
      <DialogContent className="sm:max-w-xl" showCloseButton={showCloseButton}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="py-4">{children}</div>

        {(primaryAction || showCancel) && (
          <div className="flex justify-end gap-2">
            {showCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isBusy}
                className="hover:bg-red-600/80 hover:text-white"
              >
                {cancelLabel}
              </Button>
            )}

            {primaryAction && (
              <Button
                type="button"
                variant={primaryAction.variant ?? 'default'}
                onClick={primaryAction.onClick}
                disabled={primaryAction.disabled}
              >
                {primaryAction.label}
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
