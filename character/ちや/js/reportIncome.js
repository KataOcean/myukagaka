const Datastore = require('nedb');
var db = {};
db.income = new Datastore({
    filename: __characterDir + '/db/income.db',
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
        callback({ serif: rep });

    } else {
        var income = { money: arg[0], situation: arg[1] };
        rep = "ふむふむ、" + payment.situation + "から\n" + payment.money + "円、[w 300]入ってきたのね。\nふふ、よく頑張ったわねぇ。私も嬉しいわ。";
        db.income.insert({
            money: payment.money,
            situation: payment.situation
        });
        callback({ serif: rep });
    }

}