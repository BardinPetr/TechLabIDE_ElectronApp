/**
 * Created by Petr on 18.05.2017.
 */

const {ipcRenderer} = require('electron');

var closeEl = document.querySelector('#close');
closeEl.addEventListener('click', function () {
    ipcRenderer.send('close-main-window');
});