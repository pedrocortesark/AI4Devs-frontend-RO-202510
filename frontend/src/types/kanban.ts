// types/kanban.ts - TypeScript interfaces for Kanban board functionality

// Base entities from backend schema
export interface InterviewType {
  id: number;
  name: string;
  description?: string;
}

export interface InterviewFlow {
  id: number;
  description?: string;
  interviewSteps: InterviewStep[];
}

export interface InterviewStep {
  id: number;
  interviewFlowId: number;
  interviewTypeId: number;
  name: string;
  orderIndex: number;
  interviewFlow?: InterviewFlow;
  interviewType?: InterviewType;
}

export interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  // Additional fields for Kanban display
  averageScore?: number; // Calculated from interviews
  applicationId?: number; // For stage updates
  currentInterviewStep?: number; // Current step ID
}

// Kanban-specific types
export interface KanbanColumn {
  id: number; // interviewStep.id
  name: string; // interviewStep.name
  candidates: KanbanCandidate[];
}

export interface KanbanCandidate {
  id: number;
  fullName: string; // Combined name from backend
  applicationId: number; // Required for updates
  currentInterviewStep: number;
  averageScore?: number;
}

// Board state type - mapping of stepId to candidates array
export type KanbanData = Record<number, KanbanCandidate[]>;

// API Response types
export interface GetInterviewFlowResponse {
  id: number;
  description?: string;
  interviewSteps: InterviewStep[];
}

export interface GetCandidatesByPositionResponse {
  candidates: KanbanCandidate[];
}

export interface UpdateCandidateStageRequest {
  applicationId: number;
  currentInterviewStep: number;
}

export interface UpdateCandidateStageResponse {
  message: string;
  data: {
    id: number;
    positionId: number;
    candidateId: number;
    applicationDate: string;
    currentInterviewStep: number;
    notes?: string;
  };
}

// Loading and error states
export interface KanbanState {
  data: KanbanData;
  loading: boolean;
  error: string | null;
  interviewFlow: InterviewFlow | null;
}