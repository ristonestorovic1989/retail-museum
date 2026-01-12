import React from 'react';

type Props = {
  icon: React.ReactNode;
  label: string;
  value: string;
  full?: boolean;
};

export function InfoBlock({ icon, label, value, full }: Props) {
  return (
    <div className={`rounded-xl border p-4 ${full ? 'col-span-2' : ''}`}>
      <div className="flex gap-3 items-center">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">{icon}</div>
        <div className="min-w-0">
          <div className="text-sm text-muted-foreground">{label}</div>
          <div className="font-semibold truncate">{value}</div>
        </div>
      </div>
    </div>
  );
}
