import { ipcMain } from 'electron';
import {
  authenticate,
  createHttpSession,
  createHttp2Request,
} from 'league-connect';

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
