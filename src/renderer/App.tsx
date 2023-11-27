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

const App = () => {
  return (
    <div>
      <HashRouter>
        {/* <Router> */}
        <Routes>
          <Route
            path="/"
            element={
              <SummonersProvider>
                <LobbyNameProvider>
                  <TeamsProvider>
                    <LoadingProvider>
                      <ErrorProvider>
                        <HideRankProvider>
                          <Home />
                        </HideRankProvider>
                      </ErrorProvider>
                    </LoadingProvider>
                  </TeamsProvider>
                </LobbyNameProvider>
              </SummonersProvider>
            }
          />
          {/* <Route path="/test" element={<Test />} /> */}
        </Routes>
        {/* </Router> */}
      </HashRouter>
    </div>
  );
};

export default App;
