import React, { createContext, useContext, useState, useCallback } from 'react';

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastContextValue {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          zIndex: 9999,
          maxWidth: '380px',
          pointerEvents: 'none'
        }}
      >
        {toasts.map((toast) => {
          const typeColors = {
            success: { border: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399' },
            error: { border: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171' },
            info: { border: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)', text: '#60a5fa' }
          }[toast.type];

          return (
            <div
              key={toast.id}
              onClick={() => removeToast(toast.id)}
              style={{
                pointerEvents: 'auto',
                cursor: 'pointer',
                background: '#0f172a',
                border: `1px solid ${typeColors.border}`,
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                borderRadius: 'var(--radius-md)',
                padding: '0.8rem 1.1rem',
                color: '#f8fafc',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                animation: 'fadeIn 0.2s ease forwards'
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: typeColors.text,
                  flexShrink: 0
                }}
              />
              <span style={{ flex: 1 }}>{toast.message}</span>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
