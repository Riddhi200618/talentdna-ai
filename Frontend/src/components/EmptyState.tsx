import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl glass-panel p-12 text-center font-hanken border border-outline-variant/10 shadow-lg relative overflow-hidden group">
      <div className="absolute -left-20 -top-20 w-48 h-48 bg-lp-primary/5 rounded-full blur-2xl pointer-events-none" />
      <div className="mb-4 rounded-full bg-primary-container/10 p-3.5 text-lp-primary transition-all duration-300 group-hover:scale-110">
        <Inbox className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="text-base font-extrabold text-white tracking-tight">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-on-surface-variant/80 leading-relaxed">{description}</p>
    </div>
  );
}
