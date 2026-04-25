import type { ReactNode } from 'react';

export interface GraphicLabelProps {
  icon: ReactNode;
  message: string;
  className?: string;
}

export default function GraphicLabel({
  icon,
  message,
  className = 'text-slate-600',
}: GraphicLabelProps) {
  return (
    <div
      className={`flex flex-col items-center text-center gap-3 ${className}`}
    >
      <span className="flex items-center justify-center">{icon}</span>
      <span className="text-base font-medium text-slate-700">{message}</span>
    </div>
  );
}
