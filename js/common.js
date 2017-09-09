var timer;
//文字を一文字ずつ表示する。
function delayText(obj, text, delay, callback) {
    clearTimeout(timer);
    obj.text("");
    var count = 0;
    var countText = function() {
        timer = setTimeout(countText, delay);
        obj.append(text[count].replace(/\n/, "<br>"));
        count++;
        if (count == text.length) {
            count = 0;
            clearTimeout(timer);
            callback();
        }
    }
    countText();
}