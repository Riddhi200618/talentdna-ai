import type {
  ApiCandidate,
  Candidate,
  DiamondCandidate,
  UploadRequest,
  UploadResponse,
} from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

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

  return response.json() as Promise<T>;
}

function normalizeCandidate(candidate: ApiCandidate, index: number): Candidate {
  const talentDnaScore =
    candidate.talentDnaScore ?? candidate.talent_dna_score ?? candidate.score ?? 0;
  const pedigreeScore = candidate.pedigreeScore ?? candidate.pedigree_score ?? 0;
  const gap = candidate.gap ?? talentDnaScore - pedigreeScore;

  return {
    id: String(candidate.id ?? `candidate-${index}`),
    name: candidate.name ?? candidate.candidate_name ?? "Unnamed Candidate",
    college: candidate.college ?? "Unknown College",
    talentDnaScore,
    pedigreeScore,
    gap,
    diamondStatus:
      candidate.diamondStatus ??
      candidate.diamond_status ??
      (gap >= 15 ? "Diamond" : talentDnaScore >= 80 ? "Rising" : "Standard"),
    aiSummary:
      candidate.aiSummary ??
      candidate.ai_summary ??
      "AI summary will appear once the backend returns candidate insights.",
    resumeText: candidate.resumeText ?? candidate.resume_text,
    githubUsername: candidate.githubUsername ?? candidate.github_username,
    rawScores: candidate.rawScores ?? candidate.raw_scores,
  };
}

export async function getCandidates(): Promise<Candidate[]> {
  const data = await request<ApiCandidate[]>("/candidates");
  return data.map(normalizeCandidate);
}

export async function getDiamonds(): Promise<DiamondCandidate[]> {
  const data = await request<ApiCandidate[]>("/diamonds");
  return data.map((candidate, index) => ({
    ...normalizeCandidate(candidate, index),
    aiSummary:
      candidate.aiSummary ??
      candidate.ai_summary ??
      "AI summary will appear once the backend returns diamond insights.",
  }));
}

export async function createCandidate(payload: UploadRequest): Promise<UploadResponse> {
  return request<UploadResponse>("/candidate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
