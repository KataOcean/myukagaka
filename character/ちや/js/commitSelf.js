var repPath = "./"
var branch = "koutei_chan"
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;

exports = function(callback) {

    var rep = "";
    var name = "";
    var branch = "";

    var addAndCommit = function() {
        execSync("git add -A");
        execSync("git config --global user.name " + name + "@ちや");
        execSync("git commit -m " + arg[0]);
        exec("git push origin " + branch, (err, stdout, stderr) => {
            if (err) { console.log(err); }
            rep = "はい、コミットしておいたわ。\n今回はどんな変更だったのかしら…[wait 30]…[wait 30]？";
            execSync("git config --global user.name " + name);
            callback(rep);
        });
    }

    name = execSync("git config --global user.name");
    if (arg[1]) {
        branch = arg[1];
        exec("git checkout -b " + branch, (err, stdout, stderr) => {
            if (stderr) execSync("git checkout " + branch);
            addAndCommit();
        });
    } else {
        branch = execSync("git branch --contains=HEAD");
        addAndCommit();
    }

}