/**
 * Created by Petr on 18.05.2017.
 */

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const { ipcMain } = require('electron');
const fs = require('fs');
var Avrgirl = require('avrgirl-arduino');

var mainWindow = null;
global.sender = null;

var savedFile = null;
var board = null;
var port = null;

var onlyMainBoards = true;

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('ready', function() {
    mainWindow = new BrowserWindow({
        width: 900,
        height: 1000,
        resizable: false,
        frame: false,
        icon: "app/media/icon64.png",
        title: "TechLabIDE"
    });

    mainWindow.loadURL('file://' + __dirname + '/app/index.html');
    mainWindow.maximize();

    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', function() {
        mainWindow = null;
    });
});


/*
 * Ipc handlers
 */
ipcMain.on('ready', function(e, d) {
    global.sender = e.sender;
    Avrgirl.list(function(err, ports) {
        global.sender.send('portsRefresh', ports);
        port = ports[0];
    });

    setInterval(function() {
        Avrgirl.list(function(err, ports) {
            global.sender.send('portsRefresh', ports);
        });
    }, 5000);

    boards = get_boards();
    global.sender.send('boardsRefresh', boards);
    board = boards[0];
});


ipcMain.on('close', function() {
    app.quit();
});
ipcMain.on('min', function() {
    mainWindow.minimize();
});


ipcMain.on('setOMB', function(e, d) {
    onlyMainBoards = d;
});


ipcMain.on('compile', function(e, d) {
    get_hex(d, function(res, c) {
        global.sender.send("c", (c == 0 ? true : false));
    });
});
ipcMain.on('upload', function(e, d) {
    get_hex(d, function(res, c) {
        var avrgirl = new Avrgirl({
            board: board.name,
            port: port.comName,
            debug: true
        });
        var fs = require('fs');
        fs.writeFile("data.hex", res, function(err) {
            if (err) {
                log("write file err")
            } else {
                avrgirl.flash("data.hex", function(error) {
                    if (error) {
                        console.error(error);
                    } else {
                        console.info('done.');
                    }
                    global.sender.send("u", (error ? false : true));
                });
            }
        });
    });
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


ipcMain.on('boardSelected', function(e, d) {
    board = d;
});

ipcMain.on('portSelected', function(e, d) {
    port = d;
});

function log(e) {
    console.log(e);
}

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

/*
 * Code processing
 */
function get_hex(code, cb) {
    var http = require('http');
    var options = {
        host: 'bardin.petr.fvds.ru',
        port: 2000,
        path: '/?data=' + encodeURI(JSON.stringify({ "board": board.aname, "sketch": code }))
    };

    callback = function(response) {
        var str = '';

        response.on('data', function(chunk) {
            str += chunk;
        });
        response.on('end', function() {
            console.log('compilation finished');
            var data = JSON.parse(str);
            cb(data.hex, data.code);
        });
    }

    http.request(options, callback).end();
    console.log('compilation started');
}

function get_boards() {
    var b = require('./boards.js');
    if (onlyMainBoards) {
        b = b.slice(0, 3);
    }
    return b;
}