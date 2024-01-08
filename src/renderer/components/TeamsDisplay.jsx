import { useTranslation } from 'react-i18next';
import Summoner from './Summoner';

const TeamsDisplay = ({ teams, updateSummoner }) => {
  const { t } = useTranslation();

  return (
    <>
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
              borderColor="border-red-800"
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col">
        <div>
          {t('home.team_display.reroll_number')} : {teams.nbReroll}
        </div>
      </div>
    </>
  );
};

export default TeamsDisplay;
