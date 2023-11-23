import html2canvas from 'html2canvas';
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Button from 'renderer/components/Button';
import ErrorMsg from 'renderer/components/ErrorMsg';
import Summoner from 'renderer/components/Summoner';
import MainLayout from 'renderer/layouts/MainLayout';
import { generateBalancedTeams } from 'renderer/utils/teamUtils';
import pluralizedWord from 'renderer/utils/textUtils';
import { toast } from 'react-toastify';

import refreshIcon from '../../../assets/icons/refresh.svg';
// import calculateRateIcon from '../../../assets/icons/calculator.svg';
import calculateRateIcon from '../../../assets/icons/dashboard-speed.svg';
import viewRankIcon from '../../../assets/icons/eye-empty.svg';
import hideRankIcon from '../../../assets/icons/eye-off.svg';
import generateTeamsIcon from '../../../assets/icons/group.svg';
import takeScreenIcon from '../../../assets/icons/copy.svg';

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [lobbyName, setLobbyName] = useState(); // [{ summoners: [] }, { summoners: [] }
  const [teams, setTeams] = useState(); // [{ summoners: [] }, { summoners: [] }
  const [summoners, setSummoners] = useState([]);
  const [hideRank, setHideRank] = useState(false);
  const teamDivRef = useRef(null);

  const initLcuAPI = () => {
    window.electron.ipcRenderer.sendMessage('initLcuAPI');
  };
  const getSummonersFromLobby = () => {
    setLoading(true);
    window.electron.ipcRenderer.sendMessage('getSummonersFromLobby');
  };
  const getLobbyName = () => {
    window.electron.ipcRenderer.sendMessage('getLobbyName');
  };
  const actualizeSummoners = () => {
    setLoading(true);
    getLobbyName();
    setTeams(null);
    setSummoners([]);
    getSummonersFromLobby();
  };
  const calculateLobbyRating = () => {
    setLoading(true);
    window.electron.ipcRenderer.sendMessage('calculateLobbyRating', summoners);
  };

  useEffect(() => {
    initLcuAPI();
    // getSummonersFromLobby();

    window.electron.ipcRenderer.on('initLcuAPI-reply', (resp) => {
      if (!resp.success) {
        // console.log('initLcuAPI-reply', resp);
        setError(resp.error);
        setLoading(false);
      }
    });

    window.electron.ipcRenderer.on('getSummonersFromLobby-reply', (resp) => {
      if (!resp.success) {
        setError(resp.error);
        setSummoners([]);
        setLoading(false);
        return;
      }
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

    window.electron.ipcRenderer.on('calculateLobbyRating-reply', (resp) => {
      if (!resp.success) {
        setError(resp.error);
        setLoading(false);
        return;
      }
      setError(false);
      setTeams(null);
      setSummoners(resp.data);
      setLoading(false);
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

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  const generateTeams = async () => {
    setLoading(true);
    setTeams(null);
    if (!summoners || summoners.length < 2) {
      setError('Il faut au moins 2 joueurs pour générer des teams');
      setLoading(false);
      return;
    }

    setError(false);
    const newTeams = generateBalancedTeams(summoners);
    if (!newTeams) {
      setError(
        'La différence de note entre les teams ne permet pas de générer des teams équilibrées'
      );
      setLoading(false);
      return;
    }

    await delay(300);
    setTeams(newTeams);
    setLoading(false);

    console.log('newTeams', newTeams);
  };

  const screenShot = () => {
    if (teamDivRef.current) {
      html2canvas(teamDivRef.current, {
        allowTaint: true,
        useCORS: true,
        // scale: 2,
        // letterRendering: true,
      })
        .then((canvas) => {
          const dataUrl = canvas.toDataURL('image/png');
          window.electron.ipcRenderer.sendMessage('takeScreenShot', dataUrl);
          return null;
        })
        .catch((err) => {
          console.log('err', err);
        });
    }

    toast('📸 Screenshot copied in the clipboard ! Ctrl+V to share it.', {
      position: 'bottom-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
    });
  };

  return (
    <MainLayout>
      {lobbyName && (
        <h1 className="text-3xl font-bold text-center mb-4">
          {lobbyName} ({summoners.length}{' '}
          {pluralizedWord('joueur', summoners.length)})
        </h1>
      )}
      {/* <Link to="/test"> Test </Link> */}
      {error && (
        <div className="my-3 text-white">
          <ErrorMsg>{error}</ErrorMsg>
        </div>
      )}

      <div className="flex flex-row gap-4 pb-2 px-2">
        <Button onClick={actualizeSummoners} title="refresh">
          <img src={refreshIcon} alt="refresh" className="w-4" /> Refresh
        </Button>
        <Button onClick={calculateLobbyRating} title="calculate rating">
          <img src={calculateRateIcon} alt="calculate rating" className="w-4" />{' '}
          Calculate
        </Button>
        <Button onClick={handleHideRank} title="show/hide ranks">
          <img
            src={hideRank ? viewRankIcon : hideRankIcon}
            alt="Show / hide ranks"
            className="w-4"
          />
          {hideRank ? 'Show' : 'Hide'} ranks
        </Button>
        <Button onClick={generateTeams} title="Generate random teams">
          <img
            src={generateTeamsIcon}
            alt="generate random teams"
            className="w-4"
          />
          Generate teams
        </Button>
        {/* <Button
          onClick={(e) => {
            setLoading(!loading);
          }}
        >
          Loading
        </Button> */}
        <Button onClick={screenShot} title="take a screenshot to clipboard">
          <img
            src={takeScreenIcon}
            alt="take a screenshot"
            title="take a screenshot"
            className="w-4"
          />
          Screenshot
        </Button>
      </div>

      <div ref={teamDivRef} className="bg-[#0e1015] py-2 px-2">
        {loading && (
          <>
            <div className="grid grid-cols-2 gap-x-4">
              <div className="skeleton rounded-lg px-2 py-1 mb-4 font-bold text-center flex flex-row items-center gap-4 justify-center h-[33px]"></div>
              <div className="skeleton rounded-lg px-2 py-1 mb-4 font-bold text-center flex flex-row items-center gap-4 justify-center h-[33px]"></div>
            </div>
            <div className="grid grid-cols-2 gap-x-4">
              {Array.from(Array(10).keys()).map((i) => (
                <div className="skeleton h-[58px] items-center bg-gray-800 rounded-lg border px-2 py-1 mb-4 text-sm gap-1"></div>
              ))}
            </div>
          </>
        )}
        {!loading && !teams && summoners && (
          <>
            <div className="grid grid-cols-2 gap-x-4">
              <div className="bg-slate-500 rounded-lg px-2 py-1 mb-4 font-bold text-center flex flex-row items-center gap-4 justify-center h-[33px]"></div>
              <div className="bg-slate-500 rounded-lg px-2 py-1 mb-4 font-bold text-center flex flex-row items-center gap-4 justify-center h-[33px]"></div>
            </div>
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
          </>
        )}
        {!loading && teams && (
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
      </div>
    </MainLayout>
  );
};

export default Home;
