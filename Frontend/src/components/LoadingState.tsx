import { LoadingSpinner } from "./LoadingSpinner";

interface LoadingStateProps {
  label?: string;
  variant?: "panel" | "cards" | "table";
}

export function LoadingState({ label = "Loading candidates", variant = "panel" }: LoadingStateProps) {
  if (variant === "cards") {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="rounded-lg border bg-white p-5 shadow-sm">
            <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
            <div className="mt-4 h-8 w-16 animate-pulse rounded bg-slate-100" />
            <div className="mt-6 h-2 w-full animate-pulse rounded bg-slate-100" />
          </div>
        ))}
        <span className="sr-only">{label}</span>
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div className="h-5 w-40 animate-pulse rounded bg-slate-100" />
          <div className="h-9 w-24 animate-pulse rounded bg-slate-100" />
        </div>
        <div className="space-y-3">
          {[0, 1, 2, 3, 4].map((item) => (
            <div key={item} className="grid gap-4 rounded-md border p-4 sm:grid-cols-5">
              <div className="h-4 animate-pulse rounded bg-slate-100" />
              <div className="h-4 animate-pulse rounded bg-slate-100" />
              <div className="h-4 animate-pulse rounded bg-slate-100" />
              <div className="h-4 animate-pulse rounded bg-slate-100" />
              <div className="h-4 animate-pulse rounded bg-slate-100" />
            </div>
          ))}
        </div>
        <span className="sr-only">{label}</span>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white p-10">
      <LoadingSpinner label={label} />
    </div>
  );
}
