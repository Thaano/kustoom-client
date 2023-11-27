/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, dialog, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import i18next from 'i18next';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

require('./controllers/index');
const Store = require('electron-store');

const store = new Store();

class AppUpdater {
  constructor() {
    autoUpdater.setFeedURL({
      provider: 'generic',
      url: process.env.AUTO_UPDATE_FEED_URL,
    });

    log.transports.file.level = 'info';
    autoUpdater.logger = log;

    // autoUpdater.on('download-progress', (progressObj) => {
    //   const percent = Math.floor(progressObj.percent);
    //   mainWindow.webContents.send('update-download-progress', percent);
    // });

    autoUpdater.on('update-downloaded', () => {
      dialog
        .showMessageBox({
          type: 'info',
          title: 'Mises à Jour Téléchargées',
          message:
            "Une nouvelle version a été téléchargée. Voulez-vous redémarrer maintenant pour l'appliquer?",
          buttons: ['Oui', 'Plus tard'],
        })
        .then((response) => {
          if (response.response === 0) {
            autoUpdater.quitAndInstall();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });

    autoUpdater.checkForUpdates();
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    minWidth: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
      nodeIntegration: true,
      devTools: true,
    },
    frame: false,
    // titleBarStyle: 'hidden',
    titleBarStyle: 'customButtonsOnHover',
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

ipcMain.on('close', () => {
  app.quit();
});

ipcMain.on('minimize', () => {
  mainWindow?.minimize();
});

ipcMain.on('maximize', () => {
  // eslint-disable-next-line no-unused-expressions
  mainWindow?.isMaximized() ? mainWindow.unmaximize() : mainWindow?.maximize();
});

ipcMain.on('getAppVersion', (event) => {
  event.reply('getAppVersion-reply', app.getVersion());
});

app.on('ready', () => {
  // const userLocale = app.getLocale().substring(0, 2);
  const userLocale = store.get('language')
    ? store.get('language')
    : app.getLocale().substring(0, 2);
  // const userLocale = 'fr';
  // const userLocale = 'en';

  ipcMain.on('getLocale', (event) => {
    event.returnValue = userLocale;
  });

  const locales = ['en', 'fr'];
  const resources = locales.reduce((acc, locale) => {
    acc[locale] = {
      translation: require(`../dictionaries/${locale}.json`),
    };
    return acc;
  }, {});
  i18next.init(
    {
      resources,
      lng: userLocale,
      // ... vos options
    },
    (err, t) => {
      if (err) return console.log('something went wrong loading', err);
      // t('home.waitingLobbyName'); // -> devrait retourner la traduction
      // console.log('i18next is ready');
      // console.log(t('home.waitingLobbyName'));
      return null;
    }
  );
});

ipcMain.on('changeLanguage', (event, lg) => {
  i18next.changeLanguage(lg);
  store.set('language', lg);
});
