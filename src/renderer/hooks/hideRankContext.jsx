import { createContext, useState } from 'react';

export const HideRankContext = createContext();

export const HideRankProvider = ({ children }) => {
  const [hideRank, setHideRank] = useState(false);

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <HideRankContext.Provider value={{ hideRank, setHideRank }}>
      {children}
    </HideRankContext.Provider>
  );
};
