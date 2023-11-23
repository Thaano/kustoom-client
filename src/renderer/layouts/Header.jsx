import styled from 'styled-components';

import minimizeIcon from '../../../assets/icons/minimize.svg';
import maximizeIcon from '../../../assets/icons/maximize.svg';
import closeIcon from '../../../assets/icons/close.svg';

const StyledHeader = styled.header`
  -webkit-app-region: drag;
  -webkit-user-select: none;
`;

const WindowControlButton = styled.button`
  -webkit-app-region: no-drag;
`;

const Header = () => {
  const minimize = () => {
    window.electron.ipcRenderer.sendMessage('minimize');
  };
  const maximize = () => {
    window.electron.ipcRenderer.sendMessage('maximize');
  };
  const close = () => {
    window.electron.ipcRenderer.sendMessage('close');
  };

  return (
    <div className="bg-gray-800">
      <StyledHeader
        className="flex flex-row align-middle justify-between "
        onDoubleClick={maximize}
      >
        <div className="flex items-center justify-center uppercase font-extrabold text-xl p-2 px-3">
          KUSTOOM
          <span className="uppercase font-bold text-[10px] rounded-lg bg-gray-600 px-1 ml-1">
            when
          </span>
        </div>
        <div onDoubleClick={maximize} className="flex-1"></div>
        <div className="px-2">
          <WindowControlButton
            className="hover:bg-gray-700 h-full"
            type="button"
            onClick={minimize}
          >
            <img src={minimizeIcon} alt="minimize" />
          </WindowControlButton>
          <WindowControlButton
            className="hover:bg-gray-700 h-full"
            type="button"
            onClick={maximize}
          >
            <img src={maximizeIcon} alt="maximize" />
          </WindowControlButton>
          <WindowControlButton
            className="hover:bg-orange-700 h-full"
            type="button"
            onClick={close}
          >
            <img src={closeIcon} alt="close" />
          </WindowControlButton>
        </div>
        {/* <nav className="p-5"> */}
        {/* <ul className="flex flex-row">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul> */}
        {/* </nav> */}
      </StyledHeader>
    </div>
  );
};

export default Header;
