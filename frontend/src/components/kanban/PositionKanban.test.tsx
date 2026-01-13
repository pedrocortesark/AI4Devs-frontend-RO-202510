import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { DndContext } from '@dnd-kit/core';
import PositionKanban from './PositionKanban';
import { KanbanData, KanbanCandidate, InterviewFlow } from '../../types/kanban';

// Mock the services
jest.mock('../../services/positionService');
jest.mock('../../services/candidateService');
jest.mock('axios');

import { getInterviewFlow, getCandidatesByPosition } from '../../services/positionService';
import { updateCandidateStage } from '../../services/candidateService';

const mockInterviewFlow: InterviewFlow = {
  id: 1,
  description: 'Test flow',
  interviewSteps: [
    { id: 1, interviewFlowId: 1, interviewTypeId: 1, name: 'Screening', orderIndex: 1 },
    { id: 2, interviewFlowId: 1, interviewTypeId: 2, name: 'Interview', orderIndex: 2 },
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
];

describe('PositionKanban Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(getInterviewFlow).mockResolvedValue(mockInterviewFlow);
    jest.mocked(getCandidatesByPosition).mockResolvedValue({ candidates: mockCandidates });
  });

  it('loads and displays data correctly', async () => {
    render(<PositionKanban positionId={1} />);

    // Initially shows skeleton loader
    const skeletonCards = document.querySelectorAll('.skeleton-card');
    expect(skeletonCards.length).toBeGreaterThan(0);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    expect(screen.getByText('Screening')).toBeInTheDocument();
    expect(screen.getByText('Interview')).toBeInTheDocument();
  });

  it('handles API errors gracefully', async () => {
    jest.mocked(getInterviewFlow).mockRejectedValue(new Error('API Error'));

    render(<PositionKanban positionId={1} />);

    await waitFor(() => {
      expect(screen.getByText(/Error al cargar el tablero/i)).toBeInTheDocument();
    });
  });

  it('displays loading state until both API calls complete', async () => {
    let resolveFlow: (value: any) => void;
    let resolveCandidates: (value: any) => void;

    const flowPromise = new Promise(resolve => { resolveFlow = resolve; });
    const candidatesPromise = new Promise(resolve => { resolveCandidates = resolve; });

    jest.mocked(getInterviewFlow).mockReturnValue(flowPromise as any);
    jest.mocked(getCandidatesByPosition).mockReturnValue(candidatesPromise as any);

    render(<PositionKanban positionId={1} />);

    // Verify skeleton is showing during loading
    const skeletonCards = document.querySelectorAll('.skeleton-card');
    expect(skeletonCards.length).toBeGreaterThan(0);

    // Still loading after first promise resolves
    resolveFlow!(mockInterviewFlow);
    await waitFor(() => {
      const skeletons = document.querySelectorAll('.skeleton-card');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    // Only resolves after both promises complete
    resolveCandidates!({ candidates: mockCandidates });
    await waitFor(() => {
      expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
    });
  });
});