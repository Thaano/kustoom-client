import { useEffect, useRef, useContext } from 'react';
import MainLayout from 'renderer/layouts/MainLayout';
import pluralizedWord from 'renderer/utils/textUtils';
import { useTranslation } from 'react-i18next';

import { SummonersContext } from 'renderer/hooks/summonersContext';
import { TeamsContext } from 'renderer/hooks/teamsContext';
import { LoadingContext } from 'renderer/hooks/loadingContext';
import { ErrorContext } from 'renderer/hooks/errorContext';
import { LobbyNameContext } from 'renderer/hooks/lobbyNameContext';

import ControlPanel from 'renderer/components/ControlPanel/ControlPanel';
import LoadingLayout from 'renderer/components/LoadingLayout';
import SummonersDiplay from 'renderer/components/SummonersDiplay';
import TeamsDisplay from 'renderer/components/TeamsDisplay';

const Home = () => {
  const { t, i18n } = useTranslation();

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
            {pluralizedWord(t('home.player'), summoners.length)})
          </>
        ) : (
          <>{t('home.waitingLobbyName')}</>
        )}
      </h1>

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
