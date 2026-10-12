import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import Toasts from '../components/Toasts';

const ToastContext = createContext(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const counter = useRef(0);

  const remove = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const show = useCallback(
    ({ title, message, type = 'info', duration = 3400 } = {}) => {
      const id = (counter.current += 1);
      setToasts((current) => [...current, { id, title, message, type }]);
      if (duration) {
        setTimeout(() => remove(id), duration);
      }
      return id;
    },
    [remove],
  );

  const value = useMemo(() => ({ show, remove }), [show, remove]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toasts toasts={toasts} onClose={remove} />
    </ToastContext.Provider>
  );
}
