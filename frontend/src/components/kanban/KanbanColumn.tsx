import React, { useMemo, useCallback } from 'react';
import { Col, Card, Badge } from 'react-bootstrap';
import { People } from 'react-bootstrap-icons';
import { useDroppable } from '@dnd-kit/core';
import CandidateCard from './CandidateCard';
import { KanbanCandidate } from '../../types/kanban';

interface KanbanColumnProps {
  columnId: number;
  name: string;
  candidates: KanbanCandidate[];
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ columnId, name, candidates }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${columnId}`,
  });

  const columnColor = useMemo(() => {
    const colors = ['primary', 'info', 'warning', 'success', 'danger'];
    return colors[columnId % colors.length];
  }, [columnId]);

  const candidateCards = useMemo(() => {
    return candidates.map((candidate) => (
      <CandidateCard
        key={candidate.id}
        candidate={candidate}
      />
    ));
  }, [candidates]);

  return (
    <Col xs={12} sm={6} lg={3} xl={3} className="kanban-column mb-4">
      <Card className={`h-100 shadow-sm border-0 ${isOver ? 'border-primary border-2' : ''}`}>
        <Card.Header className={`bg-${columnColor} text-white d-flex align-items-center justify-content-between py-2 px-3`}>
          <div className="d-flex align-items-center min-w-0 flex-grow-1">
            <h5 className="mb-0 me-2 text-truncate">{name}</h5>
            <Badge bg="light" text="dark" className="d-flex align-items-center flex-shrink-0">
              <People size={12} className="me-1" />
              {candidates.length}
            </Badge>
          </div>
        </Card.Header>
        <Card.Body
          ref={setNodeRef}
          className={`p-3 bg-light ${isOver ? 'bg-primary bg-opacity-10' : ''}`}
          style={{ minHeight: '300px' }}
        >
          <div className="droppable-area h-100">
            {candidates.length > 0 ? (
              candidateCards
            ) : (
              <div className="empty-state-enhanced">
                <div className="icon">
                  <People size={48} />
                </div>
                <div className="title">Sin candidatos</div>
                <div className="description">
                  No hay candidatos en esta fase actualmente. Arrastra candidatos aquí para comenzar.
                </div>
              </div>
            )}
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default React.memo(KanbanColumn, (prevProps, nextProps) => {
  // Only re-render if candidates array changed or isOver state changed
  return prevProps.candidates === nextProps.candidates &&
         prevProps.name === nextProps.name &&
         prevProps.columnId === nextProps.columnId;
});