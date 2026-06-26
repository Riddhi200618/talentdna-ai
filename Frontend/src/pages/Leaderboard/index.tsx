import { Filter, RefreshCw, Search, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { CandidateTable } from "../../components/CandidateTable";
import { DetailModal } from "../../components/DetailModal";
import { EmptyState } from "../../components/EmptyState";
import { LoadingState } from "../../components/LoadingState";
import { ScoreCard } from "../../components/ScoreCard";
import { SectionHeader } from "../../components/SectionHeader";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { useApiData } from "../../hooks/useApiData";
import { getCandidates } from "../../services/api";
import type { Candidate } from "../../types";

export default function LeaderboardPage() {
  const { data: candidates, isLoading, error, refetch } = useApiData(getCandidates, []);
  const [query, setQuery] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const filteredCandidates = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return candidates;
    }

    return candidates.filter((candidate) =>
      [candidate.name, candidate.college, candidate.githubUsername ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [candidates, query]);

  const averageTalentScore =
    candidates.length > 0
      ? Math.round(
          candidates.reduce((total, candidate) => total + candidate.talentDnaScore, 0) /
            candidates.length,
        )
      : 0;
  const diamonds = candidates.filter((candidate) => candidate.diamondStatus === "Diamond").length;

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Recruiter Intelligence"
        title="Candidate Leaderboard"
        description="Rank high-signal candidates by TalentDNA score, pedigree gap, and diamond potential."
        action={
          <Button variant="outline" onClick={() => void refetch()} disabled={isLoading}>
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Refresh
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <ScoreCard label="Candidates" value={candidates.length} icon={Users} tone="blue" />
        <ScoreCard label="Avg TalentDNA" value={averageTalentScore} icon={Search} tone="green" />
        <ScoreCard label="Diamonds" value={diamonds} icon={Filter} tone="amber" />
      </div>

      <Card className="shadow-sm">
        <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search by name, college, or GitHub"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search candidates"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" disabled>
              <Filter className="h-4 w-4" aria-hidden="true" />
              Filters
            </Button>
            <Button variant="outline" disabled>
              Page 1 of 1
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading ? <LoadingState label="Loading leaderboard" /> : null}

      {!isLoading && error ? (
        <EmptyState
          title="Could not load candidates"
          description={`${error}. Check VITE_API_BASE_URL and confirm GET /candidates is available.`}
        />
      ) : null}

      {!isLoading && !error && filteredCandidates.length === 0 ? (
        <EmptyState
          title="No candidates found"
          description="Upload a candidate or adjust your search to see leaderboard results."
        />
      ) : null}

      {!isLoading && !error && filteredCandidates.length > 0 ? (
        <CandidateTable
          candidates={filteredCandidates}
          onSelectCandidate={setSelectedCandidate}
        />
      ) : null}

      <DetailModal candidate={selectedCandidate} onClose={() => setSelectedCandidate(null)} />
    </div>
  );
}
