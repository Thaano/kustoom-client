import { createContext, useState, useMemo } from 'react';

export const SummonersContext = createContext();

export const SummonersProvider = ({ children }) => {
  const [summoners, setSummoners] = useState([]);

  const value = useMemo(
    () => ({ summoners, setSummoners }),
    [summoners, setSummoners]
  );

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <SummonersContext.Provider value={value}>
      {children}
    </SummonersContext.Provider>
  );
};
