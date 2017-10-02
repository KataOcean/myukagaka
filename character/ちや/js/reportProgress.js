const Datastore = require('nedb');
var db = {};
db.project = new Datastore({
    filename: __characterDir + '/db/project.db',
    autoload: true,
    timestampData: true
});
db.progress = new Datastore({
    filename: __characterDir + '/db/progress.db',
    autoload: true,
    timestampData: true
});

exports = function(callback) {

    var data = {
        serif: ""
    };

    if (arg.length == 1) {
        var task = { content: arg[0] };
        data.serif = "ふふ、" + task.content + "をしたのね。\nそうなんだぁ。えらい、えらい！";
        db.progress.insert({
            content: task.content,
        });
        callback(data);

    } else {
        var task = { name: arg[0], content: arg[1] };
        data.serif = "ふふ、" + task.name + arg[2] + "\n" + task.content + "をしたのね。\nいつもお疲れさま！";

        db.project.findOne({ name: task.name }, (err, doc) => {
            if (!doc) {
                db.project.insert({
                    name: task.name
                }, (err, newDoc) => {
                    db.progress.insert({
                        content: task.content,
                        projectID: newDoc._id,
                    });
                    callback(data);
                });
            } else {
                db.progress.insert({
                    content: task.content,
                    projectID: doc._id,
                });
                callback(data);
            }
        });
    }
}