var fs = require("fs");

exports.getRandomSerif = function getRandomSerif(arr) {
    return arr[Math.floor(Math.floor(Math.random() * arr.length))];
}

exports.getSerifs = function getSerifs(__characterDir, name, callback) {
    fs.readFile(__characterDir + "/serifs/" + name + ".json", 'utf8', function(err, serifs) {
        if (err) { console.log(err); return; }
        callback(JSON.parse(serifs));
    });
}

exports.getConfig = function getConfig(__characterDir, callback) {
    fs.readFile(__characterDir + "/config/config.json", 'utf8', function(err, config) {
        if (err) { console.log(err); return; }
        callback(JSON.parse(config));
    });
}