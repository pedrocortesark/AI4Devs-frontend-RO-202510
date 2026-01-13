import { organizeCandidatesByStep } from './kanbanUtils';
import { KanbanCandidate, InterviewFlow } from '../types/kanban';

const mockInterviewFlow: InterviewFlow = {
  id: 1,
  description: 'Standard hiring process',
  interviewSteps: [
    { id: 1, interviewFlowId: 1, interviewTypeId: 1, name: 'Initial Screening', orderIndex: 1 },
    { id: 2, interviewFlowId: 1, interviewTypeId: 2, name: 'Technical Interview', orderIndex: 2 },
    { id: 3, interviewFlowId: 1, interviewTypeId: 3, name: 'Final Interview', orderIndex: 3 },
  ],
};

const mockCandidates: KanbanCandidate[] = [
  {
    id: 1,
    fullName: 'John Doe',
    applicationId: 1,
    currentInterviewStep: 1,
    averageScore: 4.5,
  },
  {
    id: 2,
    fullName: 'Jane Smith',
    applicationId: 2,
    currentInterviewStep: 2,
    averageScore: 3.8,
  },
  {
    id: 3,
    fullName: 'Bob Johnson',
    applicationId: 3,
    currentInterviewStep: 1,
    averageScore: 4.2,
  },
];

describe('organizeCandidatesByStep', () => {
  it('organizes candidates correctly by interview step', () => {
    const result = organizeCandidatesByStep(mockCandidates, mockInterviewFlow);

    expect(result[1]).toHaveLength(2); // John and Bob in step 1
    expect(result[2]).toHaveLength(1); // Jane in step 2
    expect(result[3]).toHaveLength(0); // No one in step 3
  });

  it('includes all candidates in the result', () => {
    const result = organizeCandidatesByStep(mockCandidates, mockInterviewFlow);

    const totalCandidates = Object.values(result).flat().length;
    expect(totalCandidates).toBe(mockCandidates.length);
  });

  it('initializes empty arrays for all interview steps', () => {
    const result = organizeCandidatesByStep([], mockInterviewFlow);

    expect(result[1]).toEqual([]);
    expect(result[2]).toEqual([]);
    expect(result[3]).toEqual([]);
  });

  it('handles candidates with invalid step IDs', () => {
    const candidateWithInvalidStep: KanbanCandidate = {
      id: 4,
      fullName: 'Invalid Step',
      applicationId: 4,
      currentInterviewStep: 999, // Non-existent step
      averageScore: 3.0,
    };

    const candidatesWithInvalid = [...mockCandidates, candidateWithInvalidStep];
    const result = organizeCandidatesByStep(candidatesWithInvalid, mockInterviewFlow);

    // Invalid step candidate should not be included
    const totalCandidates = Object.values(result).flat().length;
    expect(totalCandidates).toBe(mockCandidates.length);
  });

  it('preserves candidate data integrity', () => {
    const result = organizeCandidatesByStep(mockCandidates, mockInterviewFlow);

    const john = result[1].find(c => c.id === 1);
    expect(john).toEqual(mockCandidates[0]);

    const jane = result[2].find(c => c.id === 2);
    expect(jane).toEqual(mockCandidates[1]);
  });
});