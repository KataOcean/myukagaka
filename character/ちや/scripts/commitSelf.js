const exec = require('child_process').exec;
const execSync = require('child_process').execSync;

exports = function(arg, callback) {

    var rep = "";
    var name = "";
    var branch = "";

    delete require.cache[require.resolve(__characterDir + '/module/common')];
    var common = require(__characterDir + "/module/common");

    callback({ serif: "分かったわ。ちょっと、待っててね……。" });

    var addAndCommit = function() {
        try {

            execSync("git add -A");
            execSync("git config --global user.name " + name + "@ちや");
            execSync("git commit -m " + arg[0]);
            exec("git push origin " + branch, (err, stdout, stderr) => {
                if (err) { console.log(err); }
                execSync("git config --global user.name " + name);
                common.getSerifs(__characterDir, "commitSelf", function(serifs) {
                    rep = common.getRandomSerif(serifs["end"]);
                    callback({ serif: rep });
                });
            });

        } catch (ex) {
            rep = "あら？エラーが出たみたいよ？\n" + ex + "\nですって。";
            callback({ serif: rep });
        }


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