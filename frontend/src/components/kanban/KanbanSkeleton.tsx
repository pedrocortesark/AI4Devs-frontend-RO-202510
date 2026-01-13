import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const KanbanSkeleton: React.FC = () => {
  const skeletonColumns = [1, 2, 3, 4];
  const skeletonCards = [1, 2, 3];

  return (
    <Container fluid className="py-4">
      {/* Header Skeleton */}
      <Row className="mb-4">
        <Col>
          <div className="skeleton" style={{ height: '40px', width: '200px', marginBottom: '1rem' }}></div>
        </Col>
      </Row>

      {/* Board Skeleton */}
      <Row className="kanban-board">
        {skeletonColumns.map((col) => (
          <Col key={col} xs={12} sm={6} lg={3} xl={3} className="skeleton-column mb-4">
            <Card className="h-100 shadow-sm border-0">
              <Card.Header className="bg-secondary">
                <div className="skeleton" style={{ height: '20px', width: '120px', backgroundColor: 'rgba(255,255,255,0.3)' }}></div>
              </Card.Header>
              <Card.Body className="p-3 bg-light" style={{ minHeight: '300px' }}>
                {skeletonCards.map((card) => (
                  <div key={card} className="skeleton-card">
                    <div className="skeleton skeleton-header"></div>
                    <div className="skeleton skeleton-text"></div>
                    <div className="skeleton skeleton-text short"></div>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default KanbanSkeleton;
