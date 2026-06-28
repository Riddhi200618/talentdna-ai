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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "";

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  if (!API_BASE_URL) {
    throw new ApiError("Missing VITE_API_BASE_URL. Set it to the production API base URL.", 0);
  }

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
    throw new ApiError("API unavailable. Confirm the configured backend is reachable.", 0);
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  }

  if (typeof value === "string" && value.trim().length > 0) {
    try {
      return toStringArray(JSON.parse(value) as unknown);
    } catch {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
    }
  }

  return [];
}

function normalizeCandidate(candidate: unknown, index: number): Candidate {
  const record = isRecord(candidate) ? (candidate as ApiCandidate) : {};
  const talentDnaScore = toNumber(
    record.talentDnaScore ?? record.talent_dna_score ?? record.score,
  );
  const pedigreeScore = toNumber(record.pedigreeScore ?? record.pedigree_score);
  const gap = toNumber(record.gap, talentDnaScore - pedigreeScore);
  const isDiamond =
    typeof record.is_diamond === "boolean"
      ? record.is_diamond
      : record.diamondStatus === "Diamond" || record.diamond_status === "Diamond";

  return {
    id: String(record.id ?? `candidate-${index}`),
    name: record.name ?? record.candidate_name ?? "Unnamed Candidate",
    college: record.college ?? "Unknown College",
    collegeTier: record.college_tier,
    talentDnaScore,
    pedigreeScore,
    gap,
    diamondStatus:
      record.diamondStatus ??
      record.diamond_status ??
      (isDiamond || gap >= 15 ? "Diamond" : talentDnaScore >= 80 ? "Rising" : "Standard"),
    aiSummary:
      record.aiSummary ??
      record.ai_summary ??
      "AI summary will appear once the backend returns candidate insights.",
    topSkills: toStringArray(record.top_skills),
    resumeText: record.resumeText ?? record.resume_text,
    githubUsername: record.githubUsername ?? record.github_username ?? record.github_handle,
    rawScores: record.rawScores ?? record.raw_scores,
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
  college?: string;
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
    ai_summary?: string | null;
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

function unwrapCandidates(payload: unknown): ApiCandidate[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  return isRecord(payload) && Array.isArray((payload as CandidatesResponse).candidates)
    ? (payload as CandidatesResponse).candidates ?? []
    : [];
}

function unwrapDiamonds(payload: unknown): ApiCandidate[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  return isRecord(payload) && Array.isArray((payload as DiamondsResponse).diamonds)
    ? (payload as DiamondsResponse).diamonds ?? []
    : [];
}

function normalizeProjects(projects: unknown): CandidateProject[] {
  if (typeof projects === "string" && projects.trim().length > 0) {
    try {
      return normalizeProjects(JSON.parse(projects) as unknown);
    } catch {
      return [];
    }
  }

  if (!Array.isArray(projects)) {
    return [];
  }

  return projects
    .map((project, index) => {
      if (typeof project === "string") {
        return { name: project };
      }

      if (isRecord(project)) {
        return {
          name:
            typeof project.name === "string" && project.name.trim().length > 0
              ? project.name
              : `Project ${index + 1}`,
          description: typeof project.description === "string" ? project.description : undefined,
          url: typeof project.url === "string" ? project.url : undefined,
        };
      }

      return null;
    })
    .filter((project): project is CandidateProject => project !== null);
}

function cleanVerdict(value: unknown, fallback: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    return fallback;
  }

  return value.replace("â€”", "-");
}

function normalizeCandidateDetail(payload: unknown, fallback?: Candidate): CandidateDetail {
  const detail = isRecord(payload) ? (payload as ApiCandidateDetail) : {};
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
      college: detail.ats_would_see?.college ?? detail.college ?? fallback?.college ?? "Unknown College",
      pedigreeScore,
      verdict: cleanVerdict(
        detail.ats_would_see?.verdict,
        pedigreeScore >= 75 ? "Shortlisted by ATS" : "Likely rejected by ATS",
      ),
    },
    talentDnaSees: {
      talentDnaScore,
      isDiamond,
      verdict: cleanVerdict(
        detail.talentdna_sees?.verdict,
        isDiamond ? "Diamond - Surface Immediately" : "Review talent signals",
      ),
    },
  };
}

export async function getCandidates(): Promise<Candidate[]> {
  const data = await request<unknown>("/candidates");
  return unwrapCandidates(data).map(normalizeCandidate);
}

export async function getDiamonds(): Promise<DiamondCandidate[]> {
  const data = await request<unknown>("/diamonds");
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
  const data = await request<unknown>(`/candidate/${id}`);
  return normalizeCandidateDetail(data, fallback);
}

export async function getStats(): Promise<DashboardStats> {
  const data = await request<unknown>("/stats");
  const stats = isRecord(data) ? (data as ApiStats) : {};
  return {
    totalCandidates: toNumber(stats.total_candidates),
    diamondCount: toNumber(stats.diamond_count),
    averageGap: toNumber(stats.average_gap),
  };
}

export async function createCandidate(payload: UploadRequest): Promise<UploadResponse> {
  const data = await request<unknown>("/candidate", {
    method: "POST",
    body: JSON.stringify({
      name: payload.name,
      college: payload.college,
      college_tier: payload.collegeTier,
      resume_text: payload.resumeText,
      github_handle: payload.githubUsername,
    }),
  });

  return isRecord(data)
    ? (data as unknown as UploadResponse)
    : { message: "Candidate uploaded successfully.", candidate: null as never };
}
