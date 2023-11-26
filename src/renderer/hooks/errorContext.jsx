import { createContext, useState, useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';

export const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(false);

  const showError = useCallback((err) => {
    setError(err);
    if (err) {
      console.log('error submitted');
      toast.error(err, {
        position: 'bottom-left',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    }
  }, []);

  const value = useMemo(
    () => ({ error, setError: showError }),
    [error, showError]
  );

  return (
    <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>
  );
};
