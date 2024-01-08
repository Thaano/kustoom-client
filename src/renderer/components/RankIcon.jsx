/* eslint-disable react/jsx-props-no-spreading */
import { ReactComponent as Unranked } from '../../../assets/ranks/mini/unranked.svg';
import { ReactComponent as Iron } from '../../../assets/ranks/mini/iron.svg';
import { ReactComponent as Bronze } from '../../../assets/ranks/mini/bronze.svg';
import { ReactComponent as Silver } from '../../../assets/ranks/mini/silver.svg';
import { ReactComponent as Gold } from '../../../assets/ranks/mini/gold.svg';
import { ReactComponent as Platinum } from '../../../assets/ranks/mini/platinum.svg';
import { ReactComponent as Emerald } from '../../../assets/ranks/mini/emerald.svg';
import { ReactComponent as Diamond } from '../../../assets/ranks/mini/diamond.svg';
import { ReactComponent as Master } from '../../../assets/ranks/mini/master.svg';
import { ReactComponent as Grandmaster } from '../../../assets/ranks/mini/grandmaster.svg';
import { ReactComponent as Challenger } from '../../../assets/ranks/mini/challenger.svg';

const RankIcon = ({ ranked }) => {
  const props = {
    className: 'w-10 h-10',
    alt: '',
  };

  if (ranked && ranked.RANKED_SOLO_5x5) {
    const rank = ranked.RANKED_SOLO_5x5.tier;
    switch (rank) {
      case 'UNRANKED':
        return <Unranked {...props} />;
      case 'IRON':
        return <Iron {...props} />;
      case 'BRONZE':
        return <Bronze {...props} />;
      case 'SILVER':
        return <Silver {...props} />;
      case 'GOLD':
        return <Gold {...props} />;
      case 'PLATINUM':
        return <Platinum {...props} />;
      case 'EMERALD':
        return <Emerald {...props} />;
      case 'DIAMOND':
        return <Diamond {...props} />;
      case 'MASTER':
        return <Master {...props} />;
      case 'GRANDMASTER':
        return <Grandmaster {...props} />;
      case 'CHALLENGER':
        return <Challenger {...props} />;
      default:
        return <Unranked {...props} />;
    }
  }

  if (ranked && ranked.RANKED_FLEX_SR) {
    const rank = ranked.RANKED_FLEX_SR.tier;
    switch (rank) {
      case 'UNRANKED':
        return <Unranked {...props} />;
      case 'IRON':
        return <Iron {...props} />;
      case 'BRONZE':
        return <Bronze {...props} />;
      case 'SILVER':
        return <Silver {...props} />;
      case 'GOLD':
        return <Gold {...props} />;
      case 'PLATINUM':
        return <Platinum {...props} />;
      case 'EMERALD':
        return <Emerald {...props} />;
      case 'DIAMOND':
        return <Diamond {...props} />;
      case 'MASTER':
        return <Master {...props} />;
      case 'GRANDMASTER':
        return <Grandmaster {...props} />;
      case 'CHALLENGER':
        return <Challenger {...props} />;
      default:
        return <Unranked {...props} />;
    }
  }

  return <Unranked {...props} />;
};

export default RankIcon;
