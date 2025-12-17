'use client';

import { useState, DragEvent, ChangeEvent } from 'react';
import { Upload as UploadIcon, FileImage, X } from 'lucide-react';
import { Upload, type UrlStorage } from 'tus-js-client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

import { AppDialog } from '@/components/shared/app-dialog';
import { TFn } from '@/types/i18n';

type Props = {
  t: TFn;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploaded?: () => void;
  companyId: number;
};

type PendingFile = {
  id: string;
  file: File;
};

const noResumeStorage: UrlStorage = {
  async findUploadsByFingerprint(_fingerprint: string) {
    return [];
  },
  async removeUpload(_fingerprint: string) {},
  async addUpload(_fingerprint: string, _upload) {
    return '';
  },
  async findAllUploads() {
    return [];
  },
};

export function AssetsUploadDialog({ t, open, onOpenChange, onUploaded, companyId }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    if (!files.length) return;

    const mapped: PendingFile[] = files.map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
      file,
    }));

    setPendingFiles((prev) => [...prev, ...mapped]);

    toast.success(t('upload.toast.selectedTitle', { defaultValue: 'Files selected' }), {
      description: t('upload.toast.selectedDescription', {
        defaultValue: `${files.length} file(s) ready to upload`,
        count: files.length,
      }),
    });
  };

  const handleRemoveFile = (id: string) => {
    if (isUploading) return;
    setPendingFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleUpload = async () => {
    if (!pendingFiles.length || isUploading) return;

    try {
      setIsUploading(true);

      for (const pf of pendingFiles) {
        const file = pf.file;

        await new Promise<void>((resolve, reject) => {
          const upload = new Upload(file, {
            endpoint: '/api/assets/upload',
            chunkSize: 10 * 1024 * 1024,
            retryDelays: [0, 1000, 3000, 5000],
            metadata: {
              name: file.name,
              contentType: file.type || 'application/octet-stream',
            },
            urlStorage: noResumeStorage,
            removeFingerprintOnSuccess: true,
            headers: {
              'X-Company-Id': String(companyId ?? 1),
            },
            onError(error) {
              console.error('TUS upload error', error);
              reject(error);
            },
            onProgress(bytesSent, bytesTotal) {
              const progress = ((bytesSent / bytesTotal) * 100).toFixed(1);
            },
            onSuccess() {
              resolve();
            },
          });

          upload.start();
        });
      }

      toast.success(t('upload.toast.successTitle', { defaultValue: 'Upload complete' }), {
        description: t('upload.toast.successDescription', {
          defaultValue: 'Your files have been uploaded.',
        }),
      });

      setPendingFiles([]);
      onUploaded?.();
      onOpenChange(false);
    } catch (error: any) {
      console.error(error);

      toast.error(t('upload.toast.errorTitle', { defaultValue: 'Upload failed' }), {
        description:
          error?.message ??
          t('upload.toast.errorDescription', {
            defaultValue: 'Something went wrong while uploading your files.',
          }),
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRequestClose = () => {
    if (isUploading) return;
    setPendingFiles([]);
  };

  const title = t('upload.title', { defaultValue: 'Upload assets' });
  const description = t('upload.description', {
    defaultValue: 'Drag and drop files or click to browse.',
  });

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      onRequestClose={handleRequestClose}
      title={title}
      description={description}
      isBusy={isUploading}
      cancelLabel={t('upload.actions.cancel', { defaultValue: 'Cancel' })}
      primaryAction={{
        label: isUploading
          ? t('upload.actions.uploading', { defaultValue: 'Uploading…' })
          : t('upload.actions.upload', { defaultValue: 'Upload' }),
        onClick: handleUpload,
        disabled: !pendingFiles.length || isUploading,
      }}
    >
      <div className="space-y-4">
        <div
          className={`relative flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-border bg-muted/50 hover:bg-muted/70'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            multiple
            onChange={handleFileInput}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            disabled={isUploading}
          />

          <div className="rounded-full bg-primary/10 p-4">
            <UploadIcon className="h-8 w-8 text-primary" />
          </div>

          <div>
            <p className="text-sm font-medium text-foreground">
              {t('upload.dropLabel', {
                defaultValue: 'Drop files here or click to browse',
              })}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {t('upload.supportedTypes', {
                defaultValue: 'Support for images, videos and documents',
              })}
            </p>
          </div>
        </div>

        {pendingFiles.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">
              {t('upload.selectedFiles', {
                defaultValue: 'Selected files',
              })}
            </p>

            <div className="max-h-48 space-y-2 overflow-y-auto rounded-md border p-2 text-sm">
              {pendingFiles.map((pf) => (
                <div
                  key={pf.id}
                  className="flex items-center justify-between gap-2 rounded-md bg-background px-2 py-1"
                >
                  <div className="flex items-center gap-2">
                    <FileImage className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span className="truncate">{pf.file.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {(pf.file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleRemoveFile(pf.id)}
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppDialog>
  );
}
