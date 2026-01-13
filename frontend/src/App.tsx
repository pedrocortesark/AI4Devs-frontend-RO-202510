import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import Positions from './components/Positions';
import PositionKanban from './components/kanban/PositionKanban';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/positions" replace />} />
          <Route path="/positions" element={<Positions />} />
          <Route path="/positions/:id/kanban" element={<PositionKanbanWrapper />} />
        </Routes>
      </div>
    </Router>
  );
}

// Wrapper para extraer el ID de la URL y pasarlo como prop numérico
function PositionKanbanWrapper() {
  const { id } = useParams<{ id: string }>();
  const positionId = parseInt(id || '0', 10);
  
  if (!id || isNaN(positionId)) {
    return <Navigate to="/positions" replace />;
  }
  
  return <PositionKanban positionId={positionId} />;
}

export default App;
