// electronモジュールを読み込み
const electron = require('electron');
const Store = require('electron-store');
const { app } = electron;
const { BrowserWindow } = electron; //ウィンドウを表す[BrowserWindow]はelectronモジュールに含まれている
const ipcMain = electron.ipcMain;
const store = new Store({
    defaults: {
        character: {
            name: "ちや",
        },
        user: {
            nickname: "あなた",
        },
        mainWindow: {},
        balloonWindow: {},
        inputWindow: {},
    },
});

var user = store.get('user');

let Screen;
let size; // ディスプレイのサイズを取得する
// 新しいウィンドウ(Webページ)を生成
let mainWindow;
let inputWindow;
let balloonWindow;

var state = 100;
var Datastore = require('nedb');

var saying = false;
var isBegin = true;
var isEnd = false;

function createWindow() {
    var nativeImage = electron.nativeImage;
    var image = nativeImage.createFromPath('img/default.png');
    var imagesize = image.getSize();
    Screen = electron.screen;
    size = Screen.getPrimaryDisplay().size;

    var pos = store.get('mainWindow');
    var x = (pos.x) ? pos.x : size.width - imagesize.width,
        y = (pos.y) ? pos.y : size.height - imagesize.height - 40;

    // BrowserWindowインスタンスを生成
    mainWindow = new BrowserWindow({
        transparent: true,
        width: imagesize.width,
        height: imagesize.height,
        frame: false,
        resizable: false,
        alwaysOnTop: true,
        useContentSize: true,
        x: x,
        y: y
    });
    // index.htmlを表示
    mainWindow.loadURL(`file://${__dirname}/index.html`);
    // デバッグするためのDevToolsを表示
    //mainWindow.webContents.openDevTools();

    // ウィンドウを閉じたら参照を破棄
    mainWindow.on('closed', () => { // ()は　function ()と書いていい
        mainWindow = null;
        if (inputWindow) inputWindow.close();
        if (balloonWindow) balloonWindow.close();
    });

    CreateInputWindow();
    CreateBalloonWindow();

    balloonWindow.webContents.on('did-finish-load', () => {
        say("おはよう、" + user.nickname + "！\n今日も一日、頑張ろうね！");
    });

}
// アプリの準備が整ったらウィンドウを表示
app.on('ready', createWindow);
// 全てのウィンドウを閉じたらアプリを終了
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});

// 同期メッセージの受信
ipcMain.on('said', (event) => {
    console.log("pong");
    // レンダラープロセスへ返信
    event.sender.send('reply');
    saying = false;
    if (isBegin) {
        state = 0;
        isBegin = false;
    }
    if (isEnd) {
        mainWindow.close();
    }
    if (state == 2) state = 0;
});

exports.test = function() {
    inputWindow.focus();
    balloonWindow.focus();
    if (state == 0) {
        if (!inputWindow) CreateInputWindow();
        moveInputWindow();
        inputWindow.show();
        inputWindow.webContents.send("clicked");

        say("あ、" + user.nickname + "。おつかれさま。\nどうかした？");
        state = 1;
    }
};

exports.setMainWindowPosition = function(x, y) {
    mainWindow.setPosition(x, y);
    store.set({
        mainWindow: {
            x: x,
            y: y
        }
    });
    moveInputWindow();
}

exports.send = function(txt) {
    if (state == 1) {
        inputWindow.hide();
        var msg = getReply(txt);
        balloonWindow.show();
        balloonWindow.webContents.send('say', msg);
        state = 2;
    }
};

exports.store = store;

function CreateInputWindow() {
    var bounds = mainWindow.getBounds();
    inputWindow = new BrowserWindow({
        transparent: true,
        frame: false,
        width: 360,
        height: 64,
        resizable: false,
        alwaysOnTop: false,
        x: 0, //bounds.x - 240,
        y: 0, //bounds.y + bounds.height - 32,
        useContentSize: true,
        show: false,
        skipTaskbar: true
    });
    inputWindow.loadURL(`file://${__dirname}/input.html`)
    inputWindow.on('closed', () => { // ()は　function ()と書いていい
        state = 0;
        inputWindow = null;
    });

    ['move'].forEach(ev => {
        inputWindow.on(ev, () => {
            store.set("inputWindow", {
                x: inputWindow.getBounds().x,
                y: inputWindow.getBounds().y
            });
        })
    });
}

function moveInputWindow() {
    var bounds_MainWindow = mainWindow.getBounds();
    var bounds = inputWindow.getBounds();
    var pos = store.get('inputWindow')
    var x = (pos.x) ? pos.x : bounds_MainWindow.x - inputWindow.getBounds().width,
        y = (pos.y) ? pos.y : bounds_MainWindow.y + bounds_MainWindow.height - inputWindow.getBounds().height;

    inputWindow.setPosition(x, y);
}

function CreateBalloonWindow() {
    var bounds = mainWindow.getBounds();
    balloonWindow = new BrowserWindow({
        transparent: true,
        frame: false,
        width: 360,
        height: 96,
        resizable: false,
        alwaysOnTop: false,
        x: bounds.x - 360,
        y: bounds.y,
        useContentSize: true,
        show: false,
        skipTaskbar: true
    });
    balloonWindow.loadURL(`file://${__dirname}/balloon.html`)

    //balloonWindow.openDevTools(true);

    balloonWindow.on('closed', () => { // ()は　function ()と書いていい
        state = 0;
        balloonWindow = null;
    });

    ['move'].forEach(ev => {
        balloonWindow.on(ev, () => {
            store.set("balloonWindow", {
                x: balloonWindow.getBounds().x,
                y: balloonWindow.getBounds().y
            });
        })
    });
}

function moveBalloonWindow() {
    var bounds_MainWindow = mainWindow.getBounds();
    var bounds = balloonWindow.getBounds();
    var pos = store.get('balloonWindow')
    var x = (pos.x) ? pos.x : bounds_MainWindow.x - balloonWindow.getBounds().width,
        y = (pos.y) ? pos.y : bounds_MainWindow.y + bounds_MainWindow.height - balloonWindow.getBounds().height;

    balloonWindow.setPosition(x, y);
}

function getReply(text) {

    var textArr = text.split('');
    var currentText = "";
    var isTask = false;

    var type = "null";
    var obj;

    for (var i = 0; i < textArr.length; ++i) {

        console.log(currentText);
        if (textArr[i] == "を") {
            if (text.substr(i, 3) == "をした") {
                type = "reporttask";
                obj = { name: currentText };
                break;
            }
        } else if (textArr[i] == "お") {
            if (text.substr(i, 4) == "おやすみ") {
                type = "goodnight";
                break;
            }
        } else if (textArr[i] == "っ") {
            if (text.substr(i, 5) == "って呼んで") {
                type = "changenickname";
                obj = { oldname: user.nickname, name: currentText }
                break;
            }
        }

        currentText += textArr[i];

    }
    var rep = "";
    if (type == "goodnight") {
        isEnd = true;
        rep = "あらあら、もうお休みかしら。\n……うん、今日はすごく頑張ったね、" + user.nickname + "。\nじゃあ……おやすみなさい。";
    } else if (type == "reporttask") {
        rep = "ふふ、「" + obj.name + "」したのね。\nそうなんだぁ。えらい、えらい！";
    } else if (type == "changenickname") {
        store.set({
            user: {
                nickname: obj.name
            }
        });
        user = store.get('user');
        rep = "分かったわ。\nじゃあ、これからは「" + obj.oldname + "」じゃなくて、\n「" + obj.name + "」って呼んであげる。\nこれからもよろしく、「" + obj.name + "」。";
    } else {
        rep = "ふふっ、呼んでみただけ？";
    }

    return rep;
}

function say(msg) {
    if (!saying) {
        if (!balloonWindow) CreateBalloonWindow();
        moveBalloonWindow();
        balloonWindow.webContents.send('say', msg);
        saying = true;
    }
}