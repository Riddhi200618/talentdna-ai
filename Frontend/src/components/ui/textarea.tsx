import * as React from "react";
import { cn } from "../../utils/cn";

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "flex min-h-32 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#0e0e14]/60 dark:border-outline-variant/30 dark:text-on-surface dark:placeholder:text-on-surface-variant/40 dark:focus-visible:border-lp-primary/60 dark:focus-visible:ring-lp-primary/10 shadow-inner",
        className,
      )}
      {...props}
    />
  );
}
