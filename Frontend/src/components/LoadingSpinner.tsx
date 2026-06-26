import { Loader2 } from "lucide-react";
import { cn } from "../utils/cn";

interface LoadingSpinnerProps {
  label?: string;
  className?: string;
}

export function LoadingSpinner({ label = "Loading", className }: LoadingSpinnerProps) {
  return (
    <div className={cn("flex items-center justify-center gap-2 text-sm text-muted-foreground", className)}>
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
