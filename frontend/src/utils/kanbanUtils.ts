import { KanbanData, KanbanCandidate, InterviewFlow } from '../types/kanban';

/**
 * Organizes candidates by their current interview step
 * @param candidates Array of candidates to organize
 * @param interviewFlow The interview flow containing the steps
 * @returns Organized data mapping stepId to candidates array
 */
export const organizeCandidatesByStep = (
  candidates: KanbanCandidate[],
  interviewFlow: InterviewFlow
): KanbanData => {
  const organizedData: KanbanData = {};

  // Initialize empty arrays for each step
  interviewFlow.interviewSteps.forEach(step => {
    organizedData[step.id] = [];
  });

  // Group candidates by their current step
  candidates.forEach(candidate => {
    const stepId = candidate.currentInterviewStep;
    if (organizedData[stepId]) {
      organizedData[stepId].push(candidate);
    }
  });

  return organizedData;
};