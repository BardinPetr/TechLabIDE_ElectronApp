/**
 * Created by Petr on 18.05.2017.
 */

const { ipcRenderer } = require('electron');

$("#close").click(function() {
    ipcRenderer.send('close');
});
$("#min").click(function() {
    ipcRenderer.send('min');
});


$("#upload").click(function() {
    ipcRenderer.send('upload');
});
$("#compile").click(function() {
    ipcRenderer.send('compile');
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
    }, 200);
});

function resetWS() {
    resetWorkspace();
    var xml2 = Blockly.Xml.textToDom("<xml xmlns='http://www.w3.org/1999/xhtml'><block type='controls_setupLoop' deletable='false'></block></xml>");
    Blockly.Xml.domToWorkspace(Blockly.getMainWorkspace(), xml2);
}