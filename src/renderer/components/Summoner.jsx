/* eslint-disable global-require */
import { useEffect, useState } from 'react';
import ReactStars from 'react-rating-stars-component';

import emptyRatingIcon from '../../../assets/icons/nerd-empty.png';
import fullRatingIcon from '../../../assets/icons/nerd-full.png';
import halfRatingIcon from '../../../assets/icons/nerd-half.png';

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

const tiers = {
  UNRANKED: 'UNRANKED',
  IRON: 'IRON',
  BRONZE: 'BRONZE',
  SILVER: 'SILVER',
  GOLD: 'GOLD',
  PLATINUM: 'PLAT',
  EMERALD: 'EMD',
  DIAMOND: 'DMD',
  MASTER: 'MASTER',
  GRANDMASTER: 'GDM',
  CHALLENGER: 'CHAL',
};

const Summoner = ({
  summoner,
  updateSummoner,
  hideRank = false,
  borderColor = 'bg-gray-800',
}) => {
  const soloTier =
    summoner.ranked.RANKED_SOLO_5x5?.tier?.toLowerCase() || 'unranked';
  const soloRankIcon = rankIcons[soloTier];
  const flexTier =
    summoner.ranked.RANKED_FLEX_SR?.tier?.toLowerCase() || 'unranked';
  const flexRankIcon = rankIcons[flexTier];

  const [rating, setRating] = useState(summoner.rating ? summoner.rating : 1);
  if (!summoner.rating) summoner.rating = rating;
  const ratingChanged = (newRating) => {
    if (newRating === rating) return;
    if (newRating < 1) {
      // eslint-disable-next-line no-param-reassign
      newRating = 1;
    }
    if (newRating > 5) {
      // eslint-disable-next-line no-param-reassign
      newRating = 5;
    }
    summoner.rating = newRating;
    setRating(summoner.rating);
    updateSummoner(summoner);
    console.log(summoner);
  };

  const changeCustomName = (newCustomName) => {
    summoner.customName = newCustomName;
    updateSummoner(summoner);
  };

  return (
    <div
      className={`grid grid-cols-7 bg-gray-800 rounded-lg border ${borderColor} px-2 py-1 mb-4 text-sm gap-1`}
    >
      <div className="col-span-3 grid grid-cols-5 items-center">
        <img
          className="col-span-1 rounded-md w-8 h-8"
          src={`https://ddragon-webp.lolmath.net/latest/img/profileicon/${summoner.summonerIconId}.webp`}
          alt=""
          onError={(e) => {
            e.target.src =
              'https://ddragon-webp.lolmath.net/latest/img/profileicon/0.webp';
          }} // Image par défaut
        />
        <div className="col-span-4 flex flex-col justify-between items-start">
          <input
            type="text"
            className="bg-transparent font-bold w-[160px]"
            spellCheck={false}
            placeholder={summoner.summonerInternalName}
            defaultValue={summoner.summonerInternalName}
            onChange={(e) => {
              changeCustomName(e.target.value);
            }}
            onBlur={(e) => {
              if (e.target.value === '') {
                e.target.value = summoner.summonerInternalName;
                changeCustomName(e.target.value);
              }
            }}
          />
          <div>lvl {summoner.summonerLevel}</div>
        </div>
      </div>

      {/* RANKS */}
      {/* {AFFICHER SOLO UNIQUEMENT OU FLEX OU UNRANKED} */}
      <div className="col-span-2 flex flex-row items-center gap-2">
        {!hideRank && (
          <>
            <img
              src={
                // eslint-disable-next-line no-nested-ternary
                summoner.ranked && summoner.ranked.RANKED_SOLO_5x5
                  ? soloRankIcon
                  : summoner.ranked &&
                    !summoner.ranked.RANKED_SOLO_5x5 &&
                    summoner.ranked.RANKED_FLEX_SR
                  ? flexRankIcon
                  : rankIcons.unranked
              }
              alt=""
              className="w-12 h-12"
            />
            <div>
              <div className="flex flex-col justify-between items-start text-xs">
                <div>
                  {summoner.ranked && summoner.ranked.RANKED_SOLO_5x5 && (
                    <div className="font-bold">SOLO/DUO</div>
                  )}
                  {summoner.ranked &&
                    !summoner.ranked.RANKED_SOLO_5x5 &&
                    summoner.ranked.RANKED_FLEX_SR && (
                      <div className="font-bold">FLEX</div>
                    )}
                </div>
                <div>
                  {summoner.ranked && summoner.ranked.RANKED_SOLO_5x5 && (
                    <>
                      {tiers[summoner.ranked.RANKED_SOLO_5x5.tier]}{' '}
                      {summoner.ranked.RANKED_SOLO_5x5.rank}
                    </>
                  )}
                  {summoner.ranked &&
                    !summoner.ranked.RANKED_SOLO_5x5 &&
                    summoner.ranked.RANKED_FLEX_SR && (
                      <>
                        {tiers[summoner.ranked.RANKED_FLEX_SR.tier]}{' '}
                        {summoner.ranked.RANKED_FLEX_SR.rank}
                      </>
                    )}
                  {summoner.ranked &&
                    !summoner.ranked.RANKED_SOLO_5x5 &&
                    !summoner.ranked.RANKED_FLEX_SR && <>Unranked</>}
                </div>
                <div>
                  {summoner.ranked && summoner.ranked.RANKED_SOLO_5x5 && (
                    <>
                      {summoner.ranked.RANKED_SOLO_5x5.wins}W/
                      {summoner.ranked.RANKED_SOLO_5x5.losses}L
                    </>
                  )}
                  {summoner.ranked &&
                    !summoner.ranked.RANKED_SOLO_5x5 &&
                    summoner.ranked.RANKED_FLEX_SR && (
                      <>
                        {summoner.ranked.RANKED_FLEX_SR.wins}W /{' '}
                        {summoner.ranked.RANKED_FLEX_SR.losses}L
                      </>
                    )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {/* <div className="col-span-1 flex flex-row items-center gap-1">
        {!hideRank && (
          <>
            <img src={flexRankIcon} alt="" className="w-8 h-8" />
            <div>
              <div className="flex flex-col justify-between items-start text-xs">
                <div>
                  {summoner.ranked && summoner.ranked.RANKED_FLEX_SR && (
                    <>
                      {summoner.ranked.RANKED_FLEX_SR.tier}{' '}
                      {summoner.ranked.RANKED_FLEX_SR.rank}
                    </>
                  )}
                </div>
                <div>
                  {summoner.ranked && summoner.ranked.RANKED_FLEX_SR ? (
                    <>
                      {summoner.ranked.RANKED_FLEX_SR.wins}W /{' '}
                      {summoner.ranked.RANKED_FLEX_SR.losses}L
                    </>
                  ) : (
                    <>Unranked</>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div> */}

      {/* RATING */}
      <div className="col-span-2 flex flex-row items-center justify-center gap-4">
        {/* <div className="">rating</div> */}
        {rating && (
          <ReactStars
            value={rating}
            count={5}
            onChange={ratingChanged}
            isHalf
            // emptyIcon={<i className="fa fa-bath" aria-hidden="true"></i>}
            // emptyIcon={<img src={emptyRatingIcon} className="w-8 h-8" alt="" />}
            // halfIcon={<img src={halfRatingIcon} alt="" />}
            // fullIcon={<img src={fullRatingIcon} alt="" />}
            size={20}
            // activeColor="#00ff6a"
          />
        )}
        <div className="rounded bg-slate-500 py-1 w-[25px] text-center">
          {summoner.rating}
        </div>
      </div>
    </div>
  );
};

export default Summoner;
