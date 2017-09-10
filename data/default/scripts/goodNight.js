exports = function(data, callback) {

    var rep = "";

    if (data.db) {
        rep = "あらあら、もうお休みかしら。[wait 1000][clear]";

        data.db.progress.find({ createdAt: { $gte: data.startup } }, { content: 1 }, function(err, docs) {
            rep += "えーっと、今日は……\n";
            for (let i in docs) {
                rep += "「" + docs[i].content + "」";
            }
            rep += "\nをしたんだぁ。";
            rep += "[wait 1000][clear]うん、今日はすごく頑張ったね、" + data.user.nickname + "。\nじゃあ……おやすみなさい。\nまた明日…[wait 300]…[wait 300]ね？";
            callback(rep, { isEnd: true });
        });
    }

}