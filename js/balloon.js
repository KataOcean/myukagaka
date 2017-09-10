const main = require('electron').remote.require("./main");
const remote = require('electron').remote;
const ipcRenderer = require('electron').ipcRenderer;
const store = main.store;
const user = store.get('user');

var hide_id;
$(function() {

});

ipcRenderer.on('say', (event, msg) => {
    var window = remote.getCurrentWindow();
    if (hide_id !== null) clearTimeout(hide_id);
    delayText(
        $("#display"),
        msg,
        said
    );
});

var said = function() {
    hide_id = setTimeout(
        function() {
            //$("#display").text('');
            ipcRenderer.send('said');
        },
        1600
    );
}

ipcRenderer.on('reply', () => {
    //    var window = remote.getCurrentWindow();
    //    window.blur();
});