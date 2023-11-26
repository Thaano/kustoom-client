import Summoner from './Summoner';

const SummonersDiplay = ({ summoners, updateSummoner }) => {
  return (
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
          />
        ))}
      </div>
    </>
  );
};

export default SummonersDiplay;
