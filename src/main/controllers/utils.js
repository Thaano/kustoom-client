const { ipcMain, nativeImage, clipboard } = require('electron');

ipcMain.on('takeScreenShot', async (event, dataurl) => {
  const image = nativeImage.createFromDataURL(dataurl);
  clipboard.writeImage(image);

  console.log('Image copiée dans le presse-papiers');
});
