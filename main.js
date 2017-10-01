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
        mainWindow: {
            bounds: {
                width: 0,
                height: 0
            }
        },
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

    Screen = electron.screen;
    size = Screen.getPrimaryDisplay().size;

    var bounds = store.get('mainWindow.bounds');

    var x = (bounds.x) ? bounds.x : size.width,
        y = (bounds.y) ? bounds.y : size.height;

    // BrowserWindowインスタンスを生成
    mainWindow = new BrowserWindow({
        transparent: true,
        width: bounds.width,
        height: bounds.height,
        frame: false,
        resizable: false,
        alwaysOnTop: true,
        useContentSize: true,
        x: x,
        y: y,
        maximizable: false,
    });

    //index.htmlを表示
    mainWindow.loadURL(`file://${__dirname}/index.html`);
    // デバッグするためのDevToolsを表示
    // mainWindow.webContents.openDevTools();

    // ウィンドウを閉じたら参照を破棄
    mainWindow.on('closed', () => { // ()は　function ()と書いていい
        mainWindow = null;
        if (inputWindow) inputWindow.close();
        if (balloonWindow) balloonWindow.close();
    });

    mainWindow.on('focus', () => {
        call();
    });

    ['resize', 'move'].forEach(ev => {
        mainWindow.on(ev, () => {
            store.set("mainWindow", {
                bounds: mainWindow.getBounds(),
            });
        })
    });

    mainWindow.webContents.on('did-finish-load', () => {});

    CreateBalloonWindow();
    CreateInputWindow();
    balloonWindow.webContents.on('did-finish-load', () => {
        generateSerif("general", ["wakeup"]);
    });
    inputWindow.webContents.on('did-finish-load', () => {
        inputWindow.focus();
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
    // レンダラープロセスへ返信
    event.sender.send('reply');
    saying = false;
    if (isEnd) {
        mainWindow.close();
    }
});

ipcMain.on('resizeMainWindow', (event, arg) => {
    var bounds = store.get('mainWindow.bounds');
    var newbounds = {
        x: (bounds.x) ? bounds.x : size.width,
        y: (bounds.y) ? bounds.y : size.height,
        width: arg.width,
        height: arg.height
    }

    if (newbounds.x + newbounds.width > size.width) {
        newbounds.x = size.width - newbounds.width;
    }

    if (newbounds.y + newbounds.height > size.height) newbounds.y = size.height - newbounds.height;

    if (!store.get('balloonWindow.bounds').x) balloonWindow.setPosition(newbounds.x - balloonWindow.getBounds().width, newbounds.y);
    if (!store.get('inputWindow.bounds').x) inputWindow.setPosition(newbounds.x - inputWindow.getBounds().width, newbounds.y + newbounds.height - inputWindow.getBounds().height);

    mainWindow.setBounds(newbounds);

    store.set('mainWindow', {
        bounds: newbounds
    });

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

        if (!obj.func) obj.func = "freeTalk";

        generateSerif(obj.func, obj.arg);

    });

}

function generateSerif(func, arg) {
    var data = {
        user: user,
        arg: arg,
        startup: startup,
        store: store,
        __dirname: getCharacterPath(),

        inputWindow: inputWindow,
        balloonWindow: balloonWindow,

        console,
        require

    }

    loadReply(func, data, (func) => {
        func(function(rep, data) {
            console.log(rep);
            if (data) {
                if (data.isEnd) {
                    balloonWindow.setAlwaysOnTop(true);
                    inputWindow.hide();
                    isEnd = true;
                }
                if (data.user) user = data.user;
            }
            //ここでパースする
            rep = rep.replace(/<呼び名>/g, user.nickname);

            say(rep);
        });
    });
}

function call() {
    if (!saying) {
        generateSerif("general", ["call"]);
    }
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
    fs.readFile(getCharacterPath() + "/parse.txt", "utf8", function(err, data) {
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

function loadReply(func, sandbox, callback) {
    var path = getCharacterPath() + "/js/" + func + ".js";
    if (!fs.existsSync(path)) {
        return;
    }
    fs.readFile(path, function(err, data) {
        var script = vm.createScript(data, path);
        script.runInNewContext(sandbox);
        obj = sandbox.exports;
        callback(sandbox.exports);
    });
}

function getCharacterPath() {
    return "./character/" + store.get('character').name;
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
exports.getCharacterPath = getCharacterPath;