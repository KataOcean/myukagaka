exports = function(callback) {

    var rep = "";

    delete require.cache[require.resolve(__characterDir + '/js/common')];
    var common = require(__characterDir + "/js/common");

    common.getSerifs(__characterDir, "general", (data) => {
        var ary = data[arg[0]];
        rep = common.getRandomSerif(ary);
        callback({ serif: rep });
    });

}