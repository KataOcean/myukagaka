exports = function(callback) {
    var rep = "";


    delete require.cache[require.resolve(__dirname + '/js/common')];
    var common = require(__dirname + "/js/common");

    common.getSerifs(__dirname, "freeTalk", function(data) {
        var json = JSON.parse(data);
        var ary;
        if (arg) {
            ary = json[arg[0]];
        }
        if (!ary) {
            ary = json["適当返答"];
        }

        rep = common.getRandomSerif(ary);
        callback(rep);
    });

}