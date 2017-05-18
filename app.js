const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const {ipcMain} = require('electron');

var mainWindow = null;

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('ready', function() {
    mainWindow = new BrowserWindow({width: 800, height: 600, resizable: false, frame: false});
    mainWindow.loadURL('file://' + __dirname + '/app/index.html');

    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', function() {
        mainWindow = null;
    });
});

ipcMain.on('close-main-window', function () {
    app.quit();
});