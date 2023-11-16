import { ipcMain } from 'electron';
import {
  authenticate,
  createHttpSession,
  createHttp2Request,
} from 'league-connect';
import LcuAPIinstance from './LcuApi';

require('dotenv').config();

ipcMain.on('test', async (event, arg) => {
  console.log('test');
  const nb = Math.random();
  console.log('nb', nb);
  event.reply('test', nb);
});

ipcMain.on('getLCUinfos', async (event, arg) => {
  console.log('getLCUinfos');

  try {
    const credentials = await authenticate();
    const session = await createHttpSession(credentials);
    const response = await createHttp2Request(
      {
        method: 'GET',
        // url: '/lol-summoner/v1/current-summoner',
        url: 'lol-lobby/v2/lobby',
      },
      session,
      credentials
    );
    session.close();
    const data = await response.json();

    console.log('response', data);

    event.reply('getLCUinfos', data);
  } catch (error) {
    console.log('Client LoL non trouvé');
    event.reply('getLCUinfos', null);
  }
});

ipcMain.on('getPlayersFromLobby', async (event, arg) => {
  LcuAPIinstance.getPlayersFromLobby(event, arg);
});

ipcMain.on('getPlayerData', async (event, summonerInternalName) => {
  const url1 = `${process.env.REACT_APP_BACKEND_API_URL}/summoner/get/${summonerInternalName}`;
  try {
    const resp = await fetch(url1, {
      method: 'GET',
      headers: {},
    });
    const data = await resp.json();
    console.log('data', data);

    if (data.success) {
      event.reply('getPlayerData-reply', {
        success: true,
        data: { summonerInternalName, rank: data.data },
      });
    } else {
      event.reply('getPlayerData-reply', { success: false, data: null });
    }
  } catch (error) {
    console.log('error', error);
    event.reply('getPlayerData-reply', { success: false, data: null });
  }
});
