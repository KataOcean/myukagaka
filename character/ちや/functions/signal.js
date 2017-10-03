var date = new Date();

exports = function(arg, callback) {

    var rep = "";

    delete require.cache[require.resolve(__characterDir + '/module/common')];
    var common = require(__characterDir + "/module/common");
    callback({ serif: date.getHours() + "時だよ！" });

}