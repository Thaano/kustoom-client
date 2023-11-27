import { useContext } from 'react';
import { generateBalancedTeams } from 'renderer/utils/teamUtils';
import { useTranslation } from 'react-i18next';

import { LoadingContext } from 'renderer/hooks/loadingContext';
import { TeamsContext } from 'renderer/hooks/teamsContext';
import { SummonersContext } from 'renderer/hooks/summonersContext';
import { ErrorContext } from 'renderer/hooks/errorContext';

import Button from '../Button';

import generateTeamsIcon from '../../../../assets/icons/group.svg';

const GenerateTeams = () => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'home.controlPanel',
  });

  const { setLoading } = useContext(LoadingContext);
  const { setTeams } = useContext(TeamsContext);
  const { summoners } = useContext(SummonersContext);
  const { setError } = useContext(ErrorContext);

  const delay = (ms) =>
    new Promise((resolve) => {
      setTimeout(() => resolve(), ms);
    });

  const generateTeams = async () => {
    setLoading(true);
    setTeams(null);
    if (!summoners || summoners.length < 2) {
      setError(t('generateTeams.errors.notEnoughPlayers'));
      setLoading(false);
      return;
    }

    setError(false);
    const newTeams = generateBalancedTeams(summoners);
    if (!newTeams) {
      setError(t('generateTeams.errors.tooMuchGap'));
      setLoading(false);
      return;
    }

    await delay(300);
    setTeams(newTeams);
    setLoading(false);

    console.log('newTeams', newTeams);
  };

  return (
    <Button onClick={generateTeams} title={t('generateTeams.title')}>
      <img
        src={generateTeamsIcon}
        alt="generate random teams"
        className="w-4"
      />
      {t('generateTeams.generate')}
    </Button>
  );
};

export default GenerateTeams;
