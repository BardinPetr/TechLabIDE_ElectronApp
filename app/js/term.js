const { ipcRenderer } = require('electron');

var nl = '\n';

function log(e) {
    console.log(e);
}

function update() {
    $("#c").height(window.innerHeight - 90);
    $("#div_o").height(window.innerHeight - 160);
}

$(function() {
    setTimeout(function() {
        update();
        ipcRenderer.send("tLoad");
        $("#c").addClass("disabled");
    }, 100);
});

ipcRenderer.on("resized", function() {
    update();
})

function appendOutput(text) {
    $("#output").append(text)
}

function appendOutputSend(text) {
    $("#output").append("> " + text + "\n")
}

function clearOutput() {
    $("#output").text("");
}

$("#min").click(function() {
    ipcRenderer.send('min');
});
$("#max").click(function() {
    ipcRenderer.send('max');
});
$("#close").click(function() {
    ipcRenderer.send('close');
});

/*
 * Port
 */

$("#send").click(function() {
    ipcRenderer.send("_send", $("#sendText").val() + nl);
    $("#sendText").val("");
})

ipcRenderer.on("_rec", function(e, d) {
    appendOutput(d);
});

ipcRenderer.on("portOk", function(e, d) {
    $("#c").removeClass("disabled");
})

function setNl(ch) {
    nl = ch;
}

function setBr(sp) {
    ipcRenderer.send("br_ch", sp);
}