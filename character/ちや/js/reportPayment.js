const Datastore = require('nedb');
var db = {};
db.payment = new Datastore({
    filename: __characterDir + '/db/payment.db',
    autoload: true,
    timestampData: true
});

exports = function(callback) {

    var rep = "";

    if (arg.length == 1) {
        var money = arg[0];
        rep = "ふんふん、" + money + "円、[w 300]使ったのね。\n分かったわ。ちゃーんと、記録しておくわね？";
        db.payment.insert({
            money: money,
        });
        callback(rep);

    } else {
        var payment = { money: arg[0], situation: arg[1] };
        rep = "へぇ～、" + payment.situation + "で\n" + payment.money + "円、[w 300]使ったのね。\nお金、まだ大丈夫？困ったら、いつでも言ってね？";
        db.payment.insert({
            money: payment.money,
            situation: payment.situation
        });
        callback(rep);
    }

}