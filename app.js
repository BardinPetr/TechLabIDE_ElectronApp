/**
 * Created by Petr on 18.05.2017.
 */

const electron = require('electron');
const { app, globalShortcut, BrowserWindow, ipcMain } = require('electron')
const fs = require('fs');
var Avrgirl = require('avrgirl-arduino');
var SerialPort = require("serialport");
var fileSystem = require('fs');
var path = require('path');
var exec = require('child_process').exec;

function _execute(command, callback) {
    exec(command, function(error, stdout, stderr) {
        callback(stdout);
    });
};

function execute(command, callback) {
    exec(command, function(error, stdout, stderr) {});
};

var sp = null;

var mainWindow = null;
var termWindow = null;
var setWindow = null;
var stWindow = null;

global.sender = null;
global.tSender = null;

var savedFile = null;
var board = null;
var port = {};
global.sPort = null;

var onlyMainBoards = true;
var baudR = 9600;

var _icon = (process.platform === 'win32' ? '.ico' : (process.platform === 'linux' ? '.png' : '.icns'));

app.on('window-all-closed', function() {
    app.quit();
});

app.on('ready', function() {
    process.env.GOOGLE_API_KEY = "AIzaSyABpfe6JaAcvpLRxAg6h_uo-XMpyz17RUM";

    stWindow = new BrowserWindow({
        width: 400,
        height: 450,
        resizable: false,
        frame: false,
        icon: "app/media/icon64" + _icon,
        title: "TechLabIDE",
        show: true
    });
    stWindow.loadURL('file://' + __dirname + '/app/start.html');

    mainWindow = new BrowserWindow({
        width: 900,
        height: 1000,
        resizable: true,
        frame: false,
        icon: "app/media/icon64" + _icon,
        title: "TechLabIDE",
        show: false
    });

    mainWindow.loadURL('file://' + __dirname + '/app/index.html');
    mainWindow.once('ready-to-show', () => {
        setTimeout(() => {
            mainWindow.show()
            mainWindow.maximize();
            if (require("./settings.json").debug) mainWindow.webContents.openDevTools();
            stWindow.hide();
        }, 3000);
    })

    mainWindow.on('closed', function() {
        mainWindow = null;
    });

    termWindow = new BrowserWindow({
        width: 770,
        height: 500,
        minWidth: 770,
        minHeight: 510,
        frame: false,
        show: false,
        icon: "app/media/icons/terminal.png",
        title: "Terminal"
    });
    termWindow.loadURL('file://' + __dirname + '/app/term.html');

    setWindow = new BrowserWindow({
        width: 770,
        height: 540,
        minWidth: 770,
        minHeight: 540,
        frame: false,
        show: false,
        icon: "app/media/icons/settings.png",
        title: "Settings"
    });
    setWindow.loadURL('file://' + __dirname + '/app/set.html');

    onlyMainBoards = require("./settings.json").onlyMainBoards;
});


/*
 * Ipc handlers
 */
ipcMain.on('ready', function(e, d) {
    global.sender = e.sender;
    boards = get_boards();
    global.sender.send('boardsRefresh', boards);
    board = boards[0];
    global.sender.send('run', require("./settings.json"));

    var _args = process.argv;
    if (_args.length > 1 && _args[_args.length - 1] != '.' && (_args.length - 1) != 0) {
        fs.readFile(_args[_args.length - 1], 'utf-8', function(err, data) {
            e.sender.send('openOk', data);
            savedFile = _args[_args.length - 1];
        });
    }

    globalShortcut.register('CommandOrControl+S', () => {
        e.sender.send("ctrl+s");
    });
    globalShortcut.register('CommandOrControl+N', () => {
        e.sender.send("ctrl+n");
    });
    globalShortcut.register('CommandOrControl+O', () => {
        e.sender.send("ctrl+o");
    });
    globalShortcut.register('CommandOrControl+U', () => {
        e.sender.send("ctrl+u");
    });
    globalShortcut.register('CommandOrControl+T', () => {
        e.sender.send("ctrl+t");
    });
    app.on('will-quit', () => {
        globalShortcut.unregisterAll();
    });
});


ipcMain.on('close', function() {
    app.quit();
});
ipcMain.on('min', function() {
    mainWindow.minimize();
});

ipcMain.on('Tclose', function(e, d) {
    e.sender.send("TcloseNow");
    termWindow.hide();
});
ipcMain.on('Tmin', function() {
    termWindow.minimize();
});
ipcMain.on('Tmax', function() {
    termWindow.maximize();
});

ipcMain.on('Sclose', function(e, d) {
    setWindow.hide();
});

ipcMain.on('compile', function(e, d) {
    get_hex(d, function(res, c) {
        global.sender.send("c", (c == 0 ? true : false));
    });
});
ipcMain.on('upload', function(e, d) {
    if (port) {
        e.sender.send("cstart");
    } else {
        e.sender.send("noport");
        return;
    }
    get_hex(d, function(res, c) {
        if (c != 0) {
            global.sender.send("u", false);
            return;
        }
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
    setWindow = new BrowserWindow({
        width: 770,
        height: 540,
        minWidth: 770,
        minHeight: 540,
        frame: false,
        show: false,
        icon: "app/media/icons/settings.png",
        title: "Settings"
    });
    setWindow.loadURL('file://' + __dirname + '/app/set.html');
    setWindow.show();
    if (require("./settings.json").debug) setWindow.webContents.openDevTools();
    ipcMain.on("setRun", function(_e, _d) {
        setTimeout(() => {
            _e.sender.send("setOk", require('./settings.json'));
        }, 500);
    })
});
ipcMain.on("updateSettings", function(e, d) {
    fs.writeFile(__dirname + "/settings.json", JSON.stringify(d), () => {
        boards = get_boards();
        global.sender.send('boardsRefresh', boards);
        setWindow.hide();
        app.relaunch({
            args: process.argv.slice(1).concat(['--relaunch'])
        })
        app.exit(0);
    });
})

ipcMain.on('boardSelected', function(e, d) {
    board = d;
});

ipcMain.on('portSelected', function(e, d) {
    port = d;
    global.sPort = d;
});

function log(e) {
    if (require("./settings.json").debug) {
        console.log(e);
    }
}

/*
 * File methods
 */

function openFile(e) {
    var {
        dialog
    } = require('electron');
    dialog.showOpenDialog({
        filters: [{
            name: 'TechLab projects',
            extensions: ['tlab']
        }]
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
    var {
        dialog
    } = require('electron');
    dialog.showSaveDialog({
        filters: [{
            name: 'TechLab projects',
            extensions: ['tlab']
        }]
    }, function(fileName) {
        if (fileName === undefined) return;
        savedFile = fileName;
        fs.writeFile(fileName, d, function(err) {});
    });
}

function saveFileC(d) {
    var {
        dialog
    } = require('electron');
    dialog.showSaveDialog({
        filters: [{
            name: 'Arduino sketch',
            extensions: ['ino']
        }]
    }, function(fileName) {
        if (fileName === undefined) return;
        fs.writeFile(fileName, d, function(err) {});
    });
}

/*
 * Code processing
 */
function get_hex(code, cb) {
    if (require("./settings.json").uploadType) {
        var http = require('http');
        var options = {
            host: require("./settings.json").srv.url,
            port: require("./settings.json").srv.port,
            path: '/?data=' + encodeURI(JSON.stringify({
                "board": board.aname,
                "sketch": code
            }))
        };

        callback = function(response) {
            var str = '';

            response.on('data', function(chunk) {
                str += chunk;
            });
            response.on('end', function() {
                log('compilation finished');
                var data = JSON.parse(str);
                cb(data.hex, data.code);
            });
        }

        http.request(options, callback).end();
        log('compilation started');
    } else {
        ////
        log('compilation started');
        var rnd = "s4526132";
        var rnd_o = "o" + rnd;
        var s_Path = rnd + "/" + rnd + ".ino";
        var o_Path = rnd_o + "\\";
        var h_Path = rnd_o + "/" + rnd + ".ino.with_bootloader.hex";
        _execute("mkdir " + rnd, () => {
            _execute("mkdir " + rnd_o, () => {
                try {
                    fileSystem.writeFile(s_Path, code, function(err) {
                        if (err) {
                            execute('rm -r' + rnd);
                            execute('rm -r' + rnd_o);
                            cb(null, 2);
                            log(err);
                            return;
                        }

                        var arduinopath = require("./settings.json").arduinoPath + (" --board " + board.aname) + (" --pref build.path=" + rnd_o) + (" --verify " + s_Path);
                        exec(arduinopath, function(code, stdout, stderr) {
                            if (stdout.search("Sketch uses ") != -1) {
                                var filePath = path.join(__dirname, h_Path);
                                fileSystem.readFile(h_Path, 'utf8', function(err, data) {
                                    if (err) {
                                        execute('rm -r' + rnd);
                                        execute('rm -r' + rnd_o);
                                        cb(null, 2);
                                        return;
                                    }
                                    execute('rm -r' + rnd);
                                    execute('rm -r' + rnd_o);
                                    log("compilation finished")
                                    cb(data, 0);
                                });
                            } else {
                                execute('rm -r' + rnd);
                                execute('rm -r' + rnd_o);
                                cb(null, 2);
                            }
                        });
                    });
                } catch (Exception) {
                    log("ERROR");
                    execute('rm -r' + rnd);
                    execute('rm -r' + rnd_o);
                    cb(null, 2);
                }
            });
        });

        ////
    }
}

function get_boards() {
    var b = require('./boards.js');
    if (require("./settings.json").onlyMainBoards) {
        b = b.slice(0, 3);
    }
    return b;
}

/*
 * Terminal
 */

ipcMain.on("terminal", function(e, d) {
    termWindow = new BrowserWindow({
        width: 770,
        height: 500,
        minWidth: 770,
        minHeight: 510,
        frame: false,
        show: false,
        icon: "app/media/icons/terminal.png",
        title: "Terminal"
    });
    termWindow.loadURL('file://' + __dirname + '/app/term.html');
    termWindow.show();
    if (require("./settings.json").debug) termWindow.webContents.openDevTools();
    termWindow.addListener("resize", function() {
        e.sender.send("resized");
    });
    ipcMain.on("termRun", function(_e, _d) {
        setTimeout(() => {
            _e.sender.send("portOk", d);
        }, 900);
    })
});