import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [message, setMessage] = useState(null);

  const toast = useCallback((msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 2800);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {message && <div className="toast">{message}</div>}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
