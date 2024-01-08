/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from 'react';
import MainLayout from 'renderer/layouts/MainLayout';
import { decompressFromEncodedURIComponent } from 'lz-string';
import SeedSummoner from 'renderer/components/Seed/SeedSummoner';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const SeedTester = () => {
  const { t } = useTranslation();
  const [resultTeams, setResultTeals] = useState(null);

  const decodeTeams = (compressedString) => {
    try {
      // Décompresser la chaîne
      const encodedString = decompressFromEncodedURIComponent(compressedString);

      // Séparer les deux équipes
      const [encodedTeam1, encodedTeam2] = encodedString.split('|');

      // Fonction pour reconstruire les équipes
      const decodeTeam = (encodedTeam) => {
        const parts = encodedTeam.split(',');
        const totalRating = parseFloat(parts.pop(), 10); // Extraire et convertir la dernière partie en nombre pour la note totale
        const summonerNames = parts.join(',').split(';'); // Reconstruire la chaîne des noms et la diviser

        const summoners = summonerNames.map((name) => ({ customName: name }));

        return { summoners, totalRating };
      };

      // Reconstruire les équipes
      const team1 = decodeTeam(encodedTeam1);
      const team2 = decodeTeam(encodedTeam2);

      // Retourner les équipes décodées
      return { team1, team2 };
    } catch (error) {
      toast.error(`${t('seed_tester.errors.invalid_seed')}`, {
        position: 'bottom-left',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    }

    return null;
  };

  const handleGenerateTeamWithSeed = () => {
    const seed = document.getElementById('seed').value;
    const decodedteams = decodeTeams(seed);
    setResultTeals(decodedteams);
    console.log('decodedteams', decodedteams);
  };

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold text-center mb-4 h-[36px]">
        {t('seed_tester.title')}
      </h1>

      <div className="flex flex-col gap-y-2 container mx-auto w-4/5 justify-center align-middle">
        <label htmlFor="seed" className="text-lg">
          Seed
        </label>
        <textarea
          type="text"
          id="seed"
          name="seed"
          className="p-2 rounded-lg text-xs"
        />
        <button
          type="button"
          className="bg-gray-600 rounded-lg px-2 py-1 mb-4 font-bold text-center flex flex-row items-center gap-4 justify-center"
          onClick={handleGenerateTeamWithSeed}
        >
          {t('seed_tester.generate')}
        </button>
      </div>

      <div>
        {resultTeams && (
          <div className="grid grid-cols-2 gap-x-4">
            <div>
              <div className="bg-sky-800 rounded-lg px-2 py-1 mb-4 font-bold text-center flex flex-row items-center gap-4 justify-center">
                BLUE SIDE{' '}
                <div className="rounded bg-slate-500 py-1 w-[25px] h-[25px] text-center text-xs flex items-center justify-center">
                  {resultTeams.team1.totalRating}
                </div>
              </div>
              {resultTeams.team1.summoners.map((summoner) => (
                <SeedSummoner
                  key={summoner.customName}
                  summoner={summoner}
                  borderColor="border-sky-800"
                />
              ))}
            </div>
            <div>
              <div className="bg-red-800 rounded-lg px-2 py-1 mb-4 font-bold text-center flex flex-row items-center gap-4 justify-center">
                RED SIDE{' '}
                <div className="rounded bg-slate-500 py-1 w-[25px] h-[25px] text-center text-xs flex items-center justify-center">
                  {resultTeams.team2.totalRating}
                </div>
              </div>
              {resultTeams.team2.summoners.map((summoner) => (
                <SeedSummoner
                  key={summoner.summonerId}
                  summoner={summoner}
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

export default SeedTester;
