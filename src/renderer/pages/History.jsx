import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Summoner from 'renderer/components/Summoner';
import { TeamsHistoryContext } from 'renderer/hooks/teamsHistoryContext';
import MainLayout from 'renderer/layouts/MainLayout';

const History = () => {
  const { t } = useTranslation();
  const { teamsHistory } = useContext(TeamsHistoryContext);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTeam, setActiveTeam] = useState(teamsHistory[activeIndex]);

  const handleSetActiveTeam = (index) => () => {
    setActiveIndex(index);
    // setActiveTeam(teamsHistory[index]);
  };

  useEffect(() => {
    setActiveTeam(teamsHistory[activeIndex]);
    console.log('activeteam', activeTeam);
  }, [activeIndex]);

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold text-center mb-4 h-[36px]">
        {t('history.title')}
      </h1>

      <div className="grid grid-cols-6 gap-3">
        <div className="col-span-1 border-r border-[#b8b9bd]">
          <h2 className="text-start font-bold mb-2">History</h2>
          {teamsHistory.map((teams, index) => (
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              onClick={handleSetActiveTeam(index)}
              onKeyPress={handleSetActiveTeam(index)}
              role="button"
              tabIndex="0"
              className={`${
                index === activeIndex && 'font-bold underline'
              } cursor-pointer hover:underline`}
            >
              {t('history.generated_at')} {teams.createdAt.toLocaleTimeString()}
            </div>
          ))}
        </div>

        <div className="col-span-5">
          {activeTeam && activeTeam.type === 'refresh' && (
            <div>{t('history.lobby_refreshed')}</div>
          )}

          {activeTeam && activeTeam.team1 && activeTeam.team2 && (
            <div>
              <div className="grid grid-cols-2 gap-x-4">
                <div>
                  <div className="bg-sky-800 rounded-lg px-2 py-1 mb-4 font-bold text-center flex flex-row items-center gap-4 justify-center">
                    BLUE SIDE{' '}
                    <div className="rounded bg-slate-500 py-1 w-[25px] h-[25px] text-center text-xs flex items-center justify-center">
                      {activeTeam.team1.totalRating}
                    </div>
                  </div>
                  {activeTeam.team1.summoners.map((summoner) => (
                    <Summoner
                      key={summoner.summonerId}
                      summoner={summoner}
                      enableRating={false}
                      borderColor="border-sky-800"
                    />
                  ))}
                </div>
                <div>
                  <div className="bg-red-800 rounded-lg px-2 py-1 mb-4 font-bold text-center flex flex-row items-center gap-4 justify-center">
                    RED SIDE{' '}
                    <div className="rounded bg-slate-500 py-1 w-[25px] h-[25px] text-center text-xs flex items-center justify-center">
                      {activeTeam.team2.totalRating}
                    </div>
                  </div>
                  {activeTeam.team2.summoners.map((summoner) => (
                    <Summoner
                      key={summoner.summonerId}
                      summoner={summoner}
                      enableRating={false}
                      borderColor="border-red-800"
                    />
                  ))}
                </div>
              </div>
              <div>
                Seed :{' '}
                <span className="text-base break-all">
                  {activeTeam?.currentSeed}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default History;
