/* eslint-disable global-require */
import { useState, useContext } from 'react';
import styled from 'styled-components';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { HideRankContext } from 'renderer/hooks/hideRankContext';

import Rating from './RatingComponent';

import unranked from '../../../assets/ranks/mini/unranked.svg';
import iron from '../../../assets/ranks/mini/iron.svg';
import bronze from '../../../assets/ranks/mini/bronze.svg';
import silver from '../../../assets/ranks/mini/silver.svg';
import gold from '../../../assets/ranks/mini/gold.svg';
import platinum from '../../../assets/ranks/mini/platinum.svg';
import emerald from '../../../assets/ranks/mini/emerald.svg';
import diamond from '../../../assets/ranks/mini/diamond.svg';
import master from '../../../assets/ranks/mini/master.svg';
import grandmaster from '../../../assets/ranks/mini/grandmaster.svg';
import challenger from '../../../assets/ranks/mini/challenger.svg';
import RankIcon from './RankIcon';

const StyledDiv = styled.div`
  * {
    /* border: 1px solid red; */
  }
`;

const rankIcons = {
  // unranked: require('../../../assets/ranks/unranked.png'),
  // iron: require('../../../assets/ranks/iron.png'),
  // bronze: require('../../../assets/ranks/bronze.png'),
  // silver: require('../../../assets/ranks/silver.png'),
  // gold: require('../../../assets/ranks/gold.png'),
  // platinum: require('../../../assets/ranks/platinum.png'),
  // emerald: require('../../../assets/ranks/emerald.png'),
  // diamond: require('../../../assets/ranks/diamond.png'),
  // master: require('../../../assets/ranks/master.png'),
  // grandmaster: require('../../../assets/ranks/grandmaster.png'),
  // challenger: require('../../../assets/ranks/challenger.png'),
  unranked,
  iron,
  bronze,
  silver,
  gold,
  platinum,
  emerald,
  diamond,
  master,
  grandmaster,
  challenger,
};

const tiers = {
  UNRANKED: 'UNRANKED',
  IRON: 'IRON',
  BRONZE: 'BRZ',
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
      <img src={flexRankIcon} alt="" className="w-10 h-10" />
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
  updateSummoner = () => null,
  borderColor = 'bg-gray-800',
  enableRating = true,
}) => {
  const { hideRank } = useContext(HideRankContext);

  const soloTier =
    summoner.ranked?.RANKED_SOLO_5x5?.tier?.toLowerCase() || 'unranked';
  const soloRankIcon = rankIcons[soloTier];
  const flexTier =
    summoner.ranked?.RANKED_FLEX_SR?.tier?.toLowerCase() || 'unranked';
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
      className={`grid grid-cols-11 gap-2 items-center bg-gray-800 rounded-lg border ${borderColor} h-[58px] px-2 py-1 mb-4 text-sm`}
    >
      <div className="col-span-4 flex gap-2 items-center">
        <img
          className="rounded-md w-10 h-10"
          src={`https://ddragon-webp.lolmath.net/latest/img/profileicon/${summoner.summonerIconId}.webp`}
          alt=""
          onError={(e) => {
            e.target.src =
              'https://ddragon-webp.lolmath.net/latest/img/profileicon/0.webp';
          }} // Image par défaut
        />
        <div className="col-span-4 flex flex-col justify-between items-start ">
          <input
            type="text"
            className="bg-transparent font-bold w-36 h-[25px]"
            spellCheck={false}
            placeholder={summoner.summonerInternalName}
            defaultValue={summoner.customName}
            onChange={(e) => {
              changeCustomName(e.target.value);
            }}
            onBlur={(e) => {
              if (e.target.value === '') {
                e.target.value = summoner.summonerInternalName;
                changeCustomName(e.target.value);
              }
            }}
            title={summoner.customName}
          />
          <div>lvl {summoner.summonerLevel}</div>
        </div>
      </div>

      {/* RANKS */}
      {/* {AFFICHER SOLO UNIQUEMENT OU FLEX OU UNRANKED} */}
      <div
        className={`${
          enableRating ? 'col-span-3' : 'col-span-5'
        } flex flex-row items-center gap-2`}
        data-tooltip-id={`tooltip-${summoner.puuid}`}
      >
        {!hideRank && (
          <>
            <ReactTooltip
              id={`tooltip-${summoner.puuid}`}
              place="left"
              content={
                <FlexRank summoner={summoner} flexRankIcon={flexRankIcon} />
              }
            />
            <RankIcon ranked={summoner.ranked} />
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
      <div
        className={`${
          enableRating ? 'col-span-4' : 'col-span-2'
        } grid grid-cols-4 items-center justify-center gap-2`}
      >
        {/* <div className="">rating</div> */}
        {rating && summoner && (
          <div className={`${enableRating ? 'col-span-3' : 'col-span-1'}`}>
            {enableRating && (
              <Rating rating={summoner.rating} ratingChanged={ratingChanged} />
            )}
          </div>
        )}
        <div className="col-span-1 rounded bg-slate-500 py-1 w-[25px] text-center">
          {summoner.rating}
        </div>
      </div>
    </StyledDiv>
  );
};

export default Summoner;
