import { useContext } from 'react';
import { HideRankContext } from 'renderer/hooks/hideRankContext';
import { useTranslation } from 'react-i18next';

import Button from '../Button';

import viewRankIcon from '../../../../assets/icons/eye-empty.svg';
import hideRankIcon from '../../../../assets/icons/eye-off.svg';

const ShowHideRank = () => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'home.controlPanel',
  });

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
        title={t('showHideRank.title')}
      />
      <div className="w-[107px]">
        {hideRank ? t('showHideRank.show') : t('showHideRank.hide')}{' '}
        {t('showHideRank.rank')}
      </div>
    </Button>
  );
};

export default ShowHideRank;
