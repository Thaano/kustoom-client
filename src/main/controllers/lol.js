import { ipcMain } from 'electron';
import LcuAPIinstance from '../models/LcuApi';
import { getLobbyRating, getSummonerData } from '../models/BackendAPi';

require('dotenv').config();

ipcMain.on('test', async (event, arg) => {
  console.log('test');
  const nb = Math.random();
  console.log('nb', nb);
  event.reply('test', nb);
});

ipcMain.on('initLcuAPI', async (event, arg) => {
  try {
    await LcuAPIinstance.init(); // Initialise la connexion
    event.reply('initLcuAPI-reply', { success: true });
  } catch (error) {
    console.log('Erreur lors de l’initialisation de LcuAPI:', error);
    event.reply('initLcuAPI-reply', {
      success: false,
      error:
        "Le client League of Legends n'a pas pu être trouvé. Veuillez lancer le client et réessayer.",
    });
  }
});

ipcMain.on('getSummonersFromLobby', async (event, arg) => {
  const data = await LcuAPIinstance.getSummonersFromLobby(event, arg);

  if (!data.success) {
    event.reply('getSummonersFromLobby-reply', data);
    return;
  }

  const summoners = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const summoner of data.summoners) {
    // eslint-disable-next-line no-await-in-loop
    const summonerData = await getSummonerData(summoner.summonerInternalName);

    if (!summonerData.success) {
      event.reply('getSummonersFromLobby-reply', summonerData);
      return;
    }

    summoners.push({ ...summoner, ...summonerData.data });
  }

  event.reply('getSummonersFromLobby-reply', { success: true, summoners });
});

ipcMain.on('calculateLobbyRating', async (event, summoners) => {
  const data = await getLobbyRating(summoners);

  if (!data.success) {
    event.reply('calculateLobbyRating-reply', {
      success: false,
      error: data.error,
    });
    return;
  }

  event.reply('calculateLobbyRating-reply', { success: true, data: data.data });
});
