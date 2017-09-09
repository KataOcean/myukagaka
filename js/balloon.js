const main = require('electron').remote.require("./main");
const remote = require('electron').remote;
const ipcRenderer = require('electron').ipcRenderer;
const store = main.store;
const user = store.get('user');

var hide_id;
$(function() {});

ipcRenderer.on('say', (event, msg) => {
    var window = remote.getCurrentWindow();
    if (hide_id !== null) clearTimeout(hide_id);
    window.show();
    delayText(
        $("#display"),
        msg,
        60,
        hideWindow
    );
});

//"ふふ、今日はよく頑張ったね、" + user.nickname + "。\nおやすみなさい。",
//"あ、" + user.nickname + "。おつかれさま。\nどうかした？",
//"ふふ、「" + task.Name + "」のね。\nそうなんだぁ。えらい、えらい！",

var hideWindow = function() {
    hide_id = setTimeout(
        function() {
            //$("#display").text('');
            ipcRenderer.send('said');
        },
        1600
    );
}

ipcRenderer.on('reply', () => {
    var window = remote.getCurrentWindow();
    window.blur();
});