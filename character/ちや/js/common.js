var fs = require("fs");

exports.getRandomSerif = function getRandomSerif(arr) {
    return arr[Math.floor(Math.floor(Math.random() * arr.length))];
}

exports.getSerifs = function getSerifs(dir, name, callback) {
    fs.readFile(dir + "/serifs/" + name + ".json", 'utf8', function(err, serifs) {
        if (err) { console.log(err); return; }
        callback(serifs);
    });
}