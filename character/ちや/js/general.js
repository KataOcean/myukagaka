exports = function(callback) {

    var rep = "";
    fs.readFile(__characterDir + "/serifs/general.json", 'utf8', (err, data) => {
        if (err) return;
        var json = JSON.parse(data);
        var ary = json[arg[0]];
        rep = ary[Math.floor(Math.floor(Math.random() * ary.length))];
        callback(rep);
    });

}