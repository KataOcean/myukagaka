var main = require('electron').remote.require("./main");
const ipcRenderer = require('electron').ipcRenderer;
$(function() {
    loadCharacter(main.getCharacterPath() + "/html/default.html");
});

function loadCharacter(path) {
    $('#character').attr('src', path);
    $('#character').on('load', function() {
        var width = $(this).contents().find('body').width();
        var height = $(this).contents().find('body').height();
        $(this).css({ width: width, height: height });
        ipcRenderer.send('resizeMainWindow', {
            width: width,
            height: height
        });
    });
}