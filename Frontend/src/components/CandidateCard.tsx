import { ArrowUpRight, Sparkles } from "lucide-react";
import { DiamondBadge } from "./DiamondBadge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import type { Candidate } from "../types";

interface CandidateCardProps {
  candidate: Candidate;
  onView?: (candidate: Candidate) => void;
}

export function CandidateCard({ candidate, onView }: CandidateCardProps) {
  return (
    <Card className="transition-transform hover:-translate-y-1 hover:shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>{candidate.name}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{candidate.college}</p>
          </div>
          <DiamondBadge status={candidate.diamondStatus} />
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">TalentDNA</p>
            <p className="font-semibold text-slate-950">{candidate.talentDnaScore}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Pedigree</p>
            <p className="font-semibold text-slate-950">{candidate.pedigreeScore}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Gap</p>
            <p className="font-semibold text-emerald-600">+{candidate.gap}</p>
          </div>
        </div>
        <Progress value={candidate.talentDnaScore} />
        <div className="rounded-md bg-blue-50 p-3 text-sm text-slate-700">
          <div className="mb-1 flex items-center gap-2 font-medium text-blue-700">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            AI Summary
          </div>
          <p>{candidate.aiSummary}</p>
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
