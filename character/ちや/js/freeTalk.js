var fs = require("fs");

exports = function(callback) {

    console.log("呼んだかしら？");
    var rep = "";
    fs.readFile(__characterDir + "/serifs/freeTalk.json", 'utf8', (err, data) => {
        if (err) return;
        var json = JSON.parse(data);
        var ary;
        if (arg) {
            ary = json[arg[0]];
        }
        if (!ary) {
            ary = json["適当返答"];
        }

        rep = ary[Math.floor(Math.floor(Math.random() * ary.length))];
        callback(rep);
    });

}