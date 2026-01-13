import React from 'react';
import { render, screen } from '@testing-library/react';
import KanbanColumn from './KanbanColumn';
import { KanbanCandidate } from '../../types/kanban';

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
    currentInterviewStep: 1,
    averageScore: 3.8,
  },
];

describe('KanbanColumn', () => {
  it('renders column name and candidate count correctly', () => {
    render(
      <KanbanColumn
        columnId={1}
        name="Initial Screening"
        candidates={mockCandidates}
      />
    );

    expect(screen.getByText('Initial Screening')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // Badge with count
  });

  it('renders empty state message when no candidates', () => {
    render(
      <KanbanColumn
        columnId={2}
        name="Technical Interview"
        candidates={[]}
      />
    );

    expect(screen.getByText('Technical Interview')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText(/No hay candidatos en esta fase actualmente/i)).toBeInTheDocument();
  });

  it('renders all candidate cards when candidates exist', () => {
    render(
      <KanbanColumn
        columnId={1}
        name="Initial Screening"
        candidates={mockCandidates}
      />
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText(/ID: 1/)).toBeInTheDocument();
    expect(screen.getByText(/ID: 2/)).toBeInTheDocument();
  });

  it('applies correct color classes based on columnId', () => {
    render(
      <KanbanColumn
        columnId={1}
        name="Test Column"
        candidates={[]}
      />
    );

    // Check that the header has the correct background color class
    const header = screen.getByText('Test Column').closest('.card-header');
    expect(header).toHaveClass('bg-info'); // Second color in the cycle
  });

  it('renders with correct responsive classes', () => {
    render(
      <KanbanColumn
        columnId={1}
        name="Test Column"
        candidates={[]}
      />
    );

    const column = screen.getByText('Test Column').closest('.kanban-column');
    expect(column).toHaveClass('col-12');
    expect(column).toHaveClass('col-sm-6');
    expect(column).toHaveClass('col-lg-3');
    expect(column).toHaveClass('col-xl-3');
  });
});