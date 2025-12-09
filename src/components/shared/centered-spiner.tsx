'use client';

type CenteredSpinnerProps = {
  label?: string;
};

export function CenteredSpinner({ label }: CenteredSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-3">
      <div className="h-8 w-8 rounded-full border-2 border-muted border-t-primary animate-spin" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
