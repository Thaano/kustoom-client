import { createContext, useState, useMemo } from 'react';

export const TeamsContext = createContext();

export const TeamsProvider = ({ children }) => {
  const [teams, setTeams] = useState();

  const value = useMemo(() => ({ teams, setTeams }), [teams, setTeams]);

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <TeamsContext.Provider value={value}>{children}</TeamsContext.Provider>
  );
};
