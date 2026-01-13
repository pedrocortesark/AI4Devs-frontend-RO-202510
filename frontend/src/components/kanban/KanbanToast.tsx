import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { CheckCircleFill, ExclamationTriangleFill } from 'react-bootstrap-icons';

export interface ToastNotification {
  id: string;
  type: 'success' | 'error';
  title: string;
  message: string;
  show: boolean;
}

interface KanbanToastProps {
  notifications: ToastNotification[];
  onClose: (id: string) => void;
}

const KanbanToast: React.FC<KanbanToastProps> = ({ notifications, onClose }) => {
  return (
    <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          show={notification.show}
          onClose={() => onClose(notification.id)}
          delay={5000}
          autohide
          bg={notification.type === 'success' ? 'success' : 'danger'}
          className="text-white"
        >
          <Toast.Header closeButton closeVariant="white">
            {notification.type === 'success' ? (
              <CheckCircleFill className="me-2" size={16} />
            ) : (
              <ExclamationTriangleFill className="me-2" size={16} />
            )}
            <strong className="me-auto">{notification.title}</strong>
          </Toast.Header>
          <Toast.Body>{notification.message}</Toast.Body>
        </Toast>
      ))}
    </ToastContainer>
  );
};

export default KanbanToast;
