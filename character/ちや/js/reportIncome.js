const Datastore = require('nedb');
var db = {};
db.income = new Datastore({
    filename: './db/income.db',
    autoload: true,
    timestampData: true
});

exports = function(callback) {

    var rep = "";

    if (arg.length == 1) {
        var money = arg[0];
        rep = "あらあら、" + money + "円、[w 300]入ってきたのね。\nふふ、頑張ってきたご褒美……かしら？";
        db.income.insert({
            money: money,
        });
        callback(rep);

    } else {
        var income = { money: arg[0], situation: arg[1] };
        rep = "へぇ～、" + payment.situation + "で\n" + payment.money + "円、[w 300]使ったのね。\nお金、まだ大丈夫？\n困ったら言ってね？";
        db.income.insert({
            money: payment.money,
            situation: payment.situation
        });
        callback(rep);
    }

}