export const formatFileSize = (bytes?: number | null): string => {
  if (!bytes || bytes < 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
};

export const formatMegabytes = (mb?: number | null): string => {
  if (!mb || mb < 0) return '0 MB';
  const bytes = mb * 1024 * 1024;
  return formatFileSize(bytes);
};

export const formatDate = (dateString?: string | null): string => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '-';

  return date.toLocaleDateString('sr-Latn-RS', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatRelativeTime = (dateString?: string | null): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Danas';
  if (diffDays === 1) return 'Juče';
  if (diffDays < 7) return `Pre ${diffDays} dana`;
  if (diffDays < 30) return `Pre ${Math.floor(diffDays / 7)} nedelja`;
  if (diffDays < 365) return `Pre ${Math.floor(diffDays / 30)} meseci`;
  return `Pre ${Math.floor(diffDays / 365)} godina`;
};

export const formatTime = (seconds: number) => {
  const secsSafe = Number.isFinite(seconds) && seconds >= 0 ? seconds : 0;
  const mins = Math.floor(secsSafe / 60);
  const secs = Math.floor(secsSafe % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
