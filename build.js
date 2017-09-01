var packager = require('electron-packager');  
var config = require('./package.json');

packager({  
  dir: './',          // 対象
  out: './build',      // 出力先
  name: "katagaka",  // 名前
  platform: 'win32', // or win32
  arch: 'x64',        // 64bit
  version: '1.4.13',  // electron のバージョン
 
  'app-bundle-id': 'jp.phi.electron-app', // ドメイン
  'app-version': "0.0.1",          // バージョン

  overwrite: true,  // 上書き
  asar: true,       // アーカイブ
  prune: true,
  // 無視ファイル
  ignore: "node_modules/(electron-packager|electron-prebuilt|\.bin)|release\.js",
}, function done (err, appPath) {
  if(err) {
    throw new Error(err);
  }
  console.log('Done!!');
});