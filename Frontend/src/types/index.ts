export type DiamondStatus = "Diamond" | "Rising" | "Watchlist" | "Standard";

export interface Candidate {
  id: string;
  name: string;
  college: string;
  collegeTier?: string;
  talentDnaScore: number;
  pedigreeScore: number;
  gap: number;
  diamondStatus: DiamondStatus;
  aiSummary?: string;
  topSkills?: string[];
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

export interface CandidateProject {
  name: string;
  description?: string;
  url?: string;
}

export interface CandidateDetail {
  id: string;
  name: string;
  scores: {
    projectScore: number;
    velocityScore: number;
    problemScore: number;
    initiativeScore: number;
    talentDnaScore: number;
    pedigreeScore: number;
    gap: number;
    isDiamond: boolean;
  };
  analysis: {
    aiSummary: string;
    topSkills: string[];
    topProjects: CandidateProject[];
  };
  atsWouldSee: {
    college: string;
    pedigreeScore: number;
    verdict: string;
  };
  talentDnaSees: {
    talentDnaScore: number;
    isDiamond: boolean;
    verdict: string;
  };
}

export interface DashboardStats {
  totalCandidates: number;
  diamondCount: number;
  averageGap: number;
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
  college_tier?: string;
  talentDnaScore?: number;
  talent_dna_score?: number;
  score?: number;
  pedigreeScore?: number;
  pedigree_score?: number;
  gap?: number;
  is_diamond?: boolean;
  diamondStatus?: DiamondStatus;
  diamond_status?: DiamondStatus;
  top_skills?: string[];
  aiSummary?: string;
  ai_summary?: string;
  resumeText?: string;
  resume_text?: string;
  githubUsername?: string;
  github_username?: string;
  github_handle?: string;
  rawScores?: Candidate["rawScores"];
  raw_scores?: Candidate["rawScores"];
}
