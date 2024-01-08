import React from 'react';
import {
  MemoryRouter as Router,
  Routes,
  Route,
  HashRouter,
} from 'react-router-dom';
import Home from './pages/Home';
import './utils/i18n';
import './App.css';
import { SummonersProvider } from './hooks/summonersContext';
import { TeamsProvider } from './hooks/teamsContext';
import { LoadingProvider } from './hooks/loadingContext';
import { ErrorProvider } from './hooks/errorContext';
import { HideRankProvider } from './hooks/hideRankContext';
import { LobbyNameProvider } from './hooks/lobbyNameContext';
import SeedTester from './pages/SeedTester';
import History from './pages/History';
import { TeamsHistoryProvider } from './hooks/teamsHistoryContext';

const ContextWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <SummonersProvider>
      <LobbyNameProvider>
        <TeamsProvider>
          <TeamsHistoryProvider>
            <LoadingProvider>
              <ErrorProvider>
                <HideRankProvider>{children}</HideRankProvider>
              </ErrorProvider>
            </LoadingProvider>
          </TeamsHistoryProvider>
        </TeamsProvider>
      </LobbyNameProvider>
    </SummonersProvider>
  );
};

const App = () => {
  return (
    <div className="h-full">
      <HashRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ContextWrapper>
                <Home />
              </ContextWrapper>
            }
          />
          <Route
            path="/history"
            element={
              <ContextWrapper>
                <History />
              </ContextWrapper>
            }
          />
          <Route
            path="/seed-tester"
            element={
              <ContextWrapper>
                <SeedTester />
              </ContextWrapper>
            }
          />
        </Routes>
      </HashRouter>
    </div>
  );
};

export default App;
