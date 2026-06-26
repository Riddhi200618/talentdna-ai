import { Gem, TrendingUp } from "lucide-react";
import { Badge } from "./ui/badge";
import type { DiamondStatus } from "../types";

interface DiamondBadgeProps {
  status: DiamondStatus;
}

export function DiamondBadge({ status }: DiamondBadgeProps) {
  if (status === "Diamond") {
    return (
      <Badge variant="success" className="gap-1.5">
        <Gem className="h-3 w-3" aria-hidden="true" />
        Diamond
      </Badge>
    );
  }

  if (status === "Rising") {
    return (
      <Badge variant="warning" className="gap-1.5">
        <TrendingUp className="h-3 w-3" aria-hidden="true" />
        Rising
      </Badge>
    );
  }

  return <Badge variant="secondary">{status}</Badge>;
}
