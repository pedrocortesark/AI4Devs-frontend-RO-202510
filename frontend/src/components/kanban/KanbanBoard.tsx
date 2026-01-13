import React from 'react';
import { Row } from 'react-bootstrap';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import KanbanColumn from './KanbanColumn';
import CandidateCard from './CandidateCard';
import { KanbanData, InterviewFlow, KanbanCandidate } from '../../types/kanban';

interface KanbanBoardProps {
  positionId: number;
  data: KanbanData;
  interviewFlow: InterviewFlow | null;
  onDragEnd: (event: DragEndEvent) => void;
  onDragStart?: (event: DragStartEvent) => void;
  activeCard: KanbanCandidate | null;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  positionId,
  data,
  interviewFlow,
  onDragEnd,
  onDragStart,
  activeCard
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  if (!interviewFlow) {
    return (
      <div className="text-center py-5">
        <p className="text-muted">No hay flujo de entrevistas configurado para esta posición.</p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <Row className="kanban-board g-3">
        {interviewFlow.interviewSteps.map((step) => (
          <KanbanColumn
            key={step.id}
            columnId={step.id}
            name={step.name}
            candidates={data[step.id] || []}
          />
        ))}
      </Row>

      <DragOverlay>
        {activeCard ? (
          <div style={{ transform: 'rotate(5deg)' }}>
            <CandidateCard candidate={activeCard} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;