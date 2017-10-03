const Datastore = require('nedb');
var db = {};

exports = function(arg, callback) {

    var data = {
        serif: ""
    };

    loadDB("project");
    loadDB("progress");

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

function loadDB(name) {
    if (!db[name]) {
        db[name] = new Datastore({
            filename: __characterDir + '/db/' + name + '.db',
            autoload: true,
            timestampData: true
        });
    }
}