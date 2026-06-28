import {
  AlertTriangle,
  Award,
  Brain,
  BriefcaseBusiness,
  CheckCircle2,
  GraduationCap,
  Loader2,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { DiamondBadge } from "./DiamondBadge";
import { ScoreCard } from "./ScoreCard";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { getCandidateDetail } from "../services/api";
import type { Candidate, CandidateDetail } from "../types";

interface DetailModalProps {
  candidate: Candidate | null;
  onClose: () => void;
}

export function DetailModal({ candidate, onClose }: DetailModalProps) {
  const [detail, setDetail] = useState<CandidateDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!candidate) {
      setDetail(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    let isActive = true;
    setIsLoading(true);
    setError(null);

    getCandidateDetail(candidate.id, candidate)
      .then((nextDetail) => {
        if (isActive) {
          setDetail(nextDetail);
        }
      })
      .catch((caughtError) => {
        if (isActive) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "Unable to load candidate details.",
          );
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [candidate]);

  if (!candidate) {
    return null;
  }

  const activeDetail =
    detail ??
    ({
      id: candidate.id,
      name: candidate.name,
      scores: {
        projectScore: candidate.rawScores?.projects ?? 0,
        velocityScore: candidate.rawScores?.trajectory ?? 0,
        problemScore: candidate.rawScores?.technical ?? 0,
        initiativeScore: candidate.rawScores?.communication ?? 0,
        talentDnaScore: candidate.talentDnaScore,
        pedigreeScore: candidate.pedigreeScore,
        gap: candidate.gap,
        isDiamond: candidate.diamondStatus === "Diamond",
      },
      analysis: {
        aiSummary:
          candidate.aiSummary ?? "TalentDNA analysis is unavailable for this candidate.",
        topSkills: candidate.topSkills ?? [],
        topProjects: [],
      },
      atsWouldSee: {
        college: candidate.college,
        pedigreeScore: candidate.pedigreeScore,
        verdict: "Not available",
      },
      talentDnaSees: {
        talentDnaScore: candidate.talentDnaScore,
        isDiamond: candidate.diamondStatus === "Diamond",
        verdict:
          candidate.diamondStatus === "Diamond"
            ? "Diamond - Surface Immediately"
            : "Review talent signals",
      },
    } satisfies CandidateDetail);

  const scoreRows = [
    {
      label: "Project Score",
      value: activeDetail.scores.projectScore,
      icon: BriefcaseBusiness,
      tone: "blue" as const,
    },
    {
      label: "Velocity Score",
      value: activeDetail.scores.velocityScore,
      icon: TrendingUp,
      tone: "green" as const,
    },
    {
      label: "Problem Score",
      value: activeDetail.scores.problemScore,
      icon: Brain,
      tone: "slate" as const,
    },
    {
      label: "Initiative Score",
      value: activeDetail.scores.initiativeScore,
      icon: Award,
      tone: "amber" as const,
    },
    {
      label: "TalentDNA Score",
      value: activeDetail.scores.talentDnaScore,
      icon: Brain,
      tone: "blue" as const,
    },
    {
      label: "Pedigree Score",
      value: activeDetail.scores.pedigreeScore,
      icon: GraduationCap,
      tone: "slate" as const,
    },
    {
      label: "Gap",
      value: Math.max(0, activeDetail.scores.gap),
      icon: TrendingUp,
      tone: "green" as const,
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
        className="max-h-[90vh] w-full max-w-5xl overflow-y-auto shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b p-6">
          <div>
            <div className="mb-3">
              <DiamondBadge status={activeDetail.scores.isDiamond ? "Diamond" : candidate.diamondStatus} />
            </div>
            <h2 id="candidate-detail-title" className="text-2xl font-bold text-slate-950">
              {activeDetail.name}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {activeDetail.atsWouldSee.college}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close candidate details">
            <X className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
        <CardContent className="space-y-6 p-6">
          {isLoading ? (
            <div className="grid gap-3 rounded-lg border bg-slate-50 p-5 sm:grid-cols-3">
              {[0, 1, 2].map((item) => (
                <div key={item} className="h-24 animate-pulse rounded-md bg-white" />
              ))}
              <div className="flex items-center gap-2 text-sm text-muted-foreground sm:col-span-3">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Loading complete TalentDNA profile
              </div>
            </div>
          ) : null}

          {error ? (
            <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-none" aria-hidden="true" />
              <div>
                <p className="font-semibold">Could not load full profile</p>
                <p className="mt-1">{error}</p>
              </div>
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-5 text-slate-600">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-normal text-slate-500">
                <GraduationCap className="h-4 w-4" aria-hidden="true" />
                ATS Would See First
              </div>
              <dl className="space-y-4">
                <div>
                  <dt className="text-xs font-medium text-slate-500">College</dt>
                  <dd className="mt-1 text-lg font-semibold text-slate-800">
                    {activeDetail.atsWouldSee.college}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-slate-500">Pedigree Score</dt>
                  <dd className="mt-1 text-3xl font-bold text-slate-700">
                    {activeDetail.atsWouldSee.pedigreeScore}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-slate-500">Verdict</dt>
                  <dd className="mt-1 inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-semibold text-slate-700">
                    {activeDetail.atsWouldSee.verdict}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-5 text-emerald-950 shadow-sm ring-1 ring-emerald-100">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-normal text-emerald-700">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                TalentDNA Sees Next
              </div>
              <dl className="space-y-4">
                <div>
                  <dt className="text-xs font-medium text-emerald-700">TalentDNA Score</dt>
                  <dd className="mt-1 text-4xl font-bold text-emerald-950">
                    {activeDetail.talentDnaSees.talentDnaScore}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-emerald-700">Diamond Status</dt>
                  <dd className="mt-1">
                    <Badge variant={activeDetail.talentDnaSees.isDiamond ? "success" : "secondary"}>
                      {activeDetail.talentDnaSees.isDiamond ? "Diamond" : "Not diamond"}
                    </Badge>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-emerald-700">Verdict</dt>
                  <dd className="mt-1 inline-flex rounded-full border border-emerald-200 bg-white px-3 py-1 text-sm font-semibold text-emerald-700">
                    {activeDetail.talentDnaSees.verdict}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {scoreRows.map((score) => (
              <ScoreCard key={score.label} {...score} />
            ))}
          </div>
          <div className="rounded-lg border bg-blue-50 p-5">
            <h3 className="text-base font-semibold text-emerald-950">AI Summary</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              {activeDetail.analysis.aiSummary}
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-slate-950">Top Skills</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {activeDetail.analysis.topSkills.length > 0 ? (
                activeDetail.analysis.topSkills.map((skill) => (
                  <Badge key={skill} variant="outline" className="bg-white">
                    {skill}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No skills returned yet.</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-base font-semibold text-slate-950">Top Projects</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {activeDetail.analysis.topProjects.length > 0 ? (
                activeDetail.analysis.topProjects.map((project) => (
                  <div key={`${project.name}-${project.url ?? ""}`} className="rounded-lg border bg-white p-4">
                    <div className="flex items-center gap-2 font-semibold text-slate-950">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                      {project.name}
                    </div>
                    {project.description ? (
                      <p className="mt-2 text-sm leading-6 text-slate-600">{project.description}</p>
                    ) : null}
                    {project.url ? (
                      <a
                        className="mt-3 inline-flex text-sm font-semibold text-emerald-700 hover:text-blue-800"
                        href={project.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View project
                      </a>
                    ) : null}
                  </div>
                ))
              ) : (
                <div className="rounded-lg border bg-white p-4 text-sm text-muted-foreground sm:col-span-2">
                  No top projects returned by the API yet.
                </div>
              )}
            </div>
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
