exports = function(callback) {

    var rep = "";

    delete require.cache[require.resolve(__dirname + '/js/common')];
    var common = require(__dirname + "/js/common");

    common.getSerifs(__dirname, "general", (data) => {
        var json = JSON.parse(data);
        var ary = json[arg[0]];
        rep = common.getRandomSerif(ary);
        callback(rep);
    });

}