import { ipcMain } from 'electron';
import i18next from 'i18next';
import LcuAPIinstance from '../models/LcuApi';
import {
  getLobbyData,
  getLobbyRating,
  getSummonerData,
} from '../models/BackendAPi';

require('dotenv').config();

const { t } = i18next;

ipcMain.on('initLcuAPI', async (event, arg) => {
  try {
    await LcuAPIinstance.init(); // Initialise la connexion
    event.reply('initLcuAPI-reply', { success: true });
  } catch (error) {
    console.log('Erreur lors de l’initialisation de LcuAPI:', error);
    event.reply('initLcuAPI-reply', {
      success: false,
      error: t('backend.lcuApi.clientNotFound'),
    });
  }
});

ipcMain.on('getLobbyName', async (event, arg) => {
  const data = await LcuAPIinstance.getLobbyName(event, arg);

  if (!data.success) {
    event.reply('getLobbyName-reply', data);
    return;
  }

  event.reply('getLobbyName-reply', data);
});

ipcMain.on('getSummonersFromLobby', async (event, arg) => {
  const data = await LcuAPIinstance.getSummonersFromLobby(event, arg);

  if (!data.success) {
    event.reply('getSummonersFromLobby-reply', data);
    return;
  }

  // const summoners = [];
  // // eslint-disable-next-line no-restricted-syntax
  // for (const summoner of data.summoners) {
  //   // eslint-disable-next-line no-await-in-loop
  //   const summonerData = await getSummonerData(summoner.summonerInternalName);

  //   if (!summonerData.success) {
  //     event.reply('getSummonersFromLobby-reply', summonerData);
  //     return;
  //   }

  //   summoners.push({ ...summoner, ...summonerData.data });
  // }

  const summonerData = await getLobbyData(data.summoners);
  if (!summonerData.success) {
    event.reply('getSummonersFromLobby-reply', summonerData);
    return;
  }

  const summoners = summonerData.data;

  event.reply('getSummonersFromLobby-reply', {
    success: true,
    summoners: summoners.summoners,
  });
});

ipcMain.on('calculateLobbyRating', async (event, summoners, method) => {
  const data = await getLobbyRating(summoners, method);

  if (!data.success) {
    event.reply('calculateLobbyRating-reply', {
      success: false,
      error: data.error,
    });
    return;
  }

  event.reply('calculateLobbyRating-reply', { success: true, data: data.data });
});
