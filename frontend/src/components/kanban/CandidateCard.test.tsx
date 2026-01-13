import React from 'react';
import { render, screen } from '@testing-library/react';
import CandidateCard from './CandidateCard';
import { KanbanCandidate } from '../../types/kanban';

const mockCandidate: KanbanCandidate = {
  id: 1,
  fullName: 'John Doe',
  applicationId: 1,
  currentInterviewStep: 1,
  averageScore: 4.5,
};

describe('CandidateCard', () => {
  it('renders candidate name and ID correctly', () => {
    render(<CandidateCard candidate={mockCandidate} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText(/ID: 1/)).toBeInTheDocument();
  });

  it('displays average score when available', () => {
    render(<CandidateCard candidate={mockCandidate} />);

    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  it('does not display score section when averageScore is undefined', () => {
    const candidateWithoutScore: KanbanCandidate = {
      ...mockCandidate,
      averageScore: undefined,
    };

    render(<CandidateCard candidate={candidateWithoutScore} />);

    expect(screen.queryByText(/\d\.\d/)).not.toBeInTheDocument();
  });

  it('displays badge with score color when available', () => {
    render(<CandidateCard candidate={mockCandidate} />);

    expect(screen.getByText('4.5')).toBeInTheDocument();
    // Verify the badge exists
    const badge = screen.getByText('4.5').closest('.badge');
    expect(badge).toBeInTheDocument();
  });

  it('does not display score when averageScore is undefined', () => {
    const candidateWithoutScore: KanbanCandidate = {
      ...mockCandidate,
      averageScore: undefined,
    };

    render(<CandidateCard candidate={candidateWithoutScore} />);

    expect(screen.queryByText(/★/)).not.toBeInTheDocument();
  });

  it('renders with correct CSS classes', () => {
    render(<CandidateCard candidate={mockCandidate} />);

    const card = screen.getByRole('button'); // Card is draggable, so it should be a button-like element
    expect(card).toHaveClass('candidate-card');
    expect(card).toHaveClass('shadow-sm');
  });
});