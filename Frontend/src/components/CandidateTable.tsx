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
    <div className="lp-table-container">
      <div className="overflow-x-auto">
        <table className="lp-table min-w-[920px]">
          <thead className="sticky top-0 z-10 bg-[#1f1f26]/90 backdrop-blur-md border-b border-outline-variant/10 shadow-sm">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-5 py-4 font-semibold text-xs uppercase tracking-wider text-on-surface-variant font-hanken bg-surface-container-high/40 select-none"
                >
                  <button
                    className={`flex items-center gap-2 hover:text-lp-primary transition-colors duration-200 ${
                      column.align === "right" ? "ml-auto" : ""
                    }`}
                    onClick={() => handleSort(column.key)}
                  >
                    {column.label}
                    <ArrowUpDown className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </th>
              ))}
              <th className="px-5 py-4 text-right font-semibold text-xs uppercase tracking-wider text-on-surface-variant font-hanken bg-surface-container-high/40 select-none">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/5 bg-transparent">
            {sortedCandidates.map((candidate) => (
              <tr
                key={candidate.id}
                className={cn(
                  "lp-tr-hover border-b border-outline-variant/5",
                  candidate.diamondStatus === "Diamond" &&
                    "bg-primary-container/5 hover:bg-primary-container/10",
                )}
                onClick={() => onSelectCandidate(candidate)}
              >
                <td className="px-5 py-4 lp-td">
                  <div className="font-bold text-on-surface font-hanken text-sm">
                    {candidate.name}
                  </div>
                  {candidate.githubUsername ? (
                    <div className="text-xs text-on-surface-variant/70">
                      @{candidate.githubUsername}
                    </div>
                  ) : null}
                </td>
                <td className="px-5 py-4 lp-td text-on-surface-variant font-hanken">
                  {candidate.college}
                </td>
                <td className="px-5 py-4 lp-td text-right font-bold text-on-surface font-hanken">
                  {formatScore(candidate.talentDnaScore)}
                </td>
                <td className="px-5 py-4 lp-td text-right text-on-surface-variant font-hanken">
                  {formatScore(candidate.pedigreeScore)}
                </td>
                <td
                  className={cn(
                    "px-5 py-4 lp-td text-right font-bold font-hanken",
                    candidate.gap >= 0 ? "text-emerald-400" : "text-rose-400",
                  )}
                >
                  {formatGap(candidate.gap)}
                </td>
                <td className="px-5 py-4 lp-td">
                  <DiamondBadge status={candidate.diamondStatus} />
                </td>
                <td className="px-5 py-4 lp-td text-right">
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
    </div>
  );
}
