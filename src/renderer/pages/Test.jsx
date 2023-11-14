import { useEffect, useState } from 'react';
import CardNumber from 'renderer/components/CardNumber';

const Test = () => {
  const handleClick = () => {
    window.electron.ipcRenderer.sendMessage('test');
  };

  const [number, setNumber] = useState('');
  useEffect(() => {
    window.electron.ipcRenderer.on('test', (nb) => {
      setNumber(nb);
      console.log('test', nb);
    });
  }, []);

  return (
    <div>
      <h1>Test</h1>
      <button type="button" className="rounded" onClick={handleClick}>
        click me !!
      </button>
      <div className="mt-4">{number && <CardNumber cardNumber={number} />}</div>
    </div>
  );
};

export default Test;
