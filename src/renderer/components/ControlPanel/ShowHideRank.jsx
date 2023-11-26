import { useContext } from 'react';
import { HideRankContext } from 'renderer/hooks/hideRankContext';

import Button from '../Button';

import viewRankIcon from '../../../../assets/icons/eye-empty.svg';
import hideRankIcon from '../../../../assets/icons/eye-off.svg';

const ShowHideRank = () => {
  const { hideRank, setHideRank } = useContext(HideRankContext);

  const handleHideRank = () => {
    setHideRank(!hideRank);
  };

  return (
    <Button onClick={handleHideRank} title="show/hide ranks">
      <img
        src={hideRank ? viewRankIcon : hideRankIcon}
        alt="Show / hide ranks"
        className="w-4"
      />
      <div className="w-[92px]">{hideRank ? 'Show' : 'Hide'} ranks</div>
    </Button>
  );
};

export default ShowHideRank;
