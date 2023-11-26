import { useContext } from 'react';
import { generateBalancedTeams } from 'renderer/utils/teamUtils';

import { LoadingContext } from 'renderer/hooks/loadingContext';
import { TeamsContext } from 'renderer/hooks/teamsContext';
import { SummonersContext } from 'renderer/hooks/summonersContext';
import { ErrorContext } from 'renderer/hooks/errorContext';

import Button from '../Button';

import generateTeamsIcon from '../../../../assets/icons/group.svg';

const GenerateTeams = () => {
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
      setError('Il faut au moins 2 joueurs pour générer des teams');
      setLoading(false);
      return;
    }

    setError(false);
    const newTeams = generateBalancedTeams(summoners);
    if (!newTeams) {
      setError(
        'La différence de note entre les teams ne permet pas de générer des teams équilibrées'
      );
      setLoading(false);
      return;
    }

    await delay(300);
    setTeams(newTeams);
    setLoading(false);

    console.log('newTeams', newTeams);
  };

  return (
    <Button onClick={generateTeams} title="Generate random teams">
      <img
        src={generateTeamsIcon}
        alt="generate random teams"
        className="w-4"
      />
      Generate teams
    </Button>
  );
};

export default GenerateTeams;
