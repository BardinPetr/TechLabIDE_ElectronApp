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

var dbUrl = "mongodb://bardin.petr.fvds.ru:27017/tlabClients";

const {
    ipcRenderer
} = require('electron');
var serialport = require('serialport'),
    mongo = require("mongodb").MongoClient;

var settings;

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
    sendMetadata();
    ipcRenderer.send('upload', _get_code());
});
$("#compile").click(function() {
    sendMetadata();
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


$("#term").click(function() {
    ipcRenderer.send('terminal', port);
});


$("#set").click(function() {
    ipcRenderer.send('set');
});


$(function() {
    setTimeout(function() {
        ipcRenderer.send('ready');
    }, 200);
    setInterval(function() {
        rb_update();
    }, 1000);
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

ipcRenderer.on('rb_update()', function(e, arr) {
    rb_update();
});

/*
 * Port
 */

function setPort(id) {
    port = ports[id];
    ipcRenderer.send('portSelected', port);
}

ipcRenderer.on('boardsRefresh', function(e, arr) {
    boards = arr;
    if (board == null) board = arr[0];

    var ul = $("#boardsList");
    ul.html("");

    var i = 0;
    arr.forEach(function(el) {
        ul.append('<li><a href="#" onclick="setBoard(' + i.toString() + ')">' + el.name + '</a></li>');
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

ipcRenderer.on('noport', function(e, arr) {
    $("#popup_noport").show();
    $("#popup_noport").fadeOut(5000);
});

ipcRenderer.on('cstart', function(e, arr) {
    c_start.show();
    c_start.fadeOut(3000);
});

ipcRenderer.on('run', function(e, arr) {
    settings = arr;
    sp_update();
    setTheme(arr.theme);
    resetWS();
    setInterval(() => {
        sp_update()
    }, 1000);
});

function sp_update() {
    serialport.list((err, arr) => {
        ports = [];
        if (settings.disableSoftwarePorts) {
            arr.forEach(function(el) {
                if (el.vendorId == undefined || el.productId == undefined) {} else {
                    ports.push(el);
                }
            }, this);
        } else {
            ports = arr;
        }

        if (port == null) port = ports[0];
        ipcRenderer.send("portSelected", port);

        var ul = $("#portList");
        ul.html("");

        var i = 0;
        ports.forEach(function(el) {
            ul.append('<li><a href="#" onclick="setPort(' + i.toString() + ')">' + el.comName + '</a></li>');
            i++;
        }, this);
    });
}

function setTheme(d) {
    $(".hljs").css("border", "none");
    if (!d) {
        roboblocks_init([
            "",
            "#AB0123",
            "#109C5F",
            "#129A12",
            "#5F109C",
            "#9A1081",
            "#10979A",
            "#10979A",
            "#10319A",
            "#719A10",
            "#9A9A10",
            "#0A3C4D",
            "#89789A"
        ]);
        $("head").html($("head").html() + '\n<link rel="stylesheet" type="text/css" href="lib/highlight/styles/monokai-sublime.css">');
        $("body").css("background-color", "#000");
        $("#code").css("background-color", "#23241f");
        $(".blocklyScrollbarBackground").css("fill", "#23241f");
        $(".blocklyToolboxDiv").css("background-color", "#572b38");
        $(".blocklySvg").css("background-color", "#23241f");
        $(".blocklySvg").css("border", "none");
        $("pre").css("border", "none");
        $(".blocklyFlyoutBackground").css("fill", "#314");
        $(".blocklyScrollbarBackground").css("visibility", "hidden");
        $(".blocklyScrollbarKnob").css("fill", "#7e2442");
        $(".blocklyScrollbarKnob").css("fill", "#7e2442");
        var _r = $("rect").filter($("div._container div#wrap div#blockly svg.blocklySvg g rect"));
        _r.each(function(i) {
            if (i == 2) $(this).css("fill", "#23241f");
        });
    } else {
        $("head").html($("head").html() + '\n<link rel="stylesheet" type="text/css" href="lib/highlight/styles/default.css">');
        roboblocks_init(null);
    }
}


// Accelerators
ipcRenderer.on('ctrl+s', function(e, arr) {
    ipcRenderer.send('save', get_xml());
});
ipcRenderer.on('ctrl+n', function(e, arr) {
    resetWS();
    ipcRenderer.send('new');
});
ipcRenderer.on('ctrl+o', function(e, arr) {
    ipcRenderer.send('open');
});
ipcRenderer.on('ctrl+u', function(e, arr) {
    ipcRenderer.send('upload', _get_code());
});
ipcRenderer.on('ctrl+t', function(e, arr) {
    ipcRenderer.send('compile', _get_code());
    c_start.show();
    c_start.fadeOut(3000);
});

function sendMetadata() {
    $.getJSON('http://freegeoip.net/json/?callback=?', function(geoip) {
        window.navigator.geolocation.getCurrentPosition(function(position) {
                var geocoderurl = "https://geocode-maps.yandex.ru/1.x/?geocode=" +
                    position.coords.latitude.toString() + ',' + position.coords.longitude.toString() +
                    "&sco=latlong&format=json&results=1&kind=locality&key=ABPooVcBAAAAc6b3cAIANcMVy0HRZlyZzuls1_8YcazIPPEAAAAAAAAAAABlP3QTO0YXZN2DO1a0BZjpVLmHtQ==";
                $.getJSON(geocoderurl, function(geocoderdata) {
                    Date.prototype.getUnixTime = function() { return this.getTime() / 1000 | 0 };
                    var res = {
                        userdata: true,
                        time: (new Date()).getUnixTime(),
                        ip: geoip.ip,
                        city: geocoderdata.response.GeoObjectCollection.featureMember[0].GeoObject.name,
                        geo: [position.coords.latitude, position.coords.longitude],
                        platform: process.platform,
                        tlabType: 0,
                        board: board.name
                    };
                    mongo.connect(dbUrl, function(err, db) {
                        if (err) log(err);
                        else {
                            var col = db.collection("main");
                            col.insertOne(res, (e, d) => {
                                if (e) log(e);
                                else log(d);
                                db.close();
                            });
                        }
                    });
                });
            },
            function(err) {
                log(err);
            }, {
                enableHighAccuracy: true,
                timeout: 6000,
                maximumAge: 60
            });
    });
}