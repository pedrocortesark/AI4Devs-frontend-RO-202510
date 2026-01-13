import React, { useState, useEffect, useCallback } from 'react';
import { Container, Alert } from 'react-bootstrap';
import { DragEndEvent } from '@dnd-kit/core';
import KanbanHeader from './KanbanHeader';
import KanbanBoard from './KanbanBoard';
import KanbanSkeleton from './KanbanSkeleton';
import KanbanToast, { ToastNotification } from './KanbanToast';
import { KanbanData, KanbanCandidate, InterviewFlow, KanbanState } from '../../types/kanban';
import { getInterviewFlow, getCandidatesByPosition } from '../../services/positionService';
import { updateCandidateStage } from '../../services/candidateService';
import { organizeCandidatesByStep } from '../../utils/kanbanUtils';
import './kanban.css';

interface PositionKanbanProps {
  positionId: number;
}

const PositionKanban: React.FC<PositionKanbanProps> = ({ positionId }) => {
  const [state, setState] = useState<KanbanState>({
    data: {},
    loading: true,
    error: null,
    interviewFlow: null,
  });
  const [activeCard, setActiveCard] = useState<KanbanCandidate | null>(null);
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);

  const addNotification = useCallback((type: 'success' | 'error', title: string, message: string) => {
    const id = `notification-${Date.now()}`;
    setNotifications(prev => [...prev, { id, type, title, message, show: true }]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  useEffect(() => {
    const loadKanbanData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        // Fetch interview flow and candidates in parallel
        const [interviewFlowResponse, candidatesResponse] = await Promise.all([
          getInterviewFlow(positionId),
          getCandidatesByPosition(positionId)
        ]);

        // Extract nested interviewFlow from response
        const interviewFlow: InterviewFlow = interviewFlowResponse.interviewFlow?.interviewFlow || interviewFlowResponse;
        const candidates: KanbanCandidate[] = candidatesResponse.candidates || candidatesResponse;

        // Organize candidates by interview step
        const organizedData: KanbanData = organizeCandidatesByStep(candidates, interviewFlow);

        setState({
          data: organizedData,
          loading: false,
          error: null,
          interviewFlow,
        });
      } catch (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Error loading kanban data',
        }));
      }
    };

    loadKanbanData();
  }, [positionId]);

  const handleDragStart = useCallback((event: any) => {
    const candidate = event.active.data.current?.candidate as KanbanCandidate;
    setActiveCard(candidate || null);
  }, []);

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveCard(null);

    if (!over) return;

    const candidateId = active.id as string;
    const candidate = active.data.current?.candidate as KanbanCandidate;
    const targetColumnId = over.id as string;

    if (!candidate || !targetColumnId.startsWith('column-')) return;

    const newStepId = parseInt(targetColumnId.replace('column-', ''));
    const oldStepId = candidate.currentInterviewStep;

    if (newStepId === oldStepId) return;

    // Optimistic update: move candidate immediately in local state
    setState(prevState => {
      const newData = { ...prevState.data };

      // Remove from old column
      if (newData[oldStepId]) {
        newData[oldStepId] = newData[oldStepId].filter(c => c.id !== candidate.id);
      }

      // Add to new column
      if (!newData[newStepId]) {
        newData[newStepId] = [];
      }
      newData[newStepId] = [...newData[newStepId], { ...candidate, currentInterviewStep: newStepId }];

      return {
        ...prevState,
        data: newData,
      };
    });

    try {
      // Persist to backend
      await updateCandidateStage(candidate.id, candidate.applicationId, newStepId);
      
      // Show success notification
      addNotification(
        'success',
        'Candidato actualizado',
        `${candidate.fullName} movido exitosamente a ${state.interviewFlow?.interviewSteps.find(s => s.id === newStepId)?.name || 'nueva fase'}`
      );
    } catch (error) {
      // Show error notification
      addNotification(
        'error',
        'Error al actualizar',
        'No se pudo mover el candidato. Se ha revertido el cambio.'
      );

      // Rollback: move candidate back to original position
      setState(prevState => {
        const rollbackData = { ...prevState.data };

        // Remove from new column
        if (rollbackData[newStepId]) {
          rollbackData[newStepId] = rollbackData[newStepId].filter(c => c.id !== candidate.id);
        }

        // Add back to old column
        if (!rollbackData[oldStepId]) {
          rollbackData[oldStepId] = [];
        }
        rollbackData[oldStepId] = [...rollbackData[oldStepId], { ...candidate, currentInterviewStep: oldStepId }];

        return {
          ...prevState,
          data: rollbackData,
        };
      });
    }
  }, [addNotification, state.interviewFlow]);

  if (state.loading) {
    return <KanbanSkeleton />;
  }

  if (state.error) {
    return (
      <Container fluid className="py-4">
        <Alert variant="danger">
          <Alert.Heading>Error al cargar el tablero</Alert.Heading>
          <p>{state.error}</p>
          <hr />
          <p className="mb-0">
            Verifica que el servidor backend esté ejecutándose en <code>http://localhost:3010</code>
          </p>
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <Container fluid className="py-4">
        <KanbanHeader positionId={positionId} />
        <KanbanBoard
          positionId={positionId}
          data={state.data}
          interviewFlow={state.interviewFlow}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          activeCard={activeCard}
        />
      </Container>
      <KanbanToast notifications={notifications} onClose={removeNotification} />
    </>
  );
};

export default PositionKanban;