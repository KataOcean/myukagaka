const main = require('electron').remote.require("./main");
const ipcRenderer = require('electron').ipcRenderer;

$(function() {
    $('#userInput').keypress(function(e) {
        if (e.which == 13) {
            main.send($('#userInput').val());
        }
    });
    $('#userInput').attr('readonly', true);
});
ipcRenderer.on('clicked', () => {
    $('#userInput').val('');
    $('#userInput').attr('readonly', false);
    $('#userInput').focus();
});