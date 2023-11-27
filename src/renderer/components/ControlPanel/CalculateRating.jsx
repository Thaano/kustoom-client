import { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { SummonersContext } from 'renderer/hooks/summonersContext';
import { LoadingContext } from 'renderer/hooks/loadingContext';
import { ErrorContext } from 'renderer/hooks/errorContext';
import { TeamsContext } from 'renderer/hooks/teamsContext';

// import calculateRateIcon from '../../../assets/icons/calculator.svg';
import calculateRateIcon from '../../../../assets/icons/dashboard-speed.svg';
import arrowDownIcon from '../../../../assets/icons/nav-arrow-down.svg';

const CustomSelect = styled.select`
  background-image: url(${arrowDownIcon});
  background-repeat: no-repeat;
  background-position: right 4px center; // Ajustez le padding ici
  background-size: 1.2em;
`;

const CalculateRating = () => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'home.controlPanel',
  });

  const { setLoading } = useContext(LoadingContext);
  const { summoners, setSummoners } = useContext(SummonersContext);
  const { setTeams } = useContext(TeamsContext);
  const { setError } = useContext(ErrorContext);

  const [ratingMethod, setRatingMethod] = useState('method1');

  useEffect(() => {
    window.electron.ipcRenderer.on('calculateLobbyRating-reply', (resp) => {
      if (!resp.success) {
        setError(resp.error);
        setLoading(false);
        return;
      }
      setError(false);
      setTeams(null);
      setSummoners(resp.data);
      setLoading(false);
      console.log('calculateLobbyRating-reply', resp);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const calculateLobbyRating = () => {
    setLoading(true);
    window.electron.ipcRenderer.sendMessage(
      'calculateLobbyRating',
      summoners,
      ratingMethod
    );
  };

  return (
    <div className="flex">
      <CustomSelect
        className="bg-gray-900 border border-gray-200 border-r-0  hover:bg-gray-800 hover:text-white rounded-lg p-3 pr-6 py-2 rounded-r-none  appearance-none"
        name="ratingMethod"
        id=""
        onChange={(e) => {
          setRatingMethod(e.target.value);
        }}
      >
        <option value="method1">{t('rating.method1')}</option>
        <option value="method2">{t('rating.method2')}</option>
        <option value="method3">{t('rating.method3')}</option>
        <option value="method3">{t('rating.method4')}</option>
      </CustomSelect>
      <div
        role="button"
        className="border border-gray-200 p-2 rounded-r-md bg-gray-900 hover:bg-gray-800 hover:text-white flex flex-row items-center gap-2"
        onClick={calculateLobbyRating}
        onKeyPress={calculateLobbyRating}
        tabIndex={0}
        title={t('rating.title')}
      >
        <img src={calculateRateIcon} alt="calculate rating" className="w-4" />{' '}
        <button type="button" className="">
          {t('rating.rate')}
        </button>
      </div>

      {/* <Button onClick={calculateLobbyRating} title="calculate rating">
          <img src={calculateRateIcon} alt="calculate rating" className="w-4" />{' '}
          Calculate
        </Button> */}
    </div>
  );
};

export default CalculateRating;
