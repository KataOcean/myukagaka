exports = function(callback) {

    var rep = "";
    inputWindow.hide();
    fs.readFile(__characterDir + "serifs/goodNight.txt", 'utf8', function(err, serifs) {
        if (db) {

            rep = "そうね、そろそろおねむの時間かしら。";

            db.progress.find({ createdAt: { $gte: startup } }, { content: 1 }, function(err, docs) {
                if (docs.length > 0) {
                    rep += "[wait 1000][clear]えーっと、今日は……\n";
                    for (let i in docs) {
                        rep += "「" + docs[i].content + "」";
                    }
                    rep += "\nをしたんだぁ。\nうん、今日はすごく頑張ったね、" + user.nickname + "。";
                }
                rep += "[wait 1000][clear]じゃあ……おやすみなさい。\nまた明日…[wait 300]…[wait 300]ね？";
                callback(rep, { isEnd: true });
            });
        }
    });

}