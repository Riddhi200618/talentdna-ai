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

export function CandidateCard({ candidate, onView }: CandidateCardProps) {
  const aiSummary =
    candidate.aiSummary ?? "AI summary will appear once TalentDNA analysis is available.";
  const summaryPreview =
    aiSummary.length > 180 ? `${aiSummary.slice(0, 177).trim()}...` : aiSummary;

  return (
    <Card className="border-blue-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="mb-2 inline-flex rounded-full bg-blue-50 p-2 text-blue-600">
              <Gem className="h-4 w-4" aria-hidden="true" />
            </div>
            <CardTitle className="leading-tight">{candidate.name}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{candidate.college}</p>
          </div>
          <DiamondBadge status={candidate.diamondStatus} />
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
          <p className="text-sm font-medium text-blue-700">TalentDNA Score</p>
          <div className="mt-1 flex items-end justify-between gap-3">
            <p className="text-4xl font-bold text-blue-950">{candidate.talentDnaScore}</p>
            <div className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-emerald-700">
              +{candidate.gap} gap
            </div>
          </div>
          <Progress value={candidate.talentDnaScore} className="mt-4" />
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-md border bg-white p-3">
            <p className="text-muted-foreground">Pedigree</p>
            <p className="mt-1 font-semibold text-slate-950">{candidate.pedigreeScore}</p>
          </div>
          <div className="rounded-md border bg-white p-3">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
              Hidden Upside
            </div>
            <p className="mt-1 font-semibold text-emerald-600">+{candidate.gap}</p>
          </div>
        </div>
        {candidate.topSkills && candidate.topSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {candidate.topSkills.slice(0, 4).map((skill) => (
              <Badge key={skill} variant="outline" className="bg-white text-slate-700">
                {skill}
              </Badge>
            ))}
          </div>
        ) : null}
        <div className="rounded-md bg-slate-50 p-3 text-sm text-slate-700">
          <div className="mb-1 flex items-center gap-2 font-medium text-blue-700">
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
