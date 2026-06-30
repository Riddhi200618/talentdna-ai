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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#05050A]/85 backdrop-blur-md p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="candidate-detail-title"
      onMouseDown={onClose}
    >
      <Card
        className="max-h-[90vh] w-full max-w-5xl overflow-y-auto shadow-2xl glass-panel-heavy rounded-2xl border border-outline-variant/15 relative scrollbar-thin scrollbar-thumb-outline-variant/30 scrollbar-track-transparent animate-modal-enter"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-outline-variant/10 p-6">
          <div>
            <div className="mb-3">
              <DiamondBadge status={activeDetail.scores.isDiamond ? "Diamond" : candidate.diamondStatus} />
            </div>
            <h2 id="candidate-detail-title" className="text-2xl font-black text-white font-hanken tracking-tight">
              {activeDetail.name}
            </h2>
            <p className="mt-1 text-sm text-on-surface-variant/80 font-medium font-hanken">
              {activeDetail.atsWouldSee.college}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close candidate details">
            <X className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
        <CardContent className="space-y-6 p-6">
          {isLoading ? (
            <div className="grid gap-3 rounded-xl border border-outline-variant/10 bg-[#0e0e14]/50 p-5 sm:grid-cols-3">
              {[0, 1, 2].map((item) => (
                <div key={item} className="h-24 animate-pulse rounded-lg bg-primary-container/10 border border-outline-variant/10" />
              ))}
              <div className="flex items-center gap-2 text-sm text-on-surface-variant sm:col-span-3">
                <Loader2 className="h-4 w-4 animate-spin text-lp-primary" aria-hidden="true" />
                Loading complete TalentDNA profile...
              </div>
            </div>
          ) : null}

          {error ? (
            <div className="flex items-start gap-3 rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-400 font-hanken">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-none" aria-hidden="true" />
              <div>
                <p className="font-bold">Could not load full profile</p>
                <p className="mt-1">{error}</p>
              </div>
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-outline-variant/10 bg-[#0e0e14]/50 p-5 text-on-surface-variant font-hanken">
              <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant/60">
                <GraduationCap className="h-4 w-4" aria-hidden="true" />
                ATS Would See First
              </div>
              <dl className="space-y-4">
                <div>
                  <dt className="text-xs font-semibold text-on-surface-variant/50 uppercase tracking-wider">College</dt>
                  <dd className="mt-1 text-lg font-bold text-on-surface">
                    {activeDetail.atsWouldSee.college}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-on-surface-variant/50 uppercase tracking-wider">Pedigree Score</dt>
                  <dd className="mt-1 text-3xl font-extrabold text-on-surface-variant/80 tracking-tight">
                    {activeDetail.atsWouldSee.pedigreeScore}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-on-surface-variant/50 uppercase tracking-wider">Verdict</dt>
                  <dd className="mt-2 inline-flex rounded-full border border-outline-variant/20 bg-[#131319]/80 px-3 py-1 text-sm font-semibold text-on-surface-variant/80">
                    {activeDetail.atsWouldSee.verdict}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-xl border border-lp-primary/25 bg-primary-container/10 p-5 text-on-surface shadow-md ring-1 ring-lp-primary/25 glow-primary font-hanken">
              <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-lp-primary">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                TalentDNA Sees Next
              </div>
              <dl className="space-y-4">
                <div>
                  <dt className="text-xs font-semibold text-lp-primary uppercase tracking-wider">TalentDNA Score</dt>
                  <dd className="mt-1 text-4xl font-extrabold text-white tracking-tight">
                    {activeDetail.talentDnaSees.talentDnaScore}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-lp-primary uppercase tracking-wider">Diamond Status</dt>
                  <dd className="mt-1">
                    <Badge variant={activeDetail.talentDnaSees.isDiamond ? "success" : "secondary"}>
                      {activeDetail.talentDnaSees.isDiamond ? "Diamond" : "Not diamond"}
                    </Badge>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-lp-primary uppercase tracking-wider">Verdict</dt>
                  <dd className="mt-2 inline-flex rounded-full border border-lp-primary/25 bg-[#131319]/80 px-3 py-1 text-sm font-semibold text-lp-primary">
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

          <div className="rounded-xl border border-lp-primary/20 bg-primary-container/10 p-5 shadow-inner font-hanken">
            <h3 className="text-xs font-bold text-lp-primary uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5" aria-hidden="true" />
              AI Summary
            </h3>
            <p className="mt-2 text-sm leading-6 text-on-surface-variant/90">
              {activeDetail.analysis.aiSummary}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold text-on-surface-variant/70 font-hanken uppercase tracking-wider border-b border-outline-variant/10 pb-2">Top Skills</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {activeDetail.analysis.topSkills.length > 0 ? (
                activeDetail.analysis.topSkills.map((skill) => (
                  <Badge key={skill} variant="outline" className="bg-[#131319]/40 text-on-surface-variant/90 border-outline-variant/20 px-3 py-1 text-xs">
                    {skill}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-on-surface-variant/60 font-hanken">No skills returned yet.</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-on-surface-variant/70 font-hanken uppercase tracking-wider border-b border-outline-variant/10 pb-2">Top Projects</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {activeDetail.analysis.topProjects.length > 0 ? (
                activeDetail.analysis.topProjects.map((project) => (
                  <div key={`${project.name}-${project.url ?? ""}`} className="rounded-xl border border-outline-variant/10 bg-[#0e0e14]/50 p-4 font-hanken">
                    <div className="flex items-center gap-2 font-bold text-on-surface text-sm">
                      <CheckCircle2 className="h-4 w-4 text-lp-primary" aria-hidden="true" />
                      {project.name}
                    </div>
                    {project.description ? (
                      <p className="mt-2 text-sm leading-6 text-on-surface-variant/85">{project.description}</p>
                    ) : null}
                    {project.url ? (
                      <a
                        className="mt-3 inline-flex text-sm font-bold text-lp-primary hover:opacity-80 transition-opacity"
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
                <div className="rounded-xl border border-outline-variant/10 bg-[#0e0e14]/50 p-4 text-sm text-on-surface-variant/60 sm:col-span-2">
                  No top projects returned by the API yet.
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 border-t border-outline-variant/10 pt-4 font-hanken">
            <div>
              <p className="text-xs font-bold text-on-surface-variant/50 uppercase tracking-wider">GitHub</p>
              <p className="mt-1 text-sm font-bold text-on-surface">
                {candidate.githubUsername ? `@${candidate.githubUsername}` : "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant/50 uppercase tracking-wider">Resume Signal</p>
              <p className="mt-1 text-sm font-bold text-on-surface">
                {candidate.resumeText ? "Resume text available" : "Waiting for backend payload"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
