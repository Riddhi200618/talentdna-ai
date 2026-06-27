import { Gem, RefreshCw, Sparkles, TrendingUp } from "lucide-react";
import { CandidateCard } from "../../components/CandidateCard";
import { DetailModal } from "../../components/DetailModal";
import { EmptyState } from "../../components/EmptyState";
import { LoadingState } from "../../components/LoadingState";
import { ScoreCard } from "../../components/ScoreCard";
import { SectionHeader } from "../../components/SectionHeader";
import { Button } from "../../components/ui/button";
import { useApiData } from "../../hooks/useApiData";
import { getDiamonds } from "../../services/api";
import { useState } from "react";
import type { Candidate } from "../../types";

export default function DiamondPanelPage() {
  const { data: diamonds, isLoading, error, refetch } = useApiData(getDiamonds, []);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const averageGap =
    diamonds.length > 0
      ? Math.round(diamonds.reduce((total, candidate) => total + candidate.gap, 0) / diamonds.length)
      : 0;

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-blue-100 bg-white p-6 shadow-sm">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-blue-700">
              ATS sees pedigree. TalentDNA sees actual talent.
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl">
              Surface overlooked builders before competitors do.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Diamond candidates combine strong execution signals with a high pedigree gap,
              giving recruiters a focused shortlist for immediate review.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Traditional screen</p>
              <p className="mt-2 text-2xl font-bold text-slate-700">Pedigree</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-4 ring-1 ring-blue-100">
              <p className="text-sm text-blue-700">TalentDNA screen</p>
              <p className="mt-2 text-2xl font-bold text-blue-950">Potential</p>
            </div>
          </div>
        </div>
      </div>

      <SectionHeader
        eyebrow="Hidden Talent"
        title="Diamond Panel"
        description="Prioritize candidates whose TalentDNA signals outpace traditional pedigree."
        action={
          <Button variant="outline" onClick={() => void refetch()} disabled={isLoading}>
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Refresh
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <ScoreCard label="Diamond Candidates" value={diamonds.length} icon={Gem} tone="blue" />
        <ScoreCard label="Avg Gap" value={averageGap} icon={TrendingUp} tone="green" />
        <ScoreCard label="AI Summaries" value={diamonds.length} icon={Sparkles} tone="amber" />
      </div>

      {isLoading ? <LoadingState label="Loading diamond candidates" variant="cards" /> : null}

      {!isLoading && error ? (
        <EmptyState
          title="Could not load diamonds"
          description={`${error}. Check VITE_API_BASE_URL and confirm GET /diamonds is available.`}
        />
      ) : null}

      {!isLoading && !error && diamonds.length === 0 ? (
        <EmptyState
          title="No diamonds yet"
          description="Candidates with high TalentDNA-to-pedigree gaps will appear here."
        />
      ) : null}

      {!isLoading && !error && diamonds.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {diamonds.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              onView={setSelectedCandidate}
            />
          ))}
        </div>
      ) : null}

      <DetailModal candidate={selectedCandidate} onClose={() => setSelectedCandidate(null)} />
    </div>
  );
}
