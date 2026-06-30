import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-blue-600 dark:bg-primary-container dark:text-on-primary-container dark:glow-primary dark:hover:opacity-90",
        outline:
          "border border-input bg-white shadow-sm hover:bg-accent hover:text-accent-foreground dark:border-outline-variant/30 dark:bg-surface-container/30 dark:text-on-surface dark:hover:bg-surface-container-highest/60 dark:hover:text-white",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:text-on-surface-variant dark:hover:bg-surface-container/40 dark:hover:text-on-surface",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-red-600 dark:bg-error-container dark:text-on-error-container dark:glow-secondary dark:hover:opacity-95",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size, className }))} {...props} />
  );
}
