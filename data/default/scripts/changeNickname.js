exports = function(data, callback) {

    var rep = "";

    newname = { oldname: data.user.nickname, name: data.arg[0] }

    rep = "分かったわ。\nじゃあ、これからは「" + newname.oldname + "」じゃなくて、\n「" + newname.name + "」って呼ぶわね。\nこれからもよろしく、「" + newname.name + "」！";
    store.set({
        user: {
            nickname: newname.name
        }
    });

    callback(rep, { user: store.get('user') });

}