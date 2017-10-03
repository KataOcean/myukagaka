exports = function(arg, callback) {

    var rep = "";

    delete require.cache[require.resolve(__characterDir + '/module/common')];
    var common = require(__characterDir + "/module/common");

    var request = require("request");

    common.getConfig(__characterDir, function(config) {
        request.post('https://slack.com/api/chat.postMessage', {
            form: {
                token: config["SLACK_TOKEN"],
                channel: 'kata-memo',
                username: 'ちや',
                icon_url: 'https://i.gyazo.com/b99a66bb775a206ce96338f3410afe97.png',
                text: arg[0]
            }
        }, (error, response, body) => {
            if (error) console.log(error);
            rep = "うん、分かったわ。\nちゃーんと伝えてくるから、待っててね？";
            callback({ serif: rep });
        });
    });

}