var fs = require("fs");
var request = require("request");

exports.getRandomSerif = function(arr) {
    if (!arr) return;
    return arr[Math.floor(Math.floor(Math.random() * arr.length))];
}

exports.getSerifs = function(__characterDir, name, callback) {
    fs.readFile(__characterDir + "/serifs/" + name + ".json", 'utf8', function(err, serifs) {
        if (err) { console.log(err); return; }
        callback(JSON.parse(serifs));
    });
}

exports.getConfig = getConfig;

exports.postSlack = function(__characterDir, channel, message) {
    getConfig(__characterDir, function(config) {
        rep = "うん、分かったわ。\nちゃーんと伝えてくるから、待っててね？";
        request.post('https://slack.com/api/chat.postMessage', {
            form: {
                token: config["SLACK_TOKEN"],
                channel: 'kata-memo',
                username: 'ちや',
                icon_url: 'https://i.gyazo.com/b99a66bb775a206ce96338f3410afe97.png',
                text: message
            }
        }, (error, response, body) => {
            if (error) console.log(error);
        });
    });
}

function getConfig(__characterDir, callback) {
    fs.readFile(__characterDir + "/config/config.json", 'utf8', function(err, config) {
        if (err) { console.log(err); return; }
        callback(JSON.parse(config));
    });
}