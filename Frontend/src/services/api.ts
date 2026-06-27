import type {
  ApiCandidate,
  Candidate,
  CandidateDetail,
  CandidateProject,
  DashboardStats,
  DiamondCandidate,
  UploadRequest,
  UploadResponse,
} from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api";

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });
  } catch {
    throw new ApiError("API unavailable. Confirm the backend is running on port 8000.", 0);
  }

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const payload = (await response.json()) as { detail?: string; message?: string };
      message = payload.detail ?? payload.message ?? message;
    } catch {
      // Keep the generic message when the API does not return JSON.
    }
    throw new ApiError(message, response.status);
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new ApiError("The API returned malformed data.", response.status);
  }
}

function toNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function toStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : [];
}

function normalizeCandidate(candidate: ApiCandidate, index: number): Candidate {
  const talentDnaScore = toNumber(
    candidate.talentDnaScore ?? candidate.talent_dna_score ?? candidate.score,
  );
  const pedigreeScore = toNumber(candidate.pedigreeScore ?? candidate.pedigree_score);
  const gap = toNumber(candidate.gap, talentDnaScore - pedigreeScore);
  const isDiamond =
    typeof candidate.is_diamond === "boolean"
      ? candidate.is_diamond
      : candidate.diamondStatus === "Diamond" || candidate.diamond_status === "Diamond";

  return {
    id: String(candidate.id ?? `candidate-${index}`),
    name: candidate.name ?? candidate.candidate_name ?? "Unnamed Candidate",
    college: candidate.college ?? "Unknown College",
    collegeTier: candidate.college_tier,
    talentDnaScore,
    pedigreeScore,
    gap,
    diamondStatus:
      candidate.diamondStatus ??
      candidate.diamond_status ??
      (isDiamond || gap >= 15 ? "Diamond" : talentDnaScore >= 80 ? "Rising" : "Standard"),
    aiSummary:
      candidate.aiSummary ??
      candidate.ai_summary ??
      "AI summary will appear once the backend returns candidate insights.",
    topSkills: toStringArray(candidate.top_skills),
    resumeText: candidate.resumeText ?? candidate.resume_text,
    githubUsername: candidate.githubUsername ?? candidate.github_username ?? candidate.github_handle,
    rawScores: candidate.rawScores ?? candidate.raw_scores,
  };
}

interface CandidatesResponse {
  candidates?: ApiCandidate[];
}

interface DiamondsResponse {
  diamonds?: ApiCandidate[];
}

interface ApiCandidateDetail {
  id?: string | number;
  name?: string;
  scores?: {
    project_score?: number;
    velocity_score?: number;
    problem_score?: number;
    initiative_score?: number;
    talent_dna_score?: number;
    pedigree_score?: number;
    gap?: number;
    is_diamond?: boolean;
  };
  analysis?: {
    ai_summary?: string;
    top_skills?: unknown;
    top_projects?: unknown;
  };
  ats_would_see?: {
    college?: string;
    pedigree_score?: number;
    verdict?: string;
  };
  talentdna_sees?: {
    talent_dna_score?: number;
    is_diamond?: boolean;
    verdict?: string;
  };
}

interface ApiStats {
  total_candidates?: number;
  diamond_count?: number;
  average_gap?: number;
}

function unwrapCandidates(payload: ApiCandidate[] | CandidatesResponse): ApiCandidate[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  return Array.isArray(payload.candidates) ? payload.candidates : [];
}

function unwrapDiamonds(payload: ApiCandidate[] | DiamondsResponse): ApiCandidate[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  return Array.isArray(payload.diamonds) ? payload.diamonds : [];
}

function normalizeProjects(projects: unknown): CandidateProject[] {
  if (!Array.isArray(projects)) {
    return [];
  }

  return projects
    .map((project, index) => {
      if (typeof project === "string") {
        return { name: project };
      }

      if (project && typeof project === "object") {
        const record = project as Record<string, unknown>;
        return {
          name:
            typeof record.name === "string" && record.name.trim().length > 0
              ? record.name
              : `Project ${index + 1}`,
          description:
            typeof record.description === "string" ? record.description : undefined,
          url: typeof record.url === "string" ? record.url : undefined,
        };
      }

      return null;
    })
    .filter((project): project is CandidateProject => project !== null);
}

function normalizeCandidateDetail(detail: ApiCandidateDetail, fallback?: Candidate): CandidateDetail {
  const talentDnaScore = toNumber(
    detail.scores?.talent_dna_score ?? detail.talentdna_sees?.talent_dna_score,
    fallback?.talentDnaScore,
  );
  const pedigreeScore = toNumber(
    detail.scores?.pedigree_score ?? detail.ats_would_see?.pedigree_score,
    fallback?.pedigreeScore,
  );
  const gap = toNumber(detail.scores?.gap, talentDnaScore - pedigreeScore);
  const isDiamond =
    typeof detail.scores?.is_diamond === "boolean"
      ? detail.scores.is_diamond
      : detail.talentdna_sees?.is_diamond ?? fallback?.diamondStatus === "Diamond";

  return {
    id: String(detail.id ?? fallback?.id ?? "candidate"),
    name: detail.name ?? fallback?.name ?? "Unnamed Candidate",
    scores: {
      projectScore: toNumber(detail.scores?.project_score),
      velocityScore: toNumber(detail.scores?.velocity_score),
      problemScore: toNumber(detail.scores?.problem_score),
      initiativeScore: toNumber(detail.scores?.initiative_score),
      talentDnaScore,
      pedigreeScore,
      gap,
      isDiamond,
    },
    analysis: {
      aiSummary:
        detail.analysis?.ai_summary ??
        fallback?.aiSummary ??
        "TalentDNA analysis is unavailable for this candidate.",
      topSkills: toStringArray(detail.analysis?.top_skills).length
        ? toStringArray(detail.analysis?.top_skills)
        : fallback?.topSkills ?? [],
      topProjects: normalizeProjects(detail.analysis?.top_projects),
    },
    atsWouldSee: {
      college: detail.ats_would_see?.college ?? fallback?.college ?? "Unknown College",
      pedigreeScore,
      verdict: detail.ats_would_see?.verdict ?? "Not available",
    },
    talentDnaSees: {
      talentDnaScore,
      isDiamond,
      verdict:
        detail.talentdna_sees?.verdict ??
        (isDiamond ? "Diamond - Surface Immediately" : "Review talent signals"),
    },
  };
}

export async function getCandidates(): Promise<Candidate[]> {
  const data = await request<ApiCandidate[] | CandidatesResponse>("/candidates");
  return unwrapCandidates(data).map(normalizeCandidate);
}

export async function getDiamonds(): Promise<DiamondCandidate[]> {
  const data = await request<ApiCandidate[] | DiamondsResponse>("/diamonds");
  return unwrapDiamonds(data).map((candidate, index) => ({
    ...normalizeCandidate(candidate, index),
    aiSummary:
      candidate.aiSummary ??
      candidate.ai_summary ??
      "AI summary will appear once the backend returns diamond insights.",
  }));
}

export async function getCandidateDetail(
  id: string,
  fallback?: Candidate,
): Promise<CandidateDetail> {
  const data = await request<ApiCandidateDetail>(`/candidate/${id}`);
  return normalizeCandidateDetail(data, fallback);
}

export async function getStats(): Promise<DashboardStats> {
  const data = await request<ApiStats>("/stats");
  return {
    totalCandidates: toNumber(data.total_candidates),
    diamondCount: toNumber(data.diamond_count),
    averageGap: toNumber(data.average_gap),
  };
}

export async function createCandidate(payload: UploadRequest): Promise<UploadResponse> {
  return request<UploadResponse>("/candidate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
