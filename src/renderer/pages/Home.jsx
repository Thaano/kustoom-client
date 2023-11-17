import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from 'renderer/components/Button';
import ErrorMsg from 'renderer/components/ErrorMsg';
import Summoner from 'renderer/components/Summoner';
import MainLayout from 'renderer/layouts/MainLayout';
import { generateBalancedTeams } from 'renderer/utils/teamUtils';
import pluralizedWord from 'renderer/utils/textUtils';

const Home = () => {
  const [error, setError] = useState(false);
  const [teams, setTeams] = useState(); // [{ summoners: [] }, { summoners: [] }
  const [summoners, setSummoners] = useState([]);
  const [hideRank, setHideRank] = useState(false);

  const initLcuAPI = () => {
    window.electron.ipcRenderer.sendMessage('initLcuAPI');
  };
  const getSummonersFromLobby = () => {
    window.electron.ipcRenderer.sendMessage('getSummonersFromLobby');
  };
  const actualizeSummoners = () => {
    setTeams(null);
    setSummoners([]);
    getSummonersFromLobby();
  };
  const calculateLobbyRating = () => {
    window.electron.ipcRenderer.sendMessage('calculateLobbyRating', summoners);
  };

  useEffect(() => {
    initLcuAPI();
    // getSummonersFromLobby();

    window.electron.ipcRenderer.on('initLcuAPI-reply', (resp) => {
      if (!resp.success) {
        // console.log('initLcuAPI-reply', resp);
        setError(resp.error);
      }
    });

    window.electron.ipcRenderer.on('getSummonersFromLobby-reply', (resp) => {
      if (resp.success) {
        setSummoners([]);
        setSummoners(resp.summoners);
        setError(false);
        console.log('getSummonersFromLobby-reply', resp);
      } else {
        setError(resp.error);
        setSummoners([]);
      }
    });

    window.electron.ipcRenderer.on('calculateLobbyRating-reply', (resp) => {
      if (!resp.success) {
        setError(resp.error);
      }
      setSummoners(resp.data);
      console.log('calculateLobbyRating-reply', resp);
    });
  }, []);

  const updateSummoner = (updatedSummoner) => {
    const newSummoners = summoners.map((summoner) => {
      return summoner.id === updatedSummoner.id ? updatedSummoner : summoner;
    });
    setSummoners(newSummoners);
  };

  const handleHideRank = () => {
    setHideRank(!hideRank);
  };

  const generateTeams = () => {
    setTeams(null);
    const newTeams = generateBalancedTeams(summoners);
    setTeams(newTeams);
  };

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold text-center">Lobby courant</h1>
      <div className="mx-auto m-5">
        {summoners && summoners.length > 0 && (
          <p className="text-center">
            Nombre de {pluralizedWord('joueur', summoners.length)} :{' '}
            {summoners.length}
          </p>
        )}
      </div>
      {/* <Link to="/test"> */}
      {error && (
        <div className="my-3 text-white">
          <ErrorMsg>{error}</ErrorMsg>
        </div>
      )}
      <div className="flex flex-row gap-4 mb-[16px]">
        <Button onClick={actualizeSummoners}>Actualiser</Button>
        <Button onClick={calculateLobbyRating}>Calculer les notes</Button>
        <Button onClick={handleHideRank}>
          {hideRank ? 'Afficher' : 'Masquer'} les rangs
        </Button>
        <Button onClick={generateTeams}>Générer des teams</Button>
      </div>

      {!teams ? (
        <div className="grid grid-cols-2 gap-x-4">
          {summoners.map((summoner) => (
            <Summoner
              key={summoner.summonerId}
              summoner={summoner}
              updateSummoner={updateSummoner}
              hideRank={hideRank}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4">
          <div>
            <div className="bg-sky-800 rounded-lg px-2 py-1 mb-4 font-bold text-center flex flex-row items-center gap-4 justify-center">
              BLUE SIDE{' '}
              <div className="rounded bg-slate-500 py-1 w-[25px] h-[25px] text-center text-xs flex items-center justify-center">
                {teams.team1.totalRating}
              </div>
            </div>
            {teams.team1.summoners.map((summoner) => (
              <Summoner
                key={summoner.summonerId}
                summoner={summoner}
                updateSummoner={updateSummoner}
                hideRank={hideRank}
                borderColor="border-sky-800"
              />
            ))}
          </div>
          <div>
            <div className="bg-red-800 rounded-lg px-2 py-1 mb-4 font-bold text-center flex flex-row items-center gap-4 justify-center">
              RED SIDE{' '}
              <div className="rounded bg-slate-500 py-1 w-[25px] h-[25px] text-center text-xs flex items-center justify-center">
                {teams.team2.totalRating}
              </div>
            </div>
            {teams.team2.summoners.map((summoner) => (
              <Summoner
                key={summoner.summonerId}
                summoner={summoner}
                updateSummoner={updateSummoner}
                hideRank={hideRank}
                borderColor="border-red-800"
              />
            ))}
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Home;
