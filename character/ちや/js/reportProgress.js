exports = function(callback) {

    var rep = "";

    if (arg.length == 1) {
        var task = { content: arg[0] };
        rep = "ふふ、" + task.content + "をしたのね。\nそうなんだぁ。えらい、えらい！";
        db.progress.insert({
            content: task.content,
        });
        callback(rep);

    } else {
        var task = { name: arg[0], content: arg[1] };
        rep = "ふふ、" + task.name + "の" + task.content + "をしたのね。\nそうなんだぁ。えらい、えらい！";

        db.project.findOne({ name: task.name }, (err, doc) => {
            if (!doc) {
                db.project.insert({
                    name: task.name
                }, (err, newDoc) => {
                    db.progress.insert({
                        content: task.content,
                        projectID: newDoc._id,
                    });
                    callback(rep);
                });
            } else {
                db.progress.insert({
                    content: task.content,
                    projectID: doc._id,
                });
                callback(rep);
            }
        });
    }
}