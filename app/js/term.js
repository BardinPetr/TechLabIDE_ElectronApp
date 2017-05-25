const { ipcRenderer } = require('electron');
const SerialPort = require('serialport');

var nl = '\n';
var br = 9600;
var sp = null;
var port = null;

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
        $("#c").addClass("disabled");
        ipcRenderer.send("termRun");
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
    ipcRenderer.send('Tmin');
});
$("#max").click(function() {
    ipcRenderer.send('Tmax');
});
$("#close").click(function() {
    ipcRenderer.send('Tclose');
});

/*
 * Port
 */

ipcRenderer.on("TcloseNow", function() {
    try {
        sp.close();
        sp = null;
    } catch (ex) {

    }
})


$("#send").click(function() {
    try {
        sp.write(str2ab($("#sendText").val() + nl));
        $("#sendText").val("");
    } catch (ex) {
        log(ex)
    }
})

ipcRenderer.on("portOk", function(e, d) {
    port = d;
    openPort();
})

function setNl(ch) {
    nl = ch;
}

function setBr(_br) {
    br = _br;
    try {
        sp.close(() => { openPort(); });
    } catch (ex) {
        log(ex);
    }
}

function openPort() {
    try {
        sp = new SerialPort(port.comName, {
            baudRate: br
        });
        sp.on('error', function(err) {
            log('Error: ' + err.message);
        });
        sp.on('open', function() {
            log("port opened");
            $("#c").removeClass("disabled");
        });
        sp.on('data', function(data) {
            data = ab2str(data);
            appendOutput(data);
        });
    } catch (ex) {
        log(ex);
    }
}

var ab2str = function(buf) {
    try {
        var bufView = new Uint8Array(buf);
        var encodedString = String.fromCharCode.apply(null, bufView);
        return decodeURIComponent(escape(encodedString));
    } catch (ex) {
        log(ex);
        return "!!!Неправильная скорость!!!\n"
    }
};

var str2ab = function(str) {
    var encodedString = str;
    var bytes = new Uint8Array(encodedString.length);
    for (var i = 0; i < encodedString.length; ++i) {
        bytes[i] = encodedString.charCodeAt(i);
    }
    return bytes.buffer;
};