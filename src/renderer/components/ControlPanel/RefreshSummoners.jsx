import { useContext, useEffect } from 'react';

import { SummonersContext } from 'renderer/hooks/summonersContext';
import { LobbyNameContext } from 'renderer/hooks/lobbyNameContext';
import { TeamsContext } from 'renderer/hooks/teamsContext';
import { LoadingContext } from 'renderer/hooks/loadingContext';
import { ErrorContext } from 'renderer/hooks/errorContext';

import Button from '../Button';

import refreshIcon from '../../../../assets/icons/refresh.svg';

const RefreshSummoners = () => {
  const { setLoading } = useContext(LoadingContext);
  const { setTeams } = useContext(TeamsContext);
  const { setSummoners } = useContext(SummonersContext);
  const { setError } = useContext(ErrorContext);
  const { setLobbyName } = useContext(LobbyNameContext);

  const getSummonersFromLobby = () => {
    setLoading(true);
    window.electron.ipcRenderer.sendMessage('getSummonersFromLobby');
  };
  const getLobbyName = () => {
    window.electron.ipcRenderer.sendMessage('getLobbyName');
  };

  useEffect(() => {
    window.electron.ipcRenderer.on('getSummonersFromLobby-reply', (resp) => {
      if (!resp.success) {
        setError(resp.error);
        setSummoners([]);
        setLoading(false);
        setLobbyName(null);
        return;
      }
      getLobbyName();
      setSummoners([]);
      setSummoners(resp.summoners);
      setError(false);
      setLoading(false);
      console.log('getSummonersFromLobby-reply', resp);
    });

    window.electron.ipcRenderer.on('getLobbyName-reply', (resp) => {
      if (!resp.success) {
        setError(resp.error);
        return;
      }
      console.log('getLobbyName-reply', resp);
      setLobbyName(resp.lobbyName);
      setError(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const actualizeSummoners = () => {
    setLoading(true);
    setTeams(null);
    setSummoners([]);
    getSummonersFromLobby();
  };

  return (
    <Button onClick={actualizeSummoners} title="refresh">
      <img src={refreshIcon} alt="refresh" className="w-4" /> Refresh
    </Button>
  );
};

export default RefreshSummoners;
