var timer;
var waittime;
//文字を一文字ずつ表示する。
function delayText(obj, text, callback) {
    clearTimeout(timer);
    obj.text("");
    var count = 0;
    var default_delay = 60;

    var getCommand = function(obj, token) {
        console.log(token);
        var com;
        if (com = token.match(/^(clear|c)/)) {
            return function() {
                obj.text('');
            }
        } else if (obj = token.match(/^(wait|w) ([0-9]+)/)) {
            console.log(obj);
            return function() {
                clearTimeout(timer);
                timer = setTimeout(countText, obj[2]);
            }
        }
    }

    var countText = function() {
        var command = null;
        var waittime = default_delay;
        if (text[count] == "[") {
            var lastpos = text.indexOf("]", count + 1);
            if (lastpos >= 0) {
                command = getCommand(obj, text.substring(count + 1, lastpos));
                count = lastpos;
            }
        }

        timer = setTimeout(countText, default_delay);

        if (command) {
            command();
        } else {
            obj.append(text[count].replace(/\n/, "<br>"));
        }

        count++;
        if (count == text.length) {
            count = 0;
            clearTimeout(timer);
            callback();
        }
    }
    countText();
}

function getCommand(token) {

}