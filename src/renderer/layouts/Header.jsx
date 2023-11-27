import { useEffect, useState } from 'react';
import styled from 'styled-components';
import i18n from 'renderer/utils/i18n';

import minimizeIcon from '../../../assets/icons/minimize.svg';
import maximizeIcon from '../../../assets/icons/maximize.svg';
import closeIcon from '../../../assets/icons/close.svg';

import frIcon from '../../../assets/icons/fr.svg';
import enIcon from '../../../assets/icons/en.svg';

const langIcon = {
  fr: frIcon,
  en: enIcon,
};

const StyledHeader = styled.header`
  -webkit-app-region: drag;
  -webkit-user-select: none;
`;

const WindowControlButton = styled.button`
  -webkit-app-region: no-drag;
`;

const Lang = styled.div`
  -webkit-app-region: no-drag;
`;

const Header = () => {
  const [appVersion, setAppVersion] = useState();
  const currLocale = i18n.language;

  const minimize = () => {
    window.electron.ipcRenderer.sendMessage('minimize');
  };
  const maximize = () => {
    window.electron.ipcRenderer.sendMessage('maximize');
  };
  const close = () => {
    window.electron.ipcRenderer.sendMessage('close');
  };

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('getAppVersion');

    window.electron.ipcRenderer.on('getAppVersion-reply', (resp) => {
      console.log('getAppVersion-reply', resp);
      setAppVersion(resp);
    });
  }, []);

  const handleChangeLanguage = (lang) => {
    console.log('handleChangeLanguage', lang);
    i18n.changeLanguage(lang);
    window.electron.ipcRenderer.sendMessage('changeLanguage', lang);
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
          <span className="mx-2 text-xs">{appVersion && appVersion}</span>
        </div>
        <div onDoubleClick={maximize} className="flex-1"></div>

        <Lang className="flex items-center">
          <div className="dropdown">
            <label
              className="flex flex-row items-center cursor-pointer"
              // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
              tabIndex="0"
              htmlFor="lang"
            >
              <img src={langIcon[currLocale]} alt="" />
              <div className="" style={{ writingMode: 'vertical-rl' }}>
                {'>'}
              </div>
            </label>
            <div className="dropdown-menu bg-gray-700">
              <div
                tabIndex="-1"
                className="dropdown-item text-sm hover:bg-gray-600"
              >
                <button
                  type="button"
                  className="flex gap-2"
                  onClick={(e) => handleChangeLanguage('en')}
                >
                  <img src={langIcon.en} alt="français" /> <p>English</p>
                </button>
              </div>
              <div
                tabIndex="-1"
                className="dropdown-item text-sm hover:bg-gray-600"
              >
                <button
                  type="button"
                  className="flex gap-2"
                  onClick={(e) => handleChangeLanguage('fr')}
                >
                  <img src={langIcon.fr} alt="français" /> <p>Français</p>
                </button>
              </div>
            </div>
          </div>
        </Lang>

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
