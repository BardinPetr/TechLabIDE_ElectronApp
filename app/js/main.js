/**
 * Created by Petr on 18.05.2017.
 */
var ports = [];
var port = null;
var boards = [];
var board = null;

var c_fail = $("#popup_fail_c");
var c_ok = $("#popup_ok_c");
var u_ok = $("#popup_ok_u");
var u_fail = $("#popup_fail_u");
var c_start = $("#popup_started");

const { ipcRenderer } = require('electron');

function log(e) {
    console.log(e);
}

$("#close").click(function() {
    ipcRenderer.send('close');
});
$("#min").click(function() {
    ipcRenderer.send('min');
});


$("#upload").click(function() {
    ipcRenderer.send('upload', _get_code());
    c_start.show();
    c_start.fadeOut(3000);
});
$("#compile").click(function() {
    ipcRenderer.send('compile', _get_code());
    c_start.show();
    c_start.fadeOut(3000);
});


$("#new").click(function() {
    resetWS();
    ipcRenderer.send('new');
});


$("#open").click(function() {
    ipcRenderer.send('open');
});
ipcRenderer.on('openOk', function(e, file) {
    set_xml(file);
});


$("#save").click(function() {
    ipcRenderer.send('save', get_xml());
});
$("#saveB").click(function() {
    ipcRenderer.send('saveB', get_xml());
});
$("#saveC").click(function() {
    ipcRenderer.send('saveC', _get_code());
});


$(function() {
    setTimeout(function() {
        roboblocks_init();
        resetWS();

        updateBoards();

        ipcRenderer.send('ready');
    }, 200);
});

function resetWS() {
    resetWorkspace();
    var xml2 = Blockly.Xml.textToDom("<xml xmlns='http://www.w3.org/1999/xhtml'><block type='controls_setupLoop' deletable='false'></block></xml>");
    Blockly.Xml.domToWorkspace(Blockly.getMainWorkspace(), xml2);
}


function setBoard(id) {
    board = boards[id];
    ipcRenderer.send('boardSelected', board);
}

function updateBoards() {
    var _boards = [{
        name: "uno",
        aname: "arduino:avr:uno"
    }, {
        name: "nano",
        aname: "arduino:avr:nano:cpu=atmega328"
    }, {
        name: "mega",
        aname: "arduino:avr:uno"
    }];

    boards = _boards;
    if (board == null) board = _boards[0];

    var ul = $("#boardsList");
    ul.html("");

    var i = 0;
    _boards.forEach(function(el) {
        ul.append('<li><a href="#" onclick="setBoard(' + i.toString() + ')">' + el.name + '</a></li>');
        i++;
    }, this);
}

/*
 * Port
 */

function setPort(id) {
    port = ports[id];
    ipcRenderer.send('portSelected', port);
}

ipcRenderer.on('portsRefresh', function(e, arr) {
    ports = arr;
    if (port == null) port = arr[0];

    var ul = $("#portList");
    ul.html("");

    var i = 0;
    arr.forEach(function(el) {
        ul.append('<li><a href="#" onclick="setPort(' + i.toString() + ')">' + el.comName + '</a></li>');
        i++;
    }, this);
});


/*
 * Upload and compile
 */

ipcRenderer.on('c', function(e, arr) {
    (arr ? c_ok : c_fail).show();
    (arr ? c_ok : c_fail).fadeOut(7000);
});

ipcRenderer.on('u', function(e, arr) {
    (arr ? u_ok : u_fail).show();
    (arr ? u_ok : u_fail).fadeOut(7000);
});