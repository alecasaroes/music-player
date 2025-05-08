const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadFile('index.html');
    
    // Open DevTools (uncomment for debugging)
    // mainWindow.webContents.openDevTools();
    
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

// Handle selecting music files
ipcMain.handle('select-files', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openFile', 'multiSelections'],
        filters: [{ name: 'Audio', extensions: ['mp3'] }]
    });
  
    if (!canceled) {
        return filePaths.map(filePath => {
        return {
            path: filePath,
            name: path.basename(filePath)
        };
        });
    }
  return [];
});