import React, { useMemo } from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Star, StarFill, PersonCircle } from 'react-bootstrap-icons';
import { useDraggable } from '@dnd-kit/core';
import { KanbanCandidate } from '../../types/kanban';

interface CandidateCardProps {
  candidate: KanbanCandidate;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `candidate-${candidate.id}`,
    data: {
      candidate,
    },
  });

  const style = useMemo(() => {
    return transform ? {
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      backgroundColor: '#f8f9fa',
    } : {
      backgroundColor: '#f8f9fa',
    };
  }, [transform]);

  const renderStars = useMemo(() => (score?: number) => {
    if (!score) return null;

    const stars = [];
    const fullStars = Math.floor(score);
    const hasHalfStar = score % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<StarFill key={i} className="text-warning" size={12} />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<StarFill key={i} className="text-warning" size={12} />);
      } else {
        stars.push(<Star key={i} className="text-muted" size={12} />);
      }
    }

    return stars;
  }, []);

  const scoreColor = useMemo(() => {
    const score = candidate.averageScore;
    if (!score) return 'secondary';
    if (score >= 4.5) return 'success';
    if (score >= 4.0) return 'primary';
    if (score >= 3.5) return 'warning';
    return 'danger';
  }, [candidate.averageScore]);

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`mb-2 candidate-card shadow-sm border-0 ${isDragging ? 'dragging' : ''}`}
      {...listeners}
      {...attributes}
    >
      <Card.Body className="p-3">
        <div className="d-flex align-items-start">
          <div className="flex-shrink-0 me-3">
            <PersonCircle size={32} className="text-muted" />
          </div>
          <div className="flex-grow-1 min-w-0">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div className="min-w-0 flex-grow-1">
                <h6 className="mb-1 text-truncate fw-semibold">
                  {candidate.fullName}
                </h6>
                <small className="text-muted d-block text-truncate">
                  ID: {candidate.id}
                </small>
              </div>
              {candidate.averageScore && (
                <div className="flex-shrink-0 ms-2">
                  <Badge
                    bg={scoreColor}
                    className="d-flex align-items-center gap-1 px-2 py-1"
                  >
                    <div className="d-flex">
                      {renderStars(candidate.averageScore)}
                    </div>
                    <span className="ms-1 fw-semibold small">
                      {candidate.averageScore.toFixed(1)}
                    </span>
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default React.memo(CandidateCard, (prevProps, nextProps) => {
  // Only re-render if the candidate data actually changed
  return prevProps.candidate.id === nextProps.candidate.id &&
         prevProps.candidate.currentInterviewStep === nextProps.candidate.currentInterviewStep &&
         prevProps.candidate.averageScore === nextProps.candidate.averageScore;
});