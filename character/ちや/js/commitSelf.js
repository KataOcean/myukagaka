var repPath = "./"
var branch = "koutei_chan"
const exec = require('child_process').exec;

exports = function(callback) {

    var rep = "";

    exec("git add -A", (err, stdout, stderr) => {
        if (err) { console.log(err); }
        exec("git commit -m " + arg[0], (err, stdout, stderr) => {
            if (err) { console.log(err); }
            rep = stdout;
            callback(rep);
        });
    });

    // newname = { oldname: user.nickname, name: arg[0] }

    // rep = "分かったわ。\nじゃあ、これからは「" + newname.oldname + "」じゃなくて、\n「" + newname.name + "」って呼ぶわね。\nこれからもよろしく、「" + newname.name + "」！";
    // store.set({
    //     user: {
    //         nickname: newname.name
    //     }
    // });

}