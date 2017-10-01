var repPath = "./"
var branch = "koutei_chan"
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;

exports = function(callback) {

    var rep = "";
    var name = "";
    var branch = "";

    name = execSync("git config --global user.name");
    execSync("git add -A");
    execSync("git config --global user.name " + name + "@ちや");
    execSync("git config --global user.name " + name);
    execSync("git commit -m " + arg[0]);
    if (arg[1]) {
        branch = arg[1];
    } else {
        branch = execSync("git branch --contains=HEAD");
    }
    exec("git push origin " + branch, (err, stdout, stderr) => {
        if (err) { console.log(err); }
        rep = "はい、コミットしておいたわ。\n今日もおつかれさまでした。";
        callback(rep);
    });
    // newname = { oldname: user.nickname, name: arg[0] }

    // rep = "分かったわ。\nじゃあ、これからは「" + newname.oldname + "」じゃなくて、\n「" + newname.name + "」って呼ぶわね。\nこれからもよろしく、「" + newname.name + "」！";
    // store.set({
    //     user: {
    //         nickname: newname.name
    //     }
    // });

}