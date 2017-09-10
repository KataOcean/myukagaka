exports = function(data, callback) {

    var rep = "";

    if (data.arg.length == 1) {
        var task = { content: data.arg[0] };
        rep = "ふふ、" + task.content + "をしたのね。\nそうなんだぁ。えらい、えらい！";
        data.db.progress.insert({
            content: task.content,
        });
        callback(rep);

    } else {
        var task = { name: data.arg[0], content: data.arg[1] };
        rep = "ふふ、" + task.name + "の" + task.content + "をしたのね。\nそうなんだぁ。えらい、えらい！";

        data.db.project.findOne({ name: task.name }, (err, doc) => {
            if (!doc) {
                data.db.project.insert({
                    name: task.name
                }, (err, newDoc) => {
                    data.db.progress.insert({
                        content: task.content,
                        projectID: newDoc._id,
                    });
                    say(rep);
                });
            } else {
                data.db.progress.insert({
                    content: task.content,
                    projectID: doc._id,
                });
                callback(rep);
            }
        });
    }
}