import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import CandidateCard from '../CandidateCard';
import KanbanColumn from '../KanbanColumn';
import PositionKanban from '../PositionKanban';
import { KanbanCandidate } from '../../../types/kanban';

// Mock the services
jest.mock('../../../services/positionService');
jest.mock('../../../services/candidateService');
jest.mock('axios');
jest.mock('react-router-dom', () => ({
  useNavigate: () => () => {},
}));

import { getInterviewFlow, getCandidatesByPosition } from '../../../services/positionService';

describe('Edge Cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('CandidateCard Edge Cases', () => {
    it('handles candidate without averageScore', () => {
      const candidateWithoutScore: KanbanCandidate = {
        id: 1,
        fullName: 'John Doe',
        applicationId: 1,
        currentInterviewStep: 1,
        // averageScore is undefined
      };

      render(<CandidateCard candidate={candidateWithoutScore} />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText(/ID: 1/)).toBeInTheDocument();
      // Should not show any score-related elements
      expect(screen.queryByText(/★/)).not.toBeInTheDocument();
    });

    it('handles candidate with minimal data', () => {
      const minimalCandidate: KanbanCandidate = {
        id: 1,
        fullName: 'John Doe',
        applicationId: 1,
        currentInterviewStep: 1,
      };

      render(<CandidateCard candidate={minimalCandidate} />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText(/ID: 1/)).toBeInTheDocument();
    });

    it('handles very long names gracefully', () => {
      const candidateWithLongName: KanbanCandidate = {
        id: 1,
        fullName: 'VeryLongFirstNameThatMightCauseIssues VeryLongLastNameThatMightCauseIssues',
        applicationId: 1,
        currentInterviewStep: 1,
      };

      render(<CandidateCard candidate={candidateWithLongName} />);

      expect(screen.getByText('VeryLongFirstNameThatMightCauseIssues VeryLongLastNameThatMightCauseIssues')).toBeInTheDocument();
    });
  });

  describe('KanbanColumn Edge Cases', () => {
    it('renders correctly with zero candidates', () => {
      render(
        <KanbanColumn
          columnId={1}
          name="Empty Column"
          candidates={[]}
        />
      );

      expect(screen.getByText('Empty Column')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByText(/No hay candidatos en esta fase actualmente/i)).toBeInTheDocument();
    });

    it('handles column with many candidates', () => {
      const manyCandidates: KanbanCandidate[] = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        fullName: `Candidate${i + 1} Test`,
        applicationId: i + 1,
        currentInterviewStep: 1,
        averageScore: 4.0,
      }));

      render(
        <KanbanColumn
          columnId={1}
          name="Busy Column"
          candidates={manyCandidates}
        />
      );

      expect(screen.getByText('Busy Column')).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument();
      expect(screen.getByText('Candidate1 Test')).toBeInTheDocument();
    });
  });

  describe('PositionKanban Edge Cases', () => {
    it('handles empty interview flow', async () => {
      const emptyFlow = {
        id: 1,
        description: 'Empty flow',
        interviewSteps: [],
      };

      getInterviewFlow.mockResolvedValue(emptyFlow);
      getCandidatesByPosition.mockResolvedValue({ candidates: [] });

      render(<PositionKanban positionId={1} />);

      await waitFor(() => {
        // With empty steps, the board renders but with no columns
        expect(screen.getByText('Senior Frontend Developer')).toBeInTheDocument();
        // Verify the kanban board element exists (even if empty)
        const kanbanBoard = document.querySelector('.kanban-board');
        expect(kanbanBoard).toBeInTheDocument();
      });
    });

    it('handles API returning empty candidates array', async () => {
      const mockFlow = {
        id: 1,
        description: 'Test flow',
        interviewSteps: [
          { id: 1, interviewFlowId: 1, interviewTypeId: 1, name: 'Screening', orderIndex: 1 },
        ],
      };

      getInterviewFlow.mockResolvedValue(mockFlow);
      getCandidatesByPosition.mockResolvedValue({ candidates: [] });

      render(<PositionKanban positionId={1} />);

      await waitFor(() => {
        expect(screen.getByText('Screening')).toBeInTheDocument();
        expect(screen.getByText('0')).toBeInTheDocument();
      });
    });

    it('handles malformed API response', async () => {
      getInterviewFlow.mockResolvedValue(null);
      getCandidatesByPosition.mockResolvedValue(null);

      render(<PositionKanban positionId={1} />);

      await waitFor(() => {
        expect(screen.getByText(/Error al cargar el tablero/i)).toBeInTheDocument();
      });
    });
  });
});