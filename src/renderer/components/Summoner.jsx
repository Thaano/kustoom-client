/* eslint-disable global-require */
import { useState, useContext } from 'react';
import styled from 'styled-components';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { HideRankContext } from 'renderer/hooks/hideRankContext';

import Rating from './Rating';

const StyledDiv = styled.div`
  * {
    /* border: 1px solid red; */
  }
`;

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

const FlexRank = ({ summoner, flexRankIcon }) => {
  return (
    <div className="col-span-1 flex flex-row items-center gap-1">
      <img src={flexRankIcon} alt="" className="w-8 h-8" />
      <div>
        {summoner.ranked && summoner.ranked.RANKED_FLEX_SR && (
          <div className="font-bold">FLEX</div>
        )}
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
    </div>
  );
};

const Summoner = ({
  summoner,
  updateSummoner,
  borderColor = 'bg-gray-800',
}) => {
  const { hideRank } = useContext(HideRankContext);

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
    if (newRating < 0.5) {
      // eslint-disable-next-line no-param-reassign
      newRating = 0.5;
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
    <StyledDiv
      className={`grid grid-cols-7 items-center bg-gray-800 rounded-lg border ${borderColor} h-[58px] px-2 py-1 mb-4 text-sm gap-1`}
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
            className="bg-transparent font-bold w-[160px] h-[25px]"
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
      <div
        className="col-span-2 flex flex-row items-center gap-2"
        data-tooltip-id={`tooltip-${summoner.accountId}`}
      >
        {!hideRank && (
          <>
            <ReactTooltip
              id={`tooltip-${summoner.accountId}`}
              place="left"
              content={
                <FlexRank summoner={summoner} flexRankIcon={flexRankIcon} />
              }
            />
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
          </>
        )}
      </div>

      {/* RATING */}
      <div className="col-span-2 flex flex-row items-center justify-center gap-4">
        {/* <div className="">rating</div> */}
        {rating && summoner && (
          <Rating rating={summoner.rating} ratingChanged={ratingChanged} />
        )}
        <div className="rounded bg-slate-500 py-1 w-[25px] text-center">
          {summoner.rating}
        </div>
      </div>
    </StyledDiv>
  );
};

export default Summoner;
