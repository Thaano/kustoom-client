import { useEffect, useState } from 'react';
import ReactStars from 'react-rating-stars-component';

const rankIcons = {
  unranked: require('../../../assets/ranks/unranked.png'),
  iron: require('../../../assets/ranks/iron.png'),
  bronze: require('../../../assets/ranks/bronze.png'),
  silver: require('../../../assets/ranks/silver.png'),
  gold: require('../../../assets/ranks/gold.png'),
  platinum: require('../../../assets/ranks/platinum.png'),
  emerald: require('../../../assets/ranks/emerald.png'),
  diamond: require('../../../assets/ranks/diamond.png'),
  master: require('../../../assets/ranks/master.png'),
  grandmaster: require('../../../assets/ranks/grandmaster.png'),
  challenger: require('../../../assets/ranks/challenger.png'),
};

const Player = ({ player, changeCustomName }) => {
  const [playerData, setPlayerData] = useState({});
  const getPlayerData = () => {
    window.electron.ipcRenderer.sendMessage(
      'getPlayerData',
      player.summonerInternalName
    );
  };

  useEffect(() => {
    getPlayerData();

    const listener = (resp) => {
      if (
        resp.data.summonerInternalName === player.summonerInternalName &&
        resp.success
      ) {
        setPlayerData(resp.data.rank);
      } else {
        console.log('getPlayerData-reply', resp);
      }
    };

    window.electron.ipcRenderer.on('getPlayerData-reply', listener);

    return () => {
      //   window.electron.ipcRenderer.removeListener(
      //     'getPlayerData-reply',
      //     listener
      //   );
    };
  }, [player]);

  const soloTier =
    playerData?.RANKED_SOLO_5x5?.tier?.toLowerCase() || 'unranked';
  const soloRankIcon = rankIcons[soloTier];
  const flexTier =
    playerData?.RANKED_FLEX_SR?.tier?.toLowerCase() || 'unranked';
  const flexRankIcon = rankIcons[flexTier];

  const [rating, setRating] = useState(0);
  const ratingChanged = (newRating) => {
    // console.log(newRating);
  };

  return (
    <div className="grid grid-cols-12 bg-gray-800 rounded-lg px-3 py-2 my-3 gap-3">
      <div className="col-span-4 grid grid-cols-6">
        <img
          className="col-span-2 rounded-md w-16 h-16"
          src={`https://ddragon-webp.lolmath.net/latest/img/profileicon/${player.summonerIconId}.webp`}
          alt=""
        />
        <div className="col-span-4 flex flex-col justify-between items-start">
          <input
            type="text"
            className="bg-transparent font-bold w-[150px]"
            spellCheck={false}
            placeholder={player.summonerInternalName}
            defaultValue={player.summonerInternalName}
            onChange={(e) => {
              changeCustomName(player.summonerId, e.target.value);
            }}
            onBlur={(e) => {
              if (e.target.value === '') {
                e.target.value = player.summonerInternalName;
                changeCustomName(player.summonerId, e.target.value);
              }
            }}
          />
          <div>lvl {player.summonerLevel}</div>
        </div>
      </div>
      <div className="col-span-3 flex flex-row items-center gap-1">
        <img src={soloRankIcon} alt="" className="w-16 h-16" />
        <div>
          <div className="flex flex-col justify-between items-start text-xs">
            <p className="text-sm font-bold">SOLO/DUO</p>
            <div>
              {playerData && playerData.RANKED_SOLO_5x5 ? (
                <>
                  {playerData.RANKED_SOLO_5x5.tier}{' '}
                  {playerData.RANKED_SOLO_5x5.rank}
                </>
              ) : (
                <>Unranked</>
              )}
            </div>
            <div>
              {playerData && playerData.RANKED_SOLO_5x5 && (
                <>
                  w/l : {playerData.RANKED_SOLO_5x5.wins}/
                  {playerData.RANKED_SOLO_5x5.losses}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-3 flex flex-row items-center gap-1">
        <img src={flexRankIcon} alt="" className="w-16 h-16" />
        <div>
          <div className="flex flex-col justify-between items-start text-xs">
            <p className="text-sm font-bold">FLEX</p>
            <div>
              {playerData &&
                //   !playerData.RANKED_SOLO_5x5 &&
                playerData.RANKED_FLEX_SR && (
                  <>
                    {playerData.RANKED_FLEX_SR.tier}{' '}
                    {playerData.RANKED_FLEX_SR.rank}
                  </>
                )}
            </div>
            <div>
              {playerData &&
              //   !playerData.RANKED_SOLO_5x5 &&
              playerData.RANKED_FLEX_SR ? (
                <>
                  w/l : {playerData.RANKED_FLEX_SR.wins}/
                  {playerData.RANKED_FLEX_SR.losses}
                </>
              ) : (
                <>Unranked</>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-2 flex flex-col items-center justify-center">
        {/* <div className="">rating</div> */}
        <ReactStars
          count={5}
          onChange={ratingChanged}
          size={24}
          activeColor="#ffd700"
        />
      </div>
    </div>
  );
};

export default Player;
