// electronモジュールを読み込み
const electron = require('electron');
const Datastore = require('nedb');
const Store = require('electron-store');
const { app } = electron;
const { BrowserWindow } = electron; //ウィンドウを表す[BrowserWindow]はelectronモジュールに含まれている
const ipcMain = electron.ipcMain;
const date = new Date();
const startup = new Date(date.getTime());
const vm = require('vm');

var fs = require('fs');

var db = {};
db.project = new Datastore({
    filename: './db/project.db',
    autoload: true,
    timestampData: true
});
db.progress = new Datastore({
    filename: './db/progress.db',
    autoload: true,
    timestampData: true
});

const store = new Store({
    defaults: {
        character: {
            name: "ちや",
        },
        user: {
            nickname: "あなた",
        },
        mainWindow: {},
        balloonWindow: {
            bounds: {
                width: 360,
                height: 96
            },
        },
        inputWindow: {
            bounds: {
                width: 360,
                height: 64
            }

        },
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

var saying = false;
var canSaying = true;
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

    mainWindow.on('focus', () => {
        call();
    });

    mainWindow.webContents.on('did-finish-load', () => {});
    CreateBalloonWindow();
    CreateInputWindow();

    inputWindow.webContents.on('did-finish-load', () => {
        inputWindow.focus();
    });
    balloonWindow.webContents.on('did-finish-load', () => {
        say("おはよう、" + user.nickname + "！\n今日も一日、頑張ろうね！");
    });

}
// アプリの準備が整ったらウィンドウを表示
app.on('ready', () => {
    readData(createWindow);
});
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
    console.log("said");
    // レンダラープロセスへ返信
    event.sender.send('reply');
    saying = false;
    if (isEnd) {
        mainWindow.close();
    }
});

function CreateInputWindow() {
    var mb = mainWindow.getBounds();
    var bounds = store.get('inputWindow.bounds');
    inputWindow = new BrowserWindow({
        transparent: true,
        frame: false,
        width: bounds.width,
        height: bounds.height,
        resizable: true,
        alwaysOnTop: true,
        x: bounds.x ? bounds.x : mb.x - bounds.width,
        y: bounds.y ? bounds.y : mb.y + mb.height - bounds.height,
        useContentSize: true,
        show: true,
        skipTaskbar: true
    });
    inputWindow.loadURL(`file://${__dirname}/input.html`)
    inputWindow.on('closed', () => { // ()は　function ()と書いていい
        state = 0;
        inputWindow = null;
    });
    //inputWindow.openDevTools(true);
    ['resize', 'move'].forEach(ev => {
        inputWindow.on(ev, () => {
            store.set("inputWindow", {
                bounds: inputWindow.getBounds(),
            });
        })
    });
}

function CreateBalloonWindow() {
    var mb = mainWindow.getBounds();
    var bounds = store.get('balloonWindow.bounds');
    balloonWindow = new BrowserWindow({
        transparent: true,
        frame: false,
        width: bounds.width,
        height: bounds.height,
        resizable: true,
        alwaysOnTop: false,
        x: bounds.x ? bounds.x : mb.x - bounds.width,
        y: bounds.y ? bounds.y : mb.y,
        useContentSize: true,
        show: true,
        skipTaskbar: true
    });
    balloonWindow.loadURL(`file://${__dirname}/balloon.html`)

    //balloonWindow.openDevTools(true);

    balloonWindow.on('closed', () => { // ()は　function ()と書いていい
        state = 0;
        balloonWindow = null;
    });

    ['resize', 'move'].forEach(ev => {
        balloonWindow.on(ev, () => {
            store.set("balloonWindow", {
                bounds: balloonWindow.getBounds(),
            });
        })
    });
}

function reply(text) {

    replying = true;

    readData((rules) => {

        var obj = {};
        var arg;
        for (let i in rules) {
            var reg;
            var rule = rules[i];
            var regexp = new RegExp(rule.reg);
            if (reg = text.match(regexp)) {
                obj = {
                    func: rule.func,
                    arg: rule.arg.map(function(val) {
                        return reg[val];
                    }),
                }
                break;
            }
        }

        var rep = "";
        var data = {
            db: db,
            user: user,
            arg: obj.arg,
            startup: startup,
            store: store
        }

        if (obj.func) {
            loadReply(obj.func, (func) => {
                func(data, function(rep, data) {
                    if (data) {
                        if (data.isEnd) isEnd = true;
                        if (data.user) user = data.user;
                    }
                    //ここでパースする
                    say(rep);
                });
            });
        } else {
            rep = "ふふっ、呼んでみただけ？";
            say(rep);
        }

    });

}

function call() {
    if (!saying) say("あら、" + user.nickname + "。おつかれさま。\nどうかした？");
    waitInput();
}

function say(msg) {
    if (canSaying) {
        if (!balloonWindow) CreateBalloonWindow();
        balloonWindow.focus();
        balloonWindow.webContents.send('say', msg);
        saying = true;
    }
}

function waitInput() {
    if (!inputWindow) CreateInputWindow();
    inputWindow.focus();
}

function readData(callback) {
    fs.readFile("./data/default/parse.txt", "utf8", function(err, data) {
        if (err) return console.log(err);
        var buf = data.split('\r\n');
        var parseRules = [];
        for (let i in buf) {
            var rule = buf[i].trim().split(' ');
            parseRules.push({
                reg: rule[0].replace(new RegExp('/', 'g'), ''),
                func: rule[1],
                arg: rule.slice(2),
            });
        }

        callback(parseRules);
    });

}

function loadReply(rep, callback) {
    var path = "./data/default/scripts/" + rep + ".js";
    if (!fs.existsSync(path)) {
        return;
    }
    var sandbox = {};
    fs.readFile(path, function(err, data) {
        var script = vm.createScript(data, path);
        script.runInNewContext(sandbox);
        obj = sandbox.exports;
        callback(sandbox.exports);
    });
    //    fs.watchFile(file, load);
}


exports.setMainWindowPosition = function(x, y) {
    mainWindow.setPosition(x, y);
    store.set({
        mainWindow: {
            x: x,
            y: y
        }
    });
}

exports.send = function(txt) {
    reply(txt);
    inputWindow.focus();
};

exports.store = store;
exports.db = db;