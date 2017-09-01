var main = require('electron').remote.require( "./main" );
$(function(){
    $( "#call" ).on( 'click' , function() {
        main.test();
    });
});