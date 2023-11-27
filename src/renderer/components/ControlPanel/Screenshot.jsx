import html2canvas from 'html2canvas';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import Button from '../Button';

import takeScreenIcon from '../../../../assets/icons/copy.svg';

const Screenshot = ({ teamDivRef }) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'home.controlPanel',
  });

  const screenShot = () => {
    if (teamDivRef.current) {
      html2canvas(teamDivRef.current, {
        allowTaint: true,
        useCORS: true,
        // scale: 2,
        // letterRendering: true,
      })
        .then((canvas) => {
          const dataUrl = canvas.toDataURL('image/png');
          window.electron.ipcRenderer.sendMessage('takeScreenShot', dataUrl);
          return null;
        })
        .catch((err) => {
          console.log('err', err);
        });
    }

    toast(t('screenshot.screenCopied'), {
      position: 'bottom-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
    });
  };

  return (
    <Button onClick={screenShot} title={t('screenshot.title')}>
      <img src={takeScreenIcon} alt="take a screenshot" className="w-4" />
      {t('screenshot.take')}
    </Button>
  );
};

export default Screenshot;
