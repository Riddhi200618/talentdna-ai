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
          <div key={item} className="rounded-2xl border border-outline-variant/10 glass-panel p-6 shadow-sm">
            <div className="h-4 w-24 animate-pulse rounded-md bg-primary-container/10" />
            <div className="mt-4 h-8 w-16 animate-pulse rounded-md bg-primary-container/10" />
            <div className="mt-6 h-2 w-full animate-pulse rounded bg-primary-container/10" />
          </div>
        ))}
        <span className="sr-only">{label}</span>
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className="rounded-2xl border border-outline-variant/10 glass-panel p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div className="h-5 w-40 animate-pulse rounded-md bg-primary-container/10" />
          <div className="h-9 w-24 animate-pulse rounded-full bg-primary-container/10" />
        </div>
        <div className="space-y-4">
          {[0, 1, 2, 3, 4].map((item) => (
            <div key={item} className="grid gap-4 rounded-xl border border-outline-variant/5 bg-[#0e0e14]/30 p-4 sm:grid-cols-5">
              <div className="h-4 animate-pulse rounded-md bg-primary-container/10" />
              <div className="h-4 animate-pulse rounded-md bg-primary-container/10" />
              <div className="h-4 animate-pulse rounded-md bg-primary-container/10" />
              <div className="h-4 animate-pulse rounded-md bg-primary-container/10" />
              <div className="h-4 animate-pulse rounded-md bg-primary-container/10" />
            </div>
          ))}
        </div>
        <span className="sr-only">{label}</span>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-outline-variant/10 glass-panel p-12 flex justify-center items-center">
      <LoadingSpinner label={label} />
    </div>
  );
}
