const Datastore = require('nedb');
var db = {};

exports = function(arg, callback) {

    var rep = "";

    if (!db.payment) {
        db.payment = new Datastore({
            filename: __characterDir + '/db/payment.db',
            autoload: true,
            timestampData: true
        });
    }

    if (arg.length == 1) {
        var money = arg[0];
        rep = "ふんふん、" + money + "円、[w 300]使ったのね。\n分かったわ。ちゃーんと、記録しておくわね？";
        db.payment.insert({
            money: money,
        });
        callback({ serif: rep });

    } else {
        var payment = { money: arg[0], situation: arg[1] };
        rep = "へぇ～、" + payment.situation + "で\n" + payment.money + "円、[w 300]使ったのね。\nお金、まだ大丈夫？\n[w 300]あんまり使いすぎたらダメだからね？";
        db.payment.insert({
            money: payment.money,
            situation: payment.situation
        });
        callback({ serif: rep });
    }

}