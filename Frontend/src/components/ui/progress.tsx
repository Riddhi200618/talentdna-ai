import { cn } from "../../utils/cn";

interface ProgressProps {
  value: number;
  className?: string;
}

export function Progress({ value, className }: ProgressProps) {
  const boundedValue = Math.max(0, Math.min(100, value));

  return (
    <div
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-muted dark:bg-[#0e0e14]/60 dark:border dark:border-outline-variant/10",
        className,
      )}
    >
      <div
        className="h-full rounded-full bg-primary transition-all dark:bg-gradient-to-r dark:from-lp-primary dark:to-lp-secondary dark:glow-primary"
        style={{ width: `${boundedValue}%` }}
      />
    </div>
  );
}
