export type DiamondStatus = "Diamond" | "Rising" | "Watchlist" | "Standard";

export interface Candidate {
  id: string;
  name: string;
  college: string;
  talentDnaScore: number;
  pedigreeScore: number;
  gap: number;
  diamondStatus: DiamondStatus;
  aiSummary?: string;
  resumeText?: string;
  githubUsername?: string;
  rawScores?: {
    technical?: number;
    projects?: number;
    communication?: number;
    trajectory?: number;
  };
}

export interface CandidateSummary {
  id: string;
  name: string;
  college: string;
  talentDnaScore: number;
  diamondStatus: DiamondStatus;
}

export interface DiamondCandidate extends Candidate {
  aiSummary: string;
}

export interface UploadRequest {
  name: string;
  college: string;
  resumeText: string;
  githubUsername: string;
}

export interface UploadResponse {
  candidate: CandidateSummary;
  message: string;
}

export interface ApiCandidate {
  id?: string | number;
  name?: string;
  candidate_name?: string;
  college?: string;
  talentDnaScore?: number;
  talent_dna_score?: number;
  score?: number;
  pedigreeScore?: number;
  pedigree_score?: number;
  gap?: number;
  diamondStatus?: DiamondStatus;
  diamond_status?: DiamondStatus;
  aiSummary?: string;
  ai_summary?: string;
  resumeText?: string;
  resume_text?: string;
  githubUsername?: string;
  github_username?: string;
  rawScores?: Candidate["rawScores"];
  raw_scores?: Candidate["rawScores"];
}
