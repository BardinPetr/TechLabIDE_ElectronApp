const { ipcRenderer } = require('electron');
var settings = {};

var srvI = $("#url");
var portI = $("#port");
var ombI = $("#omb");
var dsspI = $("#dssp");
var dbgI = $("#debug");

function log(e) {
    console.log(e);
}

$(function() {
    ipcRenderer.send("setRun");
});

$("#close").click(function() {
    ipcRenderer.send('Sclose');
});

ipcRenderer.on("setOk", function(e, d) {
    settings = d;
    srvI.val(settings.srv.url);
    portI.val(settings.srv.port);
    ombI.prop('checked', settings.onlyMainBoards);
    dsspI.prop('checked', settings.disableSoftwarePorts);
    dbgI.prop('checked', settings.debug);
});

$("#sub").click(function() {
    settings.srv.url = srvI.val();
    settings.srv.port = parseInt(portI.val());
    settings.onlyMainBoards = ombI.prop('checked');
    settings.disableSoftwarePorts = dsspI.prop('checked');
    settings.debug = dbgI.prop('checked');
    ipcRenderer.send("updateSettings", settings);
});