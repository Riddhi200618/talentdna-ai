import { ArrowUpDown, Eye } from "lucide-react";
import { useMemo, useState } from "react";
import { DiamondBadge } from "./DiamondBadge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { cn } from "../utils/cn";
import type { Candidate } from "../types";

type SortKey = keyof Pick<
  Candidate,
  "name" | "college" | "talentDnaScore" | "pedigreeScore" | "gap" | "diamondStatus"
>;

interface CandidateTableProps {
  candidates: Candidate[];
  onSelectCandidate: (candidate: Candidate) => void;
}

const columns: { key: SortKey; label: string; align?: "left" | "right" }[] = [
  { key: "name", label: "Candidate Name" },
  { key: "college", label: "College" },
  { key: "talentDnaScore", label: "TalentDNA Score", align: "right" },
  { key: "pedigreeScore", label: "Pedigree Score", align: "right" },
  { key: "gap", label: "Gap", align: "right" },
  { key: "diamondStatus", label: "Diamond Status" },
];

function formatScore(value: number) {
  return Number.isInteger(value) ? value : value.toFixed(1);
}

function formatGap(value: number) {
  const formatted = formatScore(Math.abs(value));
  return `${value >= 0 ? "+" : "-"}${formatted}`;
}

export function CandidateTable({ candidates, onSelectCandidate }: CandidateTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("talentDnaScore");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const sortedCandidates = useMemo(() => {
    return [...candidates].sort((first, second) => {
      const firstValue = first[sortKey];
      const secondValue = second[sortKey];
      const direction = sortDirection === "asc" ? 1 : -1;

      if (typeof firstValue === "number" && typeof secondValue === "number") {
        return (firstValue - secondValue) * direction;
      }

      return String(firstValue).localeCompare(String(secondValue)) * direction;
    });
  }, [candidates, sortDirection, sortKey]);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(key);
    setSortDirection("desc");
  }

  return (
    <Card className="overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] border-collapse text-left text-sm">
          <thead className="sticky top-0 z-10 bg-slate-50 text-xs uppercase tracking-normal text-slate-500 shadow-sm">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-5 py-4 font-semibold">
                  <button
                    className={`flex items-center gap-2 ${
                      column.align === "right" ? "ml-auto" : ""
                    }`}
                    onClick={() => handleSort(column.key)}
                  >
                    {column.label}
                    <ArrowUpDown className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </th>
              ))}
              <th className="px-5 py-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-white">
            {sortedCandidates.map((candidate) => (
              <tr
                key={candidate.id}
                className={cn(
                  "cursor-pointer transition-all hover:bg-blue-50/70 hover:shadow-sm",
                  candidate.diamondStatus === "Diamond" &&
                    "bg-blue-50/60 ring-1 ring-inset ring-blue-100",
                )}
                onClick={() => onSelectCandidate(candidate)}
              >
                <td className="px-5 py-4">
                  <div className="font-semibold text-slate-950">{candidate.name}</div>
                  {candidate.githubUsername ? (
                    <div className="text-xs text-muted-foreground">@{candidate.githubUsername}</div>
                  ) : null}
                </td>
                <td className="px-5 py-4 text-slate-600">{candidate.college}</td>
                <td className="px-5 py-4 text-right font-semibold text-slate-950">
                  {formatScore(candidate.talentDnaScore)}
                </td>
                <td className="px-5 py-4 text-right text-slate-600">
                  {formatScore(candidate.pedigreeScore)}
                </td>
                <td
                  className={cn(
                    "px-5 py-4 text-right font-semibold",
                    candidate.gap >= 0 ? "text-emerald-600" : "text-red-600",
                  )}
                >
                  {formatGap(candidate.gap)}
                </td>
                <td className="px-5 py-4">
                  <DiamondBadge status={candidate.diamondStatus} />
                </td>
                <td className="px-5 py-4 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(event) => {
                      event.stopPropagation();
                      onSelectCandidate(candidate);
                    }}
                  >
                    <Eye className="h-4 w-4" aria-hidden="true" />
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
