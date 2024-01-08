const SeedSummoner = ({ summoner, borderColor = 'bg-gray-800' }) => {
  return (
    <div
      className={`grid grid-cols-11 gap-2 items-center bg-gray-800 rounded-lg border ${borderColor} h-[58px] px-2 py-1 mb-4 text-sm`}
    >
      <div className="col-span-4 flex gap-2 items-center">
        <img
          className="rounded-md w-10 h-10"
          src="https://ddragon-webp.lolmath.net/latest/img/profileicon/0.webp"
          alt=""
        />
        <div className="col-span-4 flex flex-col justify-between items-start ">
          <input
            type="text"
            className="bg-transparent font-bold w-36 h-[25px]"
            spellCheck={false}
            placeholder={summoner.summonerInternalName}
            defaultValue={summoner.customName}
            onChange={(e) => null}
            title={summoner.customName}
          />
        </div>
      </div>
    </div>
  );
};

export default SeedSummoner;
