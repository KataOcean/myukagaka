const main = require('electron').remote.require("./main");
const remote = require('electron').remote;
const ipcRenderer = require('electron').ipcRenderer;
var prev = "";
$(function() {
    $('#userInput').keypress(function(e) {
        var charCode = (e.which) ? e.which : event.keyCode
        console.log(charCode);
        if (e.which == 13) {
            prev = "";
            var input = $('#userInput').val();
            $('#userInput').val('');
            $('#history').text("> " + input);
            main.send(input);
            $('#userInput').focus();
        }
    });

    $('#userInput').keydown(function(e) {
        if (e.keyCode == 38) {
            var text = $('#history').text();
            $('#userInput').val(text.substr(2));
            $('#userInput').get(0).setSelectionRange(text.length, pos);
        } else if (e.keyCode == 40) {
            $('#userInput').val('');
        }
    });

    $('#userInput').on('input', function(e) {
        var next = $('#userInput').val();
        if (prev != next) {
            var pos = $('#userInput').get(0).selectionEnd;
            if (prev.length < next.length) {
                var now = next.substr(pos - 1, 1);
                if (now == "「") {
                    $('#userInput').val(next + "」");
                    $('#userInput').get(0).setSelectionRange(pos, pos);
                }
            }
            prev = $('#userInput').val();
        }
    });

    $(window).focus(function() {
        console.log("focus");
        $('#userInput').focus();
    });
});

ipcRenderer.on('focus', () => {
    //    var window = remote.getCurrentWindow();
    //    window.focus();
    $('#userInput').focus();
});