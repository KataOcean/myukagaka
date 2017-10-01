var fs = require("fs");
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

exports = function(callback) {

    var rep = "";

    fs.readFile(__characterDir + "serifs/goodNight.json", 'utf8', function(err, serifs) {
        if (err) return;
        var json = JSON.parse(serifs);
        var before = json["before"];
        var after = json["after"];
        if (db) {

            rep = before[Math.floor(Math.floor(Math.random() * before.length))];;

            db.project.find().exec(function(err, projects) {
                db.progress.find({ createdAt: { $gte: startup } }, { content: 1, projectID: 1 }, function(err, progs) {
                    if (progs.length > 0) {
                        rep += "[wait 1000][clear]えーっと、今日は……\n";
                        for (let i in progs) {
                            if (i > 0 && i % 3 == 0) rep += "[wait 1000][clear]";
                            for (let j in projects) {
                                console.log(progs[i].projectID);
                                console.log(projects[j]._id);
                                if (progs[i].projectID == projects[j]._id) {
                                    rep += "「" + projects[j].name + "」の";
                                    break;
                                }
                            }
                            rep += "「" + progs[i].content + "」\n";
                        }
                        rep += "をしたんだぁ。\nうん、今日はすごく頑張ったね、" + user.nickname + "。";
                    }

                    rep += "[wait 1000][clear]";
                    rep += after[Math.floor(Math.floor(Math.random() * after.length))];;
                    inputWindow.hide();
                    callback(rep, { isEnd: true });

                });
            });
        }

    });
}