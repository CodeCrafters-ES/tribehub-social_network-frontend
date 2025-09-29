import React, { useEffect } from 'react';

const FeedbackMessage = ({ type, message, onClose, autoClose = true, duration = 5000 }) => {
  useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  if (!message) return null;

  const getMessageStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-100 border-green-500 text-green-700';
      case 'error':
        return 'bg-red-100 border-red-500 text-red-700';
      case 'warning':
        return 'bg-yellow-100 border-yellow-500 text-yellow-700';
      case 'info':
      default:
        return 'bg-blue-100 border-blue-500 text-blue-700';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className={`feedback-message ${getMessageStyles()}`}>
      <div className="flex items-center">
        <span className="message-icon">{getIcon()}</span>
        <span className="message-text">{message}</span>
        {onClose && (
          <button
            className="close-button"
            onClick={onClose}
            aria-label="Cerrar mensaje"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default FeedbackMessage;