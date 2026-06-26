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
  blue: "bg-blue-50 text-blue-600",
  green: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  slate: "bg-slate-100 text-slate-600",
};

export function ScoreCard({ label, value, icon: Icon, tone = "blue" }: ScoreCardProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-950">{value}</p>
          </div>
          {Icon ? (
            <div className={`rounded-md p-2 ${toneClasses[tone]}`}>
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
          ) : null}
        </div>
        <Progress value={value} className="mt-4" />
      </CardContent>
    </Card>
  );
}
