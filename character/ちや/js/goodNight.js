const Datastore = require('nedb');
var db = {};
db.project = new Datastore({
    filename: './db/project.db',
    autoload: true,
    timestampData: true
});
db.progress = new Datastore({
    filename: './db/progress.db',
    autoload: true,
    timestampData: true
});
db.payment = new Datastore({
    filename: './db/payment.db',
    autoload: true,
    timestampData: true
});
db.income = new Datastore({
    filename: './db/income.db',
    autoload: true,
    timestampData: true
});
var common = require(__dirname + "/js/common");

exports = function(callback) {

    var rep = "";

    var projects;
    var progs;

    var sumPayment = 0;
    var sumIncome = 0;

    delete require.cache[require.resolve(__dirname + '/js/common')];
    common = require(__dirname + "/js/common");

    common.getSerifs(__dirname, "goodNight", function(serifs) {
        var before = serifs["before"];
        var after = serifs["after"];
        getProgress(function(_projects, _progs) {
            projects = _projects;
            progs = _progs;
            getPayment(function(sum) {
                sumPayment = sum;
                getIncome(function(sum) {
                    sumIncome = sum;
                    rep = common.getRandomSerif(before);
                    rep += generateReply(projects, progs, sumPayment, sumIncome);
                    rep += common.getRandomSerif(after);
                    callback(rep, { isEnd: true });
                });
            });
        });
    });

};

function getProgress(callback) {
    db.project.find().exec(function(err, projects) {
        db.progress.find({ createdAt: { $gte: startup } }, { content: 1, projectID: 1 }, function(err, progs) {
            callback(projects, progs);
        });
    });
}

function getPayment(callback) {
    var sum = 0;

    db.payment.find({ createdAt: { $gte: startup } }, { money: 1, }, function(err, pays) {
        if (pays.length > 0) {
            for (let i in pays) {
                sum += pays[i].money;
            }
        }
        callback(sum);
    });
}

function getIncome(callback) {
    var sum = 0;
    db.income.find({ createdAt: { $gte: startup } }, { money: 1, }, function(err, pays) {
        if (pays.length > 0) {
            for (let i in pays) {
                sum += pays[i].money;
            }
        }
        callback(sum)
    });
}

function generateReply(projects, progs, sumPayment, sumIncome) {
    var rep = "";
    var text = "";
    var textArr = [];
    if (progs.length > 0) {
        for (let i in progs) {
            if (i > 0 && i % 3 == 0) rep += "[wait 1000][clear]";
            for (let j in projects) {
                if (progs[i].projectID == projects[j]._id) {
                    text += "「" + projects[j].name + "」の";
                    break;
                }
            }
            text += "「" + progs[i].content + "」\n";
        }
        text += "をしたんだぁ。";
        textArr.push(text);
    }

    text = "";
    sumPayment = Number(sumPayment);
    sumIncome = Number(sumIncome);
    if (sumIncome > 0 || sumPayment > 0) {
        var sum = sumIncome - sumPayment;
        text += "収入は" + sumIncome.toLocaleString() + "円で、\n" + "支出は" + sumPayment.toLocaleString() + "円。";
        if (Math.abs(sum) > 0) {
            text += "\nだから結局……" + Math.abs(sum) + "円の" + ((sum < 0) ? "赤字" : "黒字") + "、[wait 300]かな？";
        }
        textArr.push(text);
    }

    if (textArr.length > 0) {
        rep += "[wait 1000][clear]えーっと、今日は……\n";
        rep += textArr.join("[wait 1000][clear]それで、\n");
        rep += "[wait 1000][clear]うん、今日はすごく頑張ったね、<呼び名>。\n[wait 1000]";
    }

    return rep;
}