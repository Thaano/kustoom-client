import { createContext, useState, useMemo } from 'react';

export const LobbyNameContext = createContext();

export const LobbyNameProvider = ({ children }) => {
  const [lobbyName, setLobbyName] = useState();
  const value = useMemo(
    () => ({ lobbyName, setLobbyName }),
    [lobbyName, setLobbyName]
  );

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <LobbyNameContext.Provider value={value}>
      {children}
    </LobbyNameContext.Provider>
  );
};
