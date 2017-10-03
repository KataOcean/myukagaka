exports = function(arg, callback) {

    var rep = "";

    delete require.cache[require.resolve(__characterDir + '/module/common')];
    var common = require(__characterDir + "/module/common");

    var request = require("request");
    rep = "うん、分かったわ。\nちゃーんと伝えてくるから、待っててね？";
    callback({ serif: rep });
    common.postSlack(__characterDir, "kata-memo", arg[0]);
}