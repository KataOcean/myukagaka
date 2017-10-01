exports = function(callback) {
    var rep = "";

    delete require.cache[require.resolve(__characterDir + '/js/common')];
    var common = require(__characterDir + "/js/common");

    common.getSerifs(__characterDir, "freeTalk", function(data) {
        var ary;
        if (arg) {
            ary = data[arg[0]];
        }
        if (!ary) {
            ary = data["適当返答"];
        }

        rep = common.getRandomSerif(ary);
        callback(rep);
    });

}