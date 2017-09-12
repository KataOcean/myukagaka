var main = require('electron').remote.require("./main");
var state = {
    mouseX: 0,
    mouseY: 0,
    down: false,
    dragging: false,
};
const ipcRenderer = require('electron').ipcRenderer;
$(function() {
    var img = $('#character');
    img.bind('load', loadedImage);
    // $(window).resize(function() {
    //     var size = {
    //         width: $('#character').width(),
    //         height: $('#character').height()
    //     };
    //     ipcRenderer.send('resizeMainWindow', size);
    // })

    $('#character').attr('src', main.getCharacterPath() + "img/default.png");
});

function loadedImage() {
    var buf = new Image();
    buf.src = $(this).attr('src');
    ipcRenderer.send('resizeMainWindow', {
        width: buf.width,
        height: buf.height
    });
    var img = AlphaPicker($("#character")[0]);
    img.mousedown(function(e) {
        if (e.alpha) {
            state.down = true;
            state.mouseX = e.originalEvent.clientX;
            state.mouseY = e.originalEvent.clientY;
        }
    });
    img.mousemove(function(e) {
        if (state.down) {
            state.dragging = true;
            main.setMainWindowPosition(
                e.originalEvent.screenX - state.mouseX,
                e.originalEvent.screenY - state.mouseY
            );
        }
    });
    img.mouseup(function(e) {
        state.down = false;
        state.dragging = false;
    });
    img.mouseout(function(e) {
        state.down = false;
        state.dragging = false;
    });
}