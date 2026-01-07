
export enum UserRole {
  CANDIDATE = 'CANDIDATE',
  COMPANY = 'COMPANY',
  ADMIN = 'ADMIN'
}

export interface PotentialScores {
  potential: number;
  performance: number;
  learning: number;
  adaptability: number;
  trust: number;
  curiosity: number;
}

export interface ResumeData {
  skills: string[];
  experienceLevel: string;
  projects: string[];
  education: string[];
  rawSummary?: string;
}

export interface HistoryItem {
  id: string;
  date: string;
  score: number;
  label: string;
  notes: string;
  transcripts?: string[];
  detailedFeedback?: any;
  targetCompany?: string; 
}

export interface AppliedJob {
  jobId: string;
  companyName: string;
  jobTitle: string;
  status: 'reviewing' | 'shortlisted' | 'rejected';
  scoreSent: number;
  timestamp: string;
}

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  headline: string;
  bio: string;
  scores?: PotentialScores;
  resumeData?: ResumeData;
  verifiedSkills: string[];
  connections: number;
  following: number;
  attemptHistory?: HistoryItem[];
  interviewHistory?: HistoryItem[];
  appliedHistory?: AppliedJob[];
  lastLogin?: string; // Track for Admin visibility
  status?: 'active' | 'offline' | 'flagged';
}

export interface GlobalActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'critical';
}
