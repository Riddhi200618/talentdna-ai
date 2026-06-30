import type { LucideIcon } from "lucide-react";
import { Progress } from "./ui/progress";
import { Card, CardContent } from "./ui/card";

interface ScoreCardProps {
  label: string;
  value: number;
  icon?: LucideIcon;
  tone?: "blue" | "green" | "amber" | "slate";
}

const toneClasses = {
  blue: "bg-blue-50 text-blue-600 dark:bg-primary-container/10 dark:text-lp-primary",
  green: "bg-emerald-50 text-emerald-600 dark:bg-tertiary-container/10 dark:text-tertiary",
  amber: "bg-amber-50 text-amber-600 dark:bg-secondary-container/10 dark:text-on-secondary-container",
  slate: "bg-slate-100 text-slate-600 dark:bg-surface-container-highest/20 dark:text-on-surface-variant",
};

export function ScoreCard({ label, value, icon: Icon, tone = "blue" }: ScoreCardProps) {
  return (
    <Card className="shadow-sm border border-outline-variant/10">
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground dark:text-on-surface-variant/80 font-hanken font-medium">{label}</p>
            <p className="mt-1 text-3xl font-extrabold text-slate-950 dark:text-on-surface font-hanken tracking-tight">{value}</p>
          </div>
          {Icon ? (
            <div className={`rounded-lg p-2.5 transition-all duration-300 ${toneClasses[tone]}`}>
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
          ) : null}
        </div>
        <Progress value={value} className="mt-5" />
      </CardContent>
    </Card>
  );
}
