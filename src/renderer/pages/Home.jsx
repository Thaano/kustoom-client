import { useEffect, useState, useRef, useContext } from 'react';
import ErrorMsg from 'renderer/components/ErrorMsg';
import Summoner from 'renderer/components/Summoner';
import MainLayout from 'renderer/layouts/MainLayout';
import pluralizedWord from 'renderer/utils/textUtils';
import ControlPanel from 'renderer/components/ControlPanel/ControlPanel';
import { SummonersContext } from 'renderer/hooks/summonersContext';
import { TeamsContext } from 'renderer/hooks/teamsContext';
import { LoadingContext } from 'renderer/hooks/loadingContext';
import { ErrorContext } from 'renderer/hooks/errorContext';
import { LobbyNameContext } from 'renderer/hooks/lobbyNameContext';
import LoadingLayout from 'renderer/components/LoadingLayout';
import SummonersDiplay from 'renderer/components/SummonersDiplay';
import TeamsDisplay from 'renderer/components/TeamsDisplay';

const Home = () => {
  const { summoners, setSummoners } = useContext(SummonersContext);
  const { teams } = useContext(TeamsContext);
  const { loading, setLoading } = useContext(LoadingContext);
  const { setError } = useContext(ErrorContext);
  const { lobbyName } = useContext(LobbyNameContext);

  const teamDivRef = useRef(null);

  const initLcuAPI = () => {
    window.electron.ipcRenderer.sendMessage('initLcuAPI');
  };

  useEffect(() => {
    initLcuAPI();
    // getSummonersFromLobby();

    window.electron.ipcRenderer.on('initLcuAPI-reply', (resp) => {
      if (!resp.success) {
        setError(resp.error);
        setLoading(false);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateSummoner = (updatedSummoner) => {
    const newSummoners = summoners.map((summoner) => {
      return summoner.id === updatedSummoner.id ? updatedSummoner : summoner;
    });
    setSummoners(newSummoners);
  };

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold text-center mb-4 h-[36px]">
        {lobbyName ? (
          <>
            {lobbyName} ({summoners.length}{' '}
            {pluralizedWord('joueur', summoners.length)})
          </>
        ) : (
          'Waiting for lobby'
        )}
      </h1>

      {/* {error && (
        <div className="my-3 text-white">
          <ErrorMsg>{error}</ErrorMsg>
        </div>
      )} */}

      <ControlPanel teamDivRef={teamDivRef} />

      <div ref={teamDivRef} className="bg-[#0e1015] py-2 px-2">
        {loading && <LoadingLayout />}

        {!loading && !teams && summoners && (
          <SummonersDiplay
            summoners={summoners}
            updateSummoner={updateSummoner}
          />
        )}

        {!loading && teams && (
          <TeamsDisplay teams={teams} updateSummoner={updateSummoner} />
        )}
      </div>
    </MainLayout>
  );
};

export default Home;
