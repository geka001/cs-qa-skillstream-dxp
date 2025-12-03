// User segment types
export type UserSegment = 'ROOKIE' | 'AT_RISK' | 'HIGH_FLYER';

// Team types for Contentstack products
export type Team = 'Launch' | 'Data & Insights' | 'Visual Builder' | 'AutoDraft' | 'DAM';

// User profile interface
export interface UserProfile {
  name: string;
  role: string; // Keep internally but not used in login
  team: Team; // New: User's Contentstack product team
  segment: UserSegment;
  joinDate: string;
  completedModules: string[];
  quizScores: { [moduleId: string]: number };
  timeSpent: number; // in minutes
  interventionsReceived: number;
  moduleProgress?: {
    [moduleId: string]: {
      contentRead: boolean;
      videoWatched: boolean;
      lastAccessed?: string;
      timeSpentOnModule?: number;
    };
  };
  // Onboarding tracking
  completedSOPs: string[];
  exploredTools: string[];
  onboardingComplete: boolean;
  onboardingCompletedDate?: string;
  // Analytics tracking
  lastActivity?: string;
  segmentHistory?: { segment: UserSegment; date: string }[];
}

// Manager configuration interface
export interface ManagerConfig {
  team: Team;
  managerName: string;
  managerEmail: string;
}

// Onboarding requirements interface
export interface OnboardingRequirements {
  modules: {
    required: number;
    completed: number;
    percentage: number;
  };
  sops: {
    required: number;
    completed: number;
    percentage: number;
  };
  tools: {
    required: number;
    completed: number;
    percentage: number;
  };
  averageScore: {
    required: number;
    current: number;
    passing: boolean;
  };
  notAtRisk: boolean;
  overallComplete: boolean;
  overallPercentage: number;
}

// Module interface
export interface Module {
  id: string;
  title: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  content: string;
  videoUrl?: string;
  quiz: QuizQuestion[];
  tags: string[];
  estimatedTime: number; // in minutes
  targetSegments: UserSegment[];
  targetTeams?: Team[]; // New: Which teams this module is for
  mandatory?: boolean;
  prerequisites?: string[]; // Module IDs that must be completed first
  order?: number; // Display order within category
}

// Quiz question interface
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

// SOP (Standard Operating Procedure) interface
export interface SOP {
  id: string;
  title: string;
  criticality: 'critical' | 'high' | 'medium' | 'low';
  steps: string[];
  relatedTools: string[];
  targetSegments: UserSegment[];
  targetTeams?: Team[]; // Which teams this SOP applies to
  mandatory?: boolean;
}

// Tool interface
export interface Tool {
  id: string;
  name: string;
  purpose: string;
  docsLink: string;
  integrations: string[];
  category: string;
  targetSegments: UserSegment[];
  targetTeams?: Team[]; // New: Which teams need this tool
  isGeneric?: boolean; // New: True for tools shown to all teams
}

// Analytics interface
export interface AnalyticsData {
  moduleCompletion: number;
  averageQuizScore: number;
  timeSpent: number;
  lastActivity: string;
  segmentHistory: { segment: UserSegment; date: string }[];
}

