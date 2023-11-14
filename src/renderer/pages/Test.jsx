import { useEffect, useState } from 'react';
import CardNumber from 'renderer/components/CardNumber';

const Test = () => {
  const handleClick = () => {
    window.electron.ipcRenderer.sendMessage('test');
  };

  const getLCUinfos = () => {
    window.electron.ipcRenderer.sendMessage('getLCUinfos');
  };

  const [number, setNumber] = useState('');
  useEffect(() => {
    window.electron.ipcRenderer.on('test', (nb) => {
      setNumber(nb);
      console.log('test', nb);
    });

    window.electron.ipcRenderer.on('getLCUinfos', (path) => {
      console.log('getLCUinfos', path);
    });
  }, []);

  return (
    <div>
      <h1>Test</h1>
      <button type="button" className="rounded" onClick={handleClick}>
        click me !!
      </button>
      <button type="button" className="rounded" onClick={getLCUinfos}>
        Get LCU infos
      </button>
      <div className="mt-4">{number && <CardNumber cardNumber={number} />}</div>
    </div>
  );
};

export default Test;
