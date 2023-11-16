import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from 'renderer/components/Button';
import ErrorMsg from 'renderer/components/ErrorMsg';
import Player from 'renderer/components/Player';
import MainLayout from 'renderer/layouts/MainLayout';

const Home = () => {
  const [error, setError] = useState(false);
  const [players, setPlayers] = useState([]);

  const getPlayersFromLobby = () => {
    window.electron.ipcRenderer.sendMessage('getPlayersFromLobby');
  };

  const actualizePlayers = () => {
    setPlayers([]);
    getPlayersFromLobby();
  };

  const calculateLevel = () => {};

  useEffect(() => {
    getPlayersFromLobby();

    window.electron.ipcRenderer.on('getPlayersFromLobby-reply', (resp) => {
      if (resp.success) {
        setPlayers([]);
        setPlayers(resp.players);
        setError(false);
        console.log('getPlayersFromLobby-reply', resp);
      } else {
        console.log('getPlayersFromLobby-reply', resp);
        setError(resp.error);
        setPlayers([]);
      }
    });
  }, []);

  const changeCustomName = (summonerId, customName) => {
    const newPlayers = players.map((player) => {
      return player.summonerId === summonerId
        ? { ...player, customName }
        : player;
    });
    setPlayers(newPlayers);
    console.log('newPlayers', newPlayers);
  };

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold text-center">Lobby courant</h1>
      {/* <Link to="/test"> */}
      {error && (
        <div className="my-3 text-white">
          <ErrorMsg>{error}</ErrorMsg>
        </div>
      )}
      <div className="flex flex-row gap-4">
        <Button onClick={actualizePlayers}>Actualiser</Button>
        <Button onClick={calculateLevel}>Calculer</Button>
      </div>
      <div>
        {players.map((player) => (
          <Player
            key={player.summonerId}
            player={player}
            changeCustomName={changeCustomName}
          />
        ))}
      </div>

      {/* </Link> */}
    </MainLayout>
  );
};

export default Home;
