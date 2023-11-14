import { ipcMain } from 'electron';

ipcMain.on('test', async (event, arg) => {
  const nb = Math.random();
  console.log(nb);
  event.reply('test', nb);
});
