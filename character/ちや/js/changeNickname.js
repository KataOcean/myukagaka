exports = function(callback) {

    var rep = "";

    newname = { oldname: user.nickname, name: arg[0] }

    rep = "分かったわ。\nじゃあ、これからは「" + newname.oldname + "」じゃなくて、\n「" + newname.name + "」って呼ぶわね。\nこれからもよろしく、「" + newname.name + "」！";
    store.set({
        user: {
            nickname: newname.name
        }
    });

    callback(rep, { user: store.get('user') });

}