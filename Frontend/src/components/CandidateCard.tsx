import { ArrowUpRight, Gem, Sparkles, TrendingUp } from "lucide-react";
import { DiamondBadge } from "./DiamondBadge";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import type { Candidate } from "../types";

interface CandidateCardProps {
  candidate: Candidate;
  onView?: (candidate: Candidate) => void;
}

function formatScore(value: number) {
  return Number.isInteger(value) ? value : value.toFixed(1);
}

function formatGap(value: number) {
  const formatted = formatScore(Math.abs(value));
  return `${value >= 0 ? "+" : "-"}${formatted}`;
}

export function CandidateCard({ candidate, onView }: CandidateCardProps) {
  const aiSummary =
    candidate.aiSummary ?? "AI summary will appear once TalentDNA analysis is available.";
  const summaryPreview =
    aiSummary.length > 180 ? `${aiSummary.slice(0, 177).trim()}...` : aiSummary;

  return (
    <Card className="glass-panel rounded-2xl shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-lp-primary/30 hover:shadow-2xl font-hanken">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="mb-2 inline-flex rounded-full bg-primary-container/10 p-2 text-lp-primary">
              <Gem className="h-4 w-4" aria-hidden="true" />
            </div>
            <CardTitle className="leading-tight text-white">{candidate.name}</CardTitle>
            <p className="mt-1 text-sm text-on-surface-variant/80 font-medium">{candidate.college}</p>
          </div>
          <DiamondBadge status={candidate.diamondStatus} />
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-xl border border-lp-primary/20 bg-primary-container/10 p-5 shadow-inner">
          <p className="text-xs font-bold uppercase tracking-wider text-lp-primary">TalentDNA Score</p>
          <div className="mt-2 flex items-end justify-between gap-3">
            <p className="text-4xl font-extrabold text-white tracking-tight">{formatScore(candidate.talentDnaScore)}</p>
            <div className="rounded-full bg-[#131319]/80 border border-outline-variant/20 px-3 py-1 text-xs font-bold text-emerald-400">
              {formatGap(candidate.gap)} gap
            </div>
          </div>
          <Progress value={candidate.talentDnaScore} className="mt-4" />
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl border border-outline-variant/10 bg-[#0e0e14]/50 p-4">
            <p className="text-xs font-semibold text-on-surface-variant/60 uppercase tracking-wider">Pedigree</p>
            <p className="mt-1 font-bold text-on-surface">{formatScore(candidate.pedigreeScore)}</p>
          </div>
          <div className="rounded-xl border border-outline-variant/10 bg-[#0e0e14]/50 p-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant/60 uppercase tracking-wider">
              <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
              Gap
            </div>
            <p className={candidate.gap >= 0 ? "mt-1 font-bold text-emerald-400" : "mt-1 font-bold text-rose-400"}>
              {formatGap(candidate.gap)}
            </p>
          </div>
        </div>
        {candidate.topSkills && candidate.topSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {candidate.topSkills.slice(0, 4).map((skill) => (
              <Badge key={skill} variant="outline" className="bg-[#131319]/40 text-on-surface-variant/90 border-outline-variant/20">
                {skill}
              </Badge>
            ))}
          </div>
        ) : null}
        <div className="rounded-xl border border-outline-variant/10 bg-surface-container-high/40 p-4 text-sm text-on-surface-variant/80">
          <div className="mb-1 flex items-center gap-2 font-bold text-lp-primary text-xs uppercase tracking-wider">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            AI Summary
          </div>
          <p className="leading-6">{summaryPreview}</p>
        </div>
        {onView ? (
          <Button variant="outline" className="w-full" onClick={() => onView(candidate)}>
            View profile
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
