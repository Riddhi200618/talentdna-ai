import { Award, Brain, GraduationCap, TrendingUp, X } from "lucide-react";
import { DiamondBadge } from "./DiamondBadge";
import { ScoreCard } from "./ScoreCard";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import type { Candidate } from "../types";

interface DetailModalProps {
  candidate: Candidate | null;
  onClose: () => void;
}

export function DetailModal({ candidate, onClose }: DetailModalProps) {
  if (!candidate) {
    return null;
  }

  const scoreRows = [
    { label: "TalentDNA Score", value: candidate.talentDnaScore, icon: Brain, tone: "blue" as const },
    { label: "Pedigree Score", value: candidate.pedigreeScore, icon: GraduationCap, tone: "slate" as const },
    { label: "Gap", value: Math.max(0, candidate.gap), icon: TrendingUp, tone: "green" as const },
    {
      label: "Trajectory",
      value: candidate.rawScores?.trajectory ?? Math.min(100, candidate.talentDnaScore + 3),
      icon: Award,
      tone: "amber" as const,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="candidate-detail-title"
      onMouseDown={onClose}
    >
      <Card
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b p-6">
          <div>
            <div className="mb-3">
              <DiamondBadge status={candidate.diamondStatus} />
            </div>
            <h2 id="candidate-detail-title" className="text-2xl font-bold text-slate-950">
              {candidate.name}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{candidate.college}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close candidate details">
            <X className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
        <CardContent className="space-y-6 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {scoreRows.map((score) => (
              <ScoreCard key={score.label} {...score} />
            ))}
          </div>
          <div className="rounded-lg border bg-blue-50 p-5">
            <h3 className="text-base font-semibold text-blue-950">AI Summary</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              {candidate.aiSummary ??
                "AI-generated candidate summary will appear here once the backend returns it."}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-slate-700">GitHub</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {candidate.githubUsername ? `@${candidate.githubUsername}` : "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">Resume Signal</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {candidate.resumeText ? "Resume text available" : "Waiting for backend payload"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
