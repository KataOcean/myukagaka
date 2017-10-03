exports = function(arg, callback) {

    var rep = "";

    delete require.cache[require.resolve(__characterDir + '/module/common')];
    var common = require(__characterDir + "/module/common");
    callback({ serif: Date.now.getHours() + "時だよ！" });

}