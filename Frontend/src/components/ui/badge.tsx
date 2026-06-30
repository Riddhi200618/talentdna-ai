import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground dark:bg-lp-primary/10 dark:border-lp-primary/30 dark:text-lp-primary",
        secondary:
          "border-transparent bg-muted text-muted-foreground dark:bg-surface-container dark:border-outline-variant/30 dark:text-on-surface-variant",
        outline:
          "text-foreground dark:border-outline-variant/40 dark:text-on-surface-variant",
        success:
          "border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-tertiary-container/10 dark:border-tertiary-container/30 dark:text-tertiary",
        warning:
          "border-amber-200 bg-amber-50 text-amber-700 dark:bg-secondary-container/10 dark:border-secondary-container/30 dark:text-on-secondary-container",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, className }))} {...props} />;
}
