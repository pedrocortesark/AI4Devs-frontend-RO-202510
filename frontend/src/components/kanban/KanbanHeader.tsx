import React, { useState, useEffect } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { ArrowLeft } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

interface KanbanHeaderProps {
  positionId: number;
}

const KanbanHeader: React.FC<KanbanHeaderProps> = ({ positionId }) => {
  const navigate = useNavigate();
  const [positionTitle, setPositionTitle] = useState<string>(`Posición #${positionId}`);

  useEffect(() => {
    // TODO: Fetch position details from API
    // For now, using mock data
    const mockPositions: Record<number, string> = {
      1: 'Senior Frontend Developer',
      2: 'Backend Engineer',
      3: 'DevOps Engineer',
    };
    setPositionTitle(mockPositions[positionId] || `Posición #${positionId}`);
  }, [positionId]);

  const handleBack = () => {
    navigate('/positions');
  };

  return (
    <Row className="mb-4 align-items-center">
      <Col xs="auto">
        <Button
          variant="outline-secondary"
          onClick={handleBack}
          className="d-flex align-items-center"
          aria-label="Volver a posiciones"
        >
          <ArrowLeft className="me-2" />
          <span className="d-none d-sm-inline">Atrás</span>
        </Button>
      </Col>
      <Col>
        <h1 className="h3 mb-0 text-truncate">{positionTitle}</h1>
        <small className="text-muted">ID: {positionId}</small>
      </Col>
    </Row>
  );
};

export default KanbanHeader;