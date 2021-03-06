const Datastore = require('nedb');
var db = {};

var date = new Date();
date.setHours(0, 0, 0, 0);

exports = function(arg, callback) {

    var rep = "";

    var projects;
    var progs;

    var sumPayment = 0;
    var sumIncome = 0;

    delete require.cache[require.resolve(__characterDir + '/module/common')];
    var common = require(__characterDir + "/module/common");

    loadDB("project");
    loadDB("progress");
    loadDB("payment");
    loadDB("income");

    common.getSerifs(__characterDir, "goodNight", function(serifs) {
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
                    callback({ serif: rep, isEnd: true });
                });
            });
        });
    });

};

function getProgress(callback) {
    db.project.find().exec(function(err, projects) {
        db.progress.find({ createdAt: { $gte: date } }, { content: 1, projectID: 1 }, function(err, progs) {
            callback(projects, progs);
        });
    });
}

function getPayment(callback) {
    var sum = 0;

    db.payment.find({ createdAt: { $gte: date } }, { money: 1, }, function(err, pays) {
        if (pays.length > 0) {
            for (let i in pays) {
                sum += Number(pays[i].money);
            }
        }
        callback(sum);
    });
}

function getIncome(callback) {
    var sum = 0;
    db.income.find({ createdAt: { $gte: date } }, { money: 1, }, function(err, pays) {
        if (pays.length > 0) {
            for (let i in pays) {
                sum += Number(pays[i].money);
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

function loadDB(name) {
    if (!db[name]) {
        db[name] = new Datastore({
            filename: __characterDir + '/db/' + name + '.db',
            autoload: true,
            timestampData: true
        });
    }
}