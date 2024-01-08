import { createContext, useState, useMemo } from 'react';

export const TeamsHistoryContext = createContext();

export const TeamsHistoryProvider = ({ children }) => {
  const [teamsHistory, setTeamsHistory] = useState([]);

  const value = useMemo(
    () => ({ teamsHistory, setTeamsHistory }),
    [teamsHistory, setTeamsHistory]
  );

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <TeamsHistoryContext.Provider value={value}>
      {children}
    </TeamsHistoryContext.Provider>
  );
};
