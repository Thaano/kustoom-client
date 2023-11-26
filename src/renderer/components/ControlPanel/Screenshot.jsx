import html2canvas from 'html2canvas';
import { toast } from 'react-toastify';

import Button from '../Button';

import takeScreenIcon from '../../../../assets/icons/copy.svg';

const Screenshot = ({ teamDivRef }) => {
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

    toast('📸 Screenshot copied in the clipboard ! Ctrl+V to share it.', {
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
    <Button onClick={screenShot} title="take a screenshot to clipboard">
      <img
        src={takeScreenIcon}
        alt="take a screenshot"
        title="take a screenshot"
        className="w-4"
      />
      Screenshot
    </Button>
  );
};

export default Screenshot;
