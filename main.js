// electronモジュールを読み込み
const electron = require('electron');
const {app} = electron;
const {BrowserWindow} = electron; //ウィンドウを表す[BrowserWindow]はelectronモジュールに含まれている

let Screen;
let size;// ディスプレイのサイズを取得する
// 新しいウィンドウ(Webページ)を生成
let mainWindow;
let subwindow;

var state = 0;

function createWindow() {
  var nativeImage = electron.nativeImage;
  var image = nativeImage.createFromPath('img/default.png');
  var imagesize = image.getSize();

  Screen = electron.screen;
  size = Screen.getPrimaryDisplay().size;
  // BrowserWindowインスタンスを生成
  mainWindow = new BrowserWindow({
     transparent: true , 
     width: imagesize.width,
     height: imagesize.height, 
     frame: false,
     resizable: false,
     alwaysOnTop:true,
     useContentSize: true,
     x:size.width - imagesize.width,
     y:size.height - imagesize.height - 40
    });
  // index.htmlを表示
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  // デバッグするためのDevToolsを表示
  //mainWindow.webContents.openDevTools();
  // ウィンドウを閉じたら参照を破棄
  mainWindow.on('closed', () => {   // ()は　function ()と書いていい
    mainWindow = null;
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

exports.test = function () {
  if ( state == 0 ){
    subwindow = new BrowserWindow({
      transparent: true, 
      frame: false,
      width: 320,
      height: 64,
      resizable: false,
      alwaysOnTop:true,
      x: size.width - 300 - 320,
      y: size.height - 96 - 40
    });
    subwindow.loadURL(`file://${__dirname}/input.html`)
    subwindow.on('closed', () => {   // ()は　function ()と書いていい
      state = 0;
      subwindow = null;
    });
    state = 1;
  }
};