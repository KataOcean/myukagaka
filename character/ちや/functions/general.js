exports = function(arg, callback) {

    var rep = "";

    delete require.cache[require.resolve(__characterDir + '/module/common')];
    var common = require(__characterDir + "/module/common");

    common.getSerifs(__characterDir, "general", (data) => {
        var ary = data[arg[0]];
        rep = common.getRandomSerif(ary);
        callback({ serif: rep, dontQue: true });
    });

}