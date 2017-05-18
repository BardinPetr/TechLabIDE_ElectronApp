/**
 * Created by Petr on 18.05.2017.
 */

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const { ipcMain } = require('electron');
const fs = require('fs');

var mainWindow = null;

var savedFile = null;

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('ready', function() {
    mainWindow = new BrowserWindow({ width: 900, height: 1000, resizable: false, frame: false });
    mainWindow.loadURL('file://' + __dirname + '/app/index.html');
    mainWindow.maximize();

    //mainWindow.webContents.openDevTools();

    mainWindow.on('closed', function() {
        mainWindow = null;
    });
});


/*
 * Ipc handlers
 */

ipcMain.on('close', function() {
    app.quit();
});
ipcMain.on('min', function() {
    mainWindow.minimize();
});


ipcMain.on('compile', function() {
    //TODO
});
ipcMain.on('upload', function() {
    //TODO
});


ipcMain.on('open', function(e, f) {
    openFile(e);
});


ipcMain.on('new', function() {
    savedFile = null;
})

ipcMain.on('save', function(e, d) {
    if (savedFile != null) {
        fs.writeFile(savedFile, d, function(err) {});
    } else {
        saveFileB(d);
    }
});
ipcMain.on('saveB', function(e, d) {
    saveFileB(d);
});
ipcMain.on('saveC', function(e, d) {
    saveFileC(d);
});


ipcMain.on('set', function() {
    //TODO
});


/*
 * File methods
 */

function openFile(e) {
    var { dialog } = require('electron');
    dialog.showOpenDialog({
        filters: [{ name: 'TechLab projects', extensions: ['tlab'] }]
    }, function(fileNames) {
        if (fileNames === undefined) return;
        var fileName = fileNames[0];
        savedFile = fileName;
        fs.readFile(fileName, 'utf-8', function(err, data) {
            e.sender.send('openOk', data);
        });
    });
}


function saveFileB(d) {
    var { dialog } = require('electron');
    dialog.showSaveDialog({
        filters: [{ name: 'TechLab projects', extensions: ['tlab'] }]
    }, function(fileName) {
        if (fileName === undefined) return;
        savedFile = fileName;
        fs.writeFile(fileName, d, function(err) {});
    });
}

function saveFileC(d) {
    var { dialog } = require('electron');
    dialog.showSaveDialog({
        filters: [{ name: 'Arduino sketch', extensions: ['ino'] }]
    }, function(fileName) {
        if (fileName === undefined) return;
        fs.writeFile(fileName, d, function(err) {});
    });
}